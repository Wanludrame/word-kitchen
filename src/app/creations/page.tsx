"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Copy, ChevronDown, ChevronUp, CookingPot, Check, Download } from "lucide-react";
import { getCreations, removeCreation } from "@/lib/storage";
import { CHEFS } from "@/lib/chefs";
import { DISH_TYPES } from "@/lib/dishes";
import type { Creation } from "@/lib/types";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getCreations();
    loaded.sort((a, b) => b.createdAt - a.createdAt);
    setCreations(loaded);
  }, []);

  function handleDelete(id: string) {
    const updated = removeCreation(id);
    updated.sort((a, b) => b.createdAt - a.createdAt);
    setCreations(updated);
    setDeletingId(null);
    if (expandedId === id) setExpandedId(null);
  }

  async function handleCopy(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function getDishType(dishTypeId: string) {
    return DISH_TYPES.find((d) => d.id === dishTypeId);
  }

  // Backward compatibility for renamed dish types
  const LEGACY_DISHES: Record<string, { emoji: string; name: string }> = {
    "flash-fiction": { emoji: "🥟", name: "闪小说" },
  };

  function getDishDisplay(dishTypeId: string) {
    const dish = getDishType(dishTypeId);
    if (dish) return { emoji: dish.emoji, name: dish.name };
    const legacy = LEGACY_DISHES[dishTypeId];
    if (legacy) return legacy;
    return { emoji: "🍽️", name: dishTypeId };
  }

  function getChefName(chefId: string) {
    if (chefId === "default") return "厨房默认";
    const chef = CHEFS.find((c) => c.id === chefId);
    return chef ? chef.name : "未知厨师";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">出菜记录</h1>
          <p className="text-warm-500 text-sm mt-1">
            {creations.length > 0
              ? `共 ${creations.length} 道作品`
              : "还没有作品"}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {creations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <CookingPot className="w-16 h-16 text-warm-300 mb-4" />
          <p className="text-warm-600 text-lg mb-4">
            还没有作品，快去厨房做一道菜吧！
          </p>
          <Link
            href="/kitchen"
            className="inline-flex items-center gap-2 px-6 py-3 bg-toast text-white rounded-xl font-semibold hover:bg-warm-500 transition-colors"
          >
            <CookingPot className="w-5 h-5" />
            去厨房
          </Link>
        </div>
      )}

      {/* Creation list */}
      <div className="space-y-4">
        {creations.map((creation) => {
          const dishDisplay = getDishDisplay(creation.dishType);
          const isExpanded = expandedId === creation.id;
          const isDeleting = deletingId === creation.id;
          const isCopied = copiedId === creation.id;

          return (
            <div
              key={creation.id}
              className="bg-white rounded-xl border border-warm-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card header - clickable */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : creation.id)
                }
                className="w-full text-left px-5 py-4 flex items-start gap-4 cursor-pointer"
              >
                {/* Dish type emoji */}
                <span className="text-2xl mt-0.5 shrink-0">
                  {dishDisplay.emoji}
                </span>

                {/* Card body */}
                <div className="flex-1 min-w-0">
                  {/* Dish type label */}
                  <span className="text-xs font-medium text-toast bg-warm-100 px-2 py-0.5 rounded-full">
                    {dishDisplay.name}
                  </span>

                  {/* Dish name (title) */}
                  <h2 className="text-lg font-semibold text-warm-900 mt-1 truncate">
                    {creation.dishName}
                  </h2>

                  {/* Chef + date */}
                  <p className="text-sm text-warm-500 mt-1">
                    {getChefName(creation.chefId)} &middot;{" "}
                    {formatDate(creation.createdAt)}
                  </p>

                  {/* Preview */}
                  {!isExpanded && (
                    <p className="text-warm-700 text-sm mt-2 leading-relaxed line-clamp-3">
                      {creation.content.length > 200
                        ? creation.content.slice(0, 200) + "..."
                        : creation.content}
                    </p>
                  )}
                </div>

                {/* Expand icon */}
                <span className="text-warm-400 mt-1 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-warm-100">
                  {/* Full content - reading view */}
                  <div className="px-5 py-6 prose max-w-none">
                    <div className="text-warm-800 leading-[1.9] whitespace-pre-wrap text-base">
                      {creation.content}
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="px-5 py-3 bg-warm-50 border-t border-warm-100 flex items-center justify-between">
                    {/* Copy & Download buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(creation.id, creation.content)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors text-warm-600 hover:text-warm-800 hover:bg-warm-100"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>复制</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([creation.content], { type: "text/plain;charset=utf-8" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${creation.dishName}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors text-warm-600 hover:text-warm-800 hover:bg-warm-100"
                      >
                        <Download className="w-4 h-4" />
                        <span>下载</span>
                      </button>
                    </div>

                    {/* Delete button */}
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-warm-500">确认删除？</span>
                        <button
                          onClick={() => handleDelete(creation.id)}
                          className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          删除
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1.5 text-sm text-warm-600 hover:text-warm-800 rounded-lg hover:bg-warm-100 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(creation.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-warm-400 hover:text-red-500 rounded-lg hover:bg-warm-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>删除</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
