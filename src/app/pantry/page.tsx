"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { getIngredients, addIngredient, removeIngredient, generateId } from "@/lib/storage";
import { Ingredient } from "@/lib/types";

export default function PantryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    setIngredients(getIngredients());
  }, []);

  const parsedTags = tagsInput
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const ingredient: Ingredient = {
      id: generateId(),
      title: title.trim(),
      content: content.trim(),
      source: source.trim() || undefined,
      tags: parsedTags,
      createdAt: Date.now(),
    };

    const updated = addIngredient(ingredient);
    setIngredients(updated);
    setTitle("");
    setContent("");
    setSource("");
    setTagsInput("");
  }

  function handleDelete(id: string) {
    const updated = removeIngredient(id);
    setIngredients(updated);
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const canSubmit = title.trim() !== "" && content.trim() !== "";

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-28 md:pt-24">
      {/* Stats bar */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-6 h-6 text-toast" />
        <h1 className="text-2xl font-bold text-warm-800">食材库</h1>
        <span className="ml-auto text-sm text-warm-500">
          共 <span className="font-semibold text-warm-700">{ingredients.length}</span> 份食材
        </span>
      </div>

      {/* Add ingredient form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-warm-200 p-6 mb-8 space-y-4 shadow-sm"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="给这段文字起个名"
          className="w-full px-4 py-2.5 rounded-lg border border-warm-200 bg-warm-50 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-toast/40 focus:border-toast transition-colors"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="粘贴你喜欢的文字..."
          rows={5}
          className="w-full px-4 py-2.5 rounded-lg border border-warm-200 bg-warm-50 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-toast/40 focus:border-toast transition-colors resize-y"
        />

        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="来源（选填）"
          className="w-full px-4 py-2.5 rounded-lg border border-warm-200 bg-warm-50 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-toast/40 focus:border-toast transition-colors"
        />

        {/* Tags input */}
        <div>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="标签，用逗号分隔（如：散文，治愈，张爱玲）"
            className="w-full px-4 py-2.5 rounded-lg border border-warm-200 bg-warm-50 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-toast/40 focus:border-toast transition-colors"
          />
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {parsedTags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-warm-100 text-warm-600 border border-warm-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-toast text-white font-semibold transition-colors hover:bg-warm-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          加入食材库
        </button>
      </form>

      {/* Ingredient list */}
      {ingredients.length === 0 ? (
        <div className="text-center py-20 text-warm-400">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg">食材库还是空的，快去添加一些你喜欢的文字吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="bg-white rounded-xl border border-warm-200 p-5 shadow-sm relative group"
            >
              <button
                onClick={() => handleDelete(ing.id)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-warm-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <h3 className="font-semibold text-warm-800 text-lg mb-1 pr-8">
                {ing.title}
              </h3>

              <p className="text-warm-600 text-sm leading-relaxed mb-3">
                {ing.content.length > 100
                  ? ing.content.slice(0, 100) + "..."
                  : ing.content}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {ing.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-warm-100 text-warm-600 border border-warm-200"
                  >
                    {tag}
                  </span>
                ))}
                {ing.source && (
                  <span className="text-warm-400 ml-1">
                    来源：{ing.source}
                  </span>
                )}
                <span className="text-warm-300 ml-auto">
                  {formatDate(ing.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
