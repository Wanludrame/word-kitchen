"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChefHat,
  CookingPot,
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
} from "lucide-react";
import { CHEFS } from "@/lib/chefs";
import { DISH_TYPES } from "@/lib/dishes";
import {
  PORTION_OPTIONS,
  HEAT_OPTIONS,
  FLAVOR_OPTIONS,
  PERSPECTIVE_OPTIONS,
  ERA_OPTIONS,
  DEFAULT_SEASONING,
  filterOptions,
} from "@/lib/seasoning";
import { getDishConfig, getDefaultSeasoningForDish } from "@/lib/dish-config";
import { getIngredients, saveCreation, generateId } from "@/lib/storage";
import type { Ingredient, Seasoning, DishType, Creation } from "@/lib/types";

/* ──────────────────────────────────────────────
   Step labels for the progress bar
   ────────────────────────────────────────────── */
const STEP_LABELS = [
  "选食材",
  "报菜名",
  "选菜式",
  "选厨师",
  "调味",
  "上菜",
];

/* ──────────────────────────────────────────────
   Progress bar component
   ────────────────────────────────────────────── */
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === step;
        const isDone = stepNum < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-toast text-white scale-110 shadow-lg"
                    : isDone
                    ? "bg-warm-300 text-white"
                    : "bg-warm-100 text-warm-400"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`text-xs hidden sm:block transition-colors ${
                  isActive
                    ? "text-toast font-semibold"
                    : isDone
                    ? "text-warm-500"
                    : "text-warm-300"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-6 h-0.5 rounded transition-colors ${
                  stepNum < step ? "bg-warm-300" : "bg-warm-100"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Navigation buttons
   ────────────────────────────────────────────── */
function StepNav({
  step,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel,
  nextIcon,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  nextIcon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mt-8">
      {step > 1 ? (
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-warm-600 hover:bg-warm-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>上一步</span>
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-toast text-white font-semibold hover:bg-warm-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        <span>{nextLabel || "下一步"}</span>
        {nextIcon || <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main kitchen content component
   ────────────────────────────────────────────── */
function KitchenContent() {
  const searchParams = useSearchParams();

  // State machine step (1-6)
  const [step, setStep] = useState(1);

  // Step 1: ingredients
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<string>>(new Set());

  // Step 2: dish name
  const [dishName, setDishName] = useState("");

  // Step 3: dish type
  const [selectedDish, setSelectedDish] = useState<DishType | null>(null);

  // Step 4: chef (null means "厨房默认")
  const [selectedChefId, setSelectedChefId] = useState<string | null>(null);

  // Step 5: seasoning
  const [seasoning, setSeasoning] = useState<Seasoning>({ ...DEFAULT_SEASONING });

  // Step 6: cooking result
  const [content, setContent] = useState("");
  const [isCooking, setIsCooking] = useState(false);
  const [cookingError, setCookingError] = useState("");
  const [saved, setSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load ingredients on mount
  useEffect(() => {
    setAllIngredients(getIngredients());
  }, []);

  // Pre-select dish type from URL
  useEffect(() => {
    const dishParam = searchParams.get("dish");
    if (dishParam && DISH_TYPES.some((d) => d.id === dishParam)) {
      setSelectedDish(dishParam as DishType);
    }
  }, [searchParams]);

  // Reset seasoning to dish-specific defaults when dish type changes
  useEffect(() => {
    if (selectedDish) {
      setSeasoning(getDefaultSeasoningForDish(selectedDish));
    }
  }, [selectedDish]);

  // Auto-scroll while streaming
  useEffect(() => {
    if (isCooking && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [content, isCooking]);

  /* ── Helpers ── */
  const toggleIngredient = (id: string) => {
    setSelectedIngredientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIngredientIds.size === allIngredients.length) {
      setSelectedIngredientIds(new Set());
    } else {
      setSelectedIngredientIds(new Set(allIngredients.map((i) => i.id)));
    }
  };

  const selectedIngredients = allIngredients.filter((i) =>
    selectedIngredientIds.has(i.id)
  );

  const selectedChef = CHEFS.find((c) => c.id === selectedChefId) || null;

  const updateSeasoning = <K extends keyof Seasoning>(key: K, value: Seasoning[K]) => {
    setSeasoning((prev) => ({ ...prev, [key]: value }));
  };

  /* ── Cooking logic ── */
  const startCooking = async () => {
    setIsCooking(true);
    setContent("");
    setCookingError("");
    setSaved(false);

    try {
      const response = await fetch("/api/cook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName,
          dishType: selectedDish,
          chefStylePrompt: selectedChef?.stylePrompt || "",
          seasoning,
          ingredients: selectedIngredients.map((i) => ({
            title: i.title,
            content: i.content,
          })),
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error || `请求失败 (${response.status})`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setContent((prev) => prev + parsed.text);
              }
              if (parsed.error) {
                setCookingError(parsed.error);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "未知错误";
      setCookingError(`烹饪过程中出了点问题：${msg}`);
    } finally {
      setIsCooking(false);
    }
  };

  const handleSave = () => {
    if (!content || !selectedDish) return;
    const creation: Creation = {
      id: generateId(),
      dishName,
      dishType: selectedDish,
      chefId: selectedChefId || "default",
      seasoning,
      content,
      ingredientIds: Array.from(selectedIngredientIds),
      createdAt: Date.now(),
    };
    saveCreation(creation);
    setSaved(true);
  };

  /* ──────────────────────────────────────────
     Render each step
     ────────────────────────────────────────── */

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-warm-800 mb-2">
        <span className="mr-2">1.</span>选食材
      </h2>
      <p className="text-warm-500 mb-6">从你的食材库中选择参考素材，为创作提供灵感。</p>

      {allIngredients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-warm-400 text-lg mb-4">食材库还是空的呢...</p>
          <p className="text-warm-300 text-sm mb-6">
            没关系，你可以直接进入创作，也可以先去食材库添加一些素材。
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={toggleSelectAll}
            className="mb-4 px-4 py-2 rounded-lg border border-warm-200 text-warm-600 hover:bg-warm-50 text-sm transition-colors"
          >
            {selectedIngredientIds.size === allIngredients.length
              ? "取消全选"
              : "全选"}
          </button>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {allIngredients.map((ing) => {
              const checked = selectedIngredientIds.has(ing.id);
              return (
                <label
                  key={ing.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    checked
                      ? "border-toast bg-warm-50 shadow-sm"
                      : "border-warm-100 hover:border-warm-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleIngredient(ing.id)}
                    className="mt-1 accent-toast w-4 h-4"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-warm-800 truncate">
                      {ing.title}
                    </h3>
                    <p className="text-sm text-warm-500 line-clamp-2 mt-1">
                      {ing.content}
                    </p>
                    {ing.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ing.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-warm-100 text-warm-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </>
      )}

      <div className="flex items-center justify-between mt-8">
        <div />
        <div className="flex items-center gap-3">
          {allIngredients.length > 0 && selectedIngredientIds.size === 0 && (
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-50 text-sm transition-colors"
            >
              不选食材，直接创作
            </button>
          )}
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-toast text-white font-semibold hover:bg-warm-500 transition-all shadow-md hover:shadow-lg"
          >
            <span>下一步</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-warm-800 mb-2">
        <span className="mr-2">2.</span>报菜名
      </h2>
      <p className="text-warm-500 mb-6">给你的作品起一个主题或方向。</p>

      <div className="py-8">
        <input
          type="text"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          placeholder="今天想做什么菜？比如：深夜的便利店、一封没寄出的信..."
          className="w-full text-xl px-6 py-5 rounded-2xl border-2 border-warm-200 focus:border-toast focus:outline-none bg-white text-warm-800 placeholder:text-warm-300 transition-colors"
          autoFocus
        />
      </div>

      <StepNav
        step={step}
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
        nextDisabled={!dishName.trim()}
      />
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-warm-800 mb-2">
        <span className="mr-2">3.</span>选菜式
      </h2>
      <p className="text-warm-500 mb-6">选择作品的体裁。</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {DISH_TYPES.map((dish) => {
          const isSelected = selectedDish === dish.id;
          return (
            <button
              key={dish.id}
              onClick={() => setSelectedDish(dish.id)}
              className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                isSelected
                  ? "border-toast bg-warm-50 shadow-md"
                  : "border-warm-100 hover:border-warm-200 bg-white"
              }`}
            >
              <span className="text-2xl mb-2">{dish.emoji}</span>
              <span className="font-semibold text-warm-800">{dish.name}</span>
              <span className="text-xs text-toast mt-0.5">{dish.category}</span>
              <span className="text-xs text-warm-400 mt-1 leading-relaxed">
                {dish.description}
              </span>
            </button>
          );
        })}
      </div>

      <StepNav
        step={step}
        onBack={() => setStep(2)}
        onNext={() => setStep(4)}
        nextDisabled={!selectedDish}
      />
    </div>
  );

  const renderStep4 = () => {
    const recommendedChefs = CHEFS.filter((c) => c.bestDishes.includes(selectedDish!));
    const otherChefs = CHEFS.filter((c) => !c.bestDishes.includes(selectedDish!));

    const renderChefButton = (chef: typeof CHEFS[number], isRecommended: boolean) => {
      const isSelected = selectedChefId === chef.id;
      return (
        <button
          key={chef.id}
          onClick={() => setSelectedChefId(chef.id)}
          className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
            isSelected
              ? "border-toast bg-warm-50 shadow-md"
              : isRecommended
              ? "border-warm-100 hover:border-warm-200 bg-white"
              : "border-warm-100 hover:border-warm-200 bg-white opacity-60"
          }`}
        >
          <span className="text-3xl">{chef.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-warm-800">{chef.name}</h3>
              {isRecommended && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                  擅长此菜
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {chef.styleTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-warm-100 text-warm-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-warm-400 mt-2 line-clamp-2">
              {chef.description}
            </p>
          </div>
        </button>
      );
    };

    return (
      <div>
        <h2 className="text-2xl font-bold text-warm-800 mb-2">
          <span className="mr-2">4.</span>选厨师
        </h2>
        <p className="text-warm-500 mb-6">选一位风格厨师来创作你的作品。</p>

        <div className="space-y-3">
          {/* Default chef option */}
          <button
            onClick={() => setSelectedChefId(null)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
              selectedChefId === null
                ? "border-toast bg-warm-50 shadow-md"
                : "border-warm-100 hover:border-warm-200 bg-white"
            }`}
          >
            <span className="text-3xl">🍳</span>
            <div className="flex-1">
              <h3 className="font-semibold text-warm-800">厨房默认</h3>
              <p className="text-sm text-warm-400 mt-1">
                不指定特定风格，让AI自由发挥
              </p>
            </div>
          </button>

          {/* Recommended chefs */}
          {recommendedChefs.length > 0 && (
            <>
              <p className="text-xs text-warm-400 font-medium pt-2">推荐厨师</p>
              {recommendedChefs.map((chef) => renderChefButton(chef, true))}
            </>
          )}

          {/* Other chefs */}
          {otherChefs.length > 0 && (
            <>
              <p className="text-xs text-warm-400 font-medium pt-2">其他厨师</p>
              {otherChefs.map((chef) => renderChefButton(chef, false))}
            </>
          )}
        </div>

        <StepNav
          step={step}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      </div>
    );
  };

  const renderStep5 = () => {
    const config = getDishConfig(selectedDish!);

    const renderOptionGroup = <T extends string>(
      label: string,
      options: { value: T; label: string; desc?: string }[],
      current: T,
      onChange: (v: T) => void
    ) => (
      <div className="mb-6">
        <h3 className="font-semibold text-warm-700 mb-3">{label}</h3>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const isSelected = current === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                  isSelected
                    ? "border-toast bg-toast text-white font-semibold shadow-sm"
                    : "border-warm-100 text-warm-600 hover:border-warm-200 bg-white"
                }`}
              >
                <span>{opt.label}</span>
                {opt.desc && (
                  <span
                    className={`ml-1.5 text-xs ${
                      isSelected ? "text-white/70" : "text-warm-300"
                    }`}
                  >
                    {opt.desc}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );

    return (
      <div>
        <h2 className="text-2xl font-bold text-warm-800 mb-2">
          <span className="mr-2">5.</span>调味
        </h2>
        <p className="text-warm-500 mb-6">微调创作参数，让作品更合你口味。</p>

        {renderOptionGroup("篇幅", filterOptions(PORTION_OPTIONS, config.portion.available), seasoning.portion, (v) =>
          updateSeasoning("portion", v)
        )}
        {renderOptionGroup("火候", filterOptions(HEAT_OPTIONS, config.heat.available), seasoning.heat, (v) =>
          updateSeasoning("heat", v)
        )}
        {renderOptionGroup("口味", filterOptions(FLAVOR_OPTIONS, config.flavor.available), seasoning.flavor, (v) =>
          updateSeasoning("flavor", v)
        )}
        {config.perspective &&
          renderOptionGroup("视角", filterOptions(PERSPECTIVE_OPTIONS, config.perspective.available), seasoning.perspective, (v) =>
            updateSeasoning("perspective", v)
          )}
        {config.era &&
          renderOptionGroup("时代", filterOptions(ERA_OPTIONS, config.era.available), seasoning.era, (v) =>
            updateSeasoning("era", v)
          )}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(4)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-warm-600 hover:bg-warm-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>上一步</span>
          </button>
          <button
            onClick={() => {
              setStep(6);
              // Defer cooking to next tick so UI renders first
              setTimeout(startCooking, 100);
            }}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-toast text-white font-bold text-lg hover:bg-warm-500 transition-all shadow-lg hover:shadow-xl"
          >
            <span>开始烹饪！</span>
            <CookingPot className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderStep6 = () => (
    <div>
      {/* Cooking animation / header */}
      {isCooking && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-warm-100 text-warm-700">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-toast animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-toast animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-toast animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="font-semibold">正在烹饪中...</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-toast animate-bounce" style={{ animationDelay: "450ms" }} />
              <span className="w-2 h-2 rounded-full bg-toast animate-bounce" style={{ animationDelay: "600ms" }} />
              <span className="w-2 h-2 rounded-full bg-toast animate-bounce" style={{ animationDelay: "750ms" }} />
            </div>
          </div>
        </div>
      )}

      {!isCooking && content && !cookingError && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-50 text-green-700">
            <Check className="w-4 h-4" />
            <span className="font-semibold">烹饪完成！</span>
          </div>
        </div>
      )}

      {/* Summary of choices */}
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        {selectedDish && (
          <span className="px-3 py-1 rounded-full bg-warm-100 text-warm-700">
            {DISH_TYPES.find((d) => d.id === selectedDish)?.emoji}{" "}
            {DISH_TYPES.find((d) => d.id === selectedDish)?.name}
          </span>
        )}
        <span className="px-3 py-1 rounded-full bg-warm-100 text-warm-700">
          {selectedChef ? `${selectedChef.emoji} ${selectedChef.name}` : "🍳 厨房默认"}
        </span>
        <span className="px-3 py-1 rounded-full bg-warm-100 text-warm-700">
          「{dishName}」
        </span>
      </div>

      {/* Content area */}
      <div
        ref={resultRef}
        className="prose min-h-[200px] max-h-[60vh] overflow-y-auto p-6 sm:p-8 bg-white rounded-2xl border border-warm-100 shadow-inner whitespace-pre-wrap leading-relaxed text-warm-800"
      >
        {content || (
          <div className="flex items-center justify-center h-48 text-warm-300">
            <CookingPot className="w-12 h-12 animate-pulse" />
          </div>
        )}
      </div>

      {/* Error state */}
      {cookingError && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {cookingError}
        </div>
      )}

      {/* Action buttons (shown when cooking is done) */}
      {!isCooking && content && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
              saved
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-toast text-white hover:bg-warm-500 hover:shadow-lg"
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{saved ? "已保存" : "保存作品"}</span>
          </button>

          <button
            onClick={() => {
              setContent("");
              setCookingError("");
              setSaved(false);
              setDishName("");
              setStep(2);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-warm-200 text-warm-600 font-semibold hover:bg-warm-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再来一份</span>
          </button>

          <button
            onClick={() => {
              setContent("");
              setCookingError("");
              setSaved(false);
              setStep(4);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-warm-200 text-warm-600 font-semibold hover:bg-warm-50 transition-all"
          >
            <ChefHat className="w-4 h-4" />
            <span>换个做法</span>
          </button>
        </div>
      )}

      {/* Retry on error */}
      {!isCooking && cookingError && !content && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              setStep(6);
              setTimeout(startCooking, 100);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-toast text-white font-semibold hover:bg-warm-500 transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新烹饪</span>
          </button>
        </div>
      )}
    </div>
  );

  /* ── Main render ── */
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProgressBar step={step} />
      {renderCurrentStep()}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Default export with Suspense wrapper
   (required because useSearchParams is used)
   ────────────────────────────────────────────── */
export default function KitchenPage() {
  return (
    <Suspense fallback={null}>
      <KitchenContent />
    </Suspense>
  );
}
