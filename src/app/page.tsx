"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, Warehouse, CookingPot, Sparkles, Palette } from "lucide-react";
import { CHEFS } from "@/lib/chefs";
import { DISH_TYPES } from "@/lib/dishes";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const steps = [
  {
    icon: CookingPot,
    title: "报菜名",
    desc: "给你的作品起个主题",
  },
  {
    icon: Palette,
    title: "选菜式",
    desc: "选择你想要的文体类型",
  },
  {
    icon: ChefHat,
    title: "选手艺",
    desc: "名家风格或自创素材，二选一",
  },
  {
    icon: Sparkles,
    title: "上菜",
    desc: "AI 融合风格与灵感，端出佳作",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-50 text-warm-900">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-28 pb-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-6xl sm:text-7xl font-bold tracking-tight text-warm-800"
            variants={fadeInUp}
          >
            文字厨房
          </motion.h1>
          <motion.p
            className="mt-6 text-lg sm:text-xl text-warm-600 max-w-xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            你读过的每一段文字都不会浪费，它们会变成你笔下的味道。
          </motion.p>
          <motion.div className="mt-10" variants={fadeInUp}>
            <Link
              href="/kitchen"
              className="inline-flex items-center gap-2 rounded-full bg-warm-700 px-8 py-3.5 text-lg font-medium text-white shadow-lg hover:bg-warm-800 transition-colors"
            >
              <CookingPot className="h-5 w-5" />
              开始烹饪
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <motion.section
        className="max-w-4xl mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-warm-800 mb-12"
          variants={fadeInUp}
        >
          烹饪四步曲
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center gap-3 rounded-2xl bg-warm-100 p-6 text-center"
              variants={fadeInUp}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-200 text-warm-700">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="text-sm text-warm-500 font-medium">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-warm-800">
                {step.title}
              </h3>
              <p className="text-sm text-warm-600 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Menu preview */}
      <motion.section
        className="max-w-4xl mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-warm-800 mb-4"
          variants={fadeInUp}
        >
          今日菜单
        </motion.h2>
        <motion.p
          className="text-center text-warm-500 mb-12"
          variants={fadeInUp}
        >
          九种文体，九道风味，总有一款适合你
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISH_TYPES.map((dish) => (
            <motion.div key={dish.id} variants={fadeInUp}>
              <Link
                href={`/kitchen?dish=${dish.id}`}
                className="group block rounded-2xl bg-white p-5 shadow-sm border border-warm-100 hover:shadow-md hover:border-warm-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{dish.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-warm-800 group-hover:text-warm-600 transition-colors">
                      {dish.name}
                    </h3>
                    <span className="inline-block mt-1 text-xs font-medium text-warm-500 bg-warm-100 rounded-full px-2.5 py-0.5">
                      {dish.category}
                    </span>
                    <p className="mt-2 text-sm text-warm-600 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Chef gallery */}
      <motion.section
        className="max-w-4xl mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-warm-800 mb-4"
          variants={fadeInUp}
        >
          大厨阵容
        </motion.h2>
        <motion.p
          className="text-center text-warm-500 mb-12"
          variants={fadeInUp}
        >
          十三位风格迥异的文字大厨，等你挑选
        </motion.p>
        <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible">
          {CHEFS.map((chef) => (
            <motion.div
              key={chef.id}
              className="flex-shrink-0 w-64 sm:w-auto rounded-2xl bg-white p-5 shadow-sm border border-warm-100"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{chef.emoji}</span>
                <h3 className="text-lg font-semibold text-warm-800">
                  {chef.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {chef.styleTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs font-medium text-warm-600 bg-warm-100 rounded-full px-2.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-warm-500 leading-relaxed line-clamp-3">
                {chef.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section
        className="max-w-4xl mx-auto px-4 pt-8 pb-24 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl font-bold text-warm-800 mb-4"
          variants={fadeInUp}
        >
          准备好了吗？
        </motion.h2>
        <motion.p
          className="text-warm-500 mb-8"
          variants={fadeInUp}
        >
          好菜需要好食材，先去仓库备上几段你喜欢的文字吧
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link
            href="/pantry"
            className="inline-flex items-center gap-2 rounded-full bg-warm-700 px-8 py-3.5 text-lg font-medium text-white shadow-lg hover:bg-warm-800 transition-colors"
          >
            <Warehouse className="h-5 w-5" />
            先去准备食材
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
