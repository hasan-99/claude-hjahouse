// Central site data: nav, learn modules, footer, search index, i18n.
// Mirrors claude.hjahouse.me structure so every page-builder shares one source of truth.
// Rebranded locally as claude.hjahouse.me.

export type Level = "beginner" | "intermediate" | "advanced";
export type Locale = "en" | "ar";

export interface ModuleMeta {
  slug: string;
  index: number;
  title: string;
  titleAr: string;
  level: Level;
  duration: string;
  durationAr: string;
  summary: string;
}

export const SITE = {
  name: "claude",
  domain: ".hjahouse.me",
  author: "Hasan Jahoush",
  version: "v1.24.12",
  year: 2026,
  parentUrl: "https://hjahouse.me",
  inspiredBy: {
    label: "luongnv89/claude-howto",
    url: "https://github.com/luongnv89/claude-howto",
  },
};

export const NAV = [
  { label: "Learn", labelAr: "تعلّم", href: "/learn" },
  { label: "Playground", labelAr: "الساحة", href: "/playground" },
  { label: "Config Builder", labelAr: "منشئ الإعدادات", href: "/build" },
  { label: "Cheat Sheet", labelAr: "ورقة مرجعية", href: "/reference" },
];

export const MODULES: ModuleMeta[] = [
  { slug: "getting-started", index: 0, title: "Getting Started", titleAr: "البداية", level: "beginner", duration: "20 min", durationAr: "٢٠ دقيقة", summary: "What Claude Code is, how to install it, and your first session in the terminal." },
  { slug: "slash-commands", index: 1, title: "Slash Commands", titleAr: "أوامر السلاش", level: "beginner", duration: "30 min", durationAr: "٣٠ دقيقة", summary: "Type / at the prompt for built-in commands. Filter, run, and chain them." },
  { slug: "memory", index: 2, title: "Memory & CLAUDE.md", titleAr: "الذاكرة و CLAUDE.md", level: "beginner", duration: "45 min", durationAr: "٤٥ دقيقة", summary: "How Claude Code remembers context across sessions with CLAUDE.md files and auto memory." },
  { slug: "project-setup", index: 3, title: "Project Setup", titleAr: "إعداد المشروع", level: "beginner", duration: "45 min", durationAr: "٤٥ دقيقة", summary: "Configure Claude Code for a new or existing project with CLAUDE.md, permissions, and settings." },
  { slug: "commands", index: 4, title: "Commands Deep Dive", titleAr: "الأوامر بالتفصيل", level: "beginner", duration: "30 min", durationAr: "٣٠ دقيقة", summary: "Reasoning effort, verbose mode, model selection, and the commands you reach for daily." },
  { slug: "skills", index: 5, title: "Skills", titleAr: "المهارات", level: "intermediate", duration: "1 hour", durationAr: "ساعة", summary: "Reusable capabilities Claude discovers and uses automatically based on context." },
  { slug: "hooks", index: 6, title: "Hooks", titleAr: "الـ Hooks", level: "intermediate", duration: "1 hour", durationAr: "ساعة", summary: "Run shell commands on lifecycle events — matchers, exec form, and validation gates." },
  { slug: "mcp", index: 7, title: "MCP Servers", titleAr: "خوادم MCP", level: "intermediate", duration: "1 hour", durationAr: "ساعة", summary: "The Model Context Protocol gives Claude live access to external services in real time." },
  { slug: "subagents", index: 8, title: "Subagents", titleAr: "الوكلاء الفرعيون", level: "intermediate", duration: "1 hour", durationAr: "ساعة", summary: "Delegate work to specialized agents with their own context and tool scopes." },
  { slug: "advanced-features", index: 9, title: "Advanced Features", titleAr: "ميزات متقدمة", level: "advanced", duration: "1.5 hours", durationAr: "ساعة ونصف", summary: "Run Claude Code programmatically with claude -p, sandboxing, permissions, and config." },
  { slug: "workflows", index: 10, title: "Workflows", titleAr: "سير العمل", level: "advanced", duration: "1 hour", durationAr: "ساعة", summary: "Build CI/CD integrations, scheduled tasks, and multi-step automation workflows." },
  { slug: "plugins", index: 11, title: "Plugins", titleAr: "الإضافات", level: "advanced", duration: "1.5 hours", durationAr: "ساعة ونصف", summary: "Package commands, hooks, skills, and agents into installable plugins." },
];

export const moduleBySlug = (slug: string) => MODULES.find((m) => m.slug === slug);

// Arabic one-line summaries (parallel to MODULES[].summary).
export const MODULE_SUMMARY_AR: Record<string, string> = {
  "getting-started": "ما هو Claude Code، كيف تثبّته، وأول جلسة لك في الـ terminal.",
  "slash-commands": "اكتب / عند الموجّه للأوامر المدمجة. فلترها، شغّلها، واربطها معًا.",
  memory: "كيف يتذكّر Claude Code السياق عبر الجلسات بملفات CLAUDE.md والذاكرة التلقائية.",
  "project-setup": "هيّئ Claude Code لمشروع جديد أو قائم عبر CLAUDE.md والصلاحيات والإعدادات.",
  commands: "مستوى التفكير، الوضع المفصّل، اختيار النموذج، والأوامر التي تستخدمها يوميًا.",
  skills: "قدرات قابلة لإعادة الاستخدام يكتشفها Claude ويستخدمها تلقائيًا حسب السياق.",
  hooks: "شغّل أوامر shell على أحداث دورة الحياة — المطابقات، صيغة exec، وبوابات التحقق.",
  mcp: "بروتوكول Model Context يمنح Claude وصولًا مباشرًا لخدمات خارجية في الوقت الفعلي.",
  subagents: "فوّض العمل لوكلاء متخصصين لهم سياقهم الخاص ونطاق أدواتهم.",
  "advanced-features": "تشغيل Claude Code برمجيًا عبر claude -p، والعزل، والصلاحيات، والإعدادات.",
  workflows: "ابنِ تكاملات CI/CD ومهامًا مجدولة وسير عمل أتمتة متعدد الخطوات.",
  plugins: "احزم الأوامر والـ hooks والمهارات والوكلاء في إضافات قابلة للتثبيت.",
};

export const levelLabel: Record<Locale, Record<Level, string>> = {
  en: { beginner: "beginner", intermediate: "intermediate", advanced: "advanced" },
  ar: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" },
};

export const FOOTER_COLUMNS = [
  {
    title: "Start Here",
    titleAr: "ابدأ هنا",
    links: [
      { label: "Learning Modules", labelAr: "وحدات التعلّم", href: "/learn" },
      { label: "Find Your Level", labelAr: "اعرف مستواك", href: "/quiz" },
      { label: "Playground", labelAr: "الساحة", href: "/playground" },
    ],
  },
  {
    title: "Build & Reference",
    titleAr: "البناء والمراجع",
    links: [
      { label: "Config Builder", labelAr: "منشئ الإعدادات", href: "/build" },
      { label: "Cheat Sheet", labelAr: "ورقة مرجعية", href: "/reference" },
      { label: "Feature Index", labelAr: "فهرس الميزات", href: "/catalog" },
      { label: "Resources", labelAr: "مصادر", href: "/resources" },
    ],
  },
  {
    title: "Feedback",
    titleAr: "ملاحظات",
    links: [
      { label: "Feedback Tracker", labelAr: "متتبّع الملاحظات", href: "/feedback" },
      { label: "Changelog", labelAr: "سجل التغييرات", href: "/changelog" },
    ],
  },
];

export const STRINGS = {
  en: {
    tagline: "An interactive learning platform for Claude Code. Part of",
    search: "Search pages and modules…",
    modules: "Modules",
    skipToContent: "Skip to main content",
  },
  ar: {
    tagline: "منصّة تعلّم تفاعلية لـ Claude Code. جزء من",
    search: "ابحث في الصفحات والوحدات…",
    modules: "الوحدات",
    skipToContent: "تخطَّ إلى المحتوى الرئيسي",
  },
};

/** Prefix an internal href with the active locale. */
export function localize(href: string, locale: Locale): string {
  if (locale === "en") return href;
  if (href === "/") return "/ar";
  return href.startsWith("/ar") ? href : `/ar${href}`;
}

/** Derive locale from a pathname. */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
}

// Flat search index for the Ctrl+K command palette.
export interface SearchItem {
  title: string;
  href: string;
  group: string;
  keywords?: string;
}

export const SEARCH_INDEX: SearchItem[] = [
  { title: "Home", href: "/", group: "Pages" },
  { title: "Learning Modules", href: "/learn", group: "Pages" },
  { title: "Find Your Level (Quiz)", href: "/quiz", group: "Pages" },
  { title: "Playground", href: "/playground", group: "Pages", keywords: "terminal sandbox" },
  { title: "Config Builder", href: "/build", group: "Pages", keywords: "claude.md hooks plugin" },
  { title: "Cheat Sheet", href: "/reference", group: "Pages", keywords: "commands shortcuts" },
  { title: "Feature Index", href: "/catalog", group: "Pages", keywords: "catalog search" },
  { title: "Resources", href: "/resources", group: "Pages" },
  { title: "Changelog", href: "/changelog", group: "Pages" },
  { title: "Feedback Tracker", href: "/feedback", group: "Pages" },
  { title: "Roadmap", href: "/roadmap", group: "Pages" },
  ...MODULES.map((m) => ({
    title: m.title,
    href: `/learn/${m.slug}`,
    group: "Modules",
    keywords: `${m.level} module ${m.index}`,
  })),
];
