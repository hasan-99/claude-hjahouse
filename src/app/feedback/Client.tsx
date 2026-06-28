"use client";

import { useState } from "react";

/* ---- Status pill ---- */
export type FeedbackStatus = "Reviewing" | "Planned" | "Building" | "Shipped";

const statusStyles: Record<FeedbackStatus, string> = {
  Reviewing: "bg-accent-soft text-accent",
  Planned:   "bg-intermediate/10 text-intermediate",
  Building:  "bg-beginner/10 text-beginner",
  Shipped:   "bg-bg-muted text-fg-muted",
};

export function StatusPill({
  status,
  label,
}: {
  status: FeedbackStatus;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {label ?? status}
    </span>
  );
}

/* ---- Tag pill ---- */
const tagStyles: Record<string, string> = {
  Bug:     "border-advanced/40 text-advanced",
  Feature: "border-beginner/40 text-beginner",
};

export function TagPill({ tag }: { tag: string }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${tagStyles[tag] ?? "border-border text-fg-subtle"}`}
    >
      {tag}
    </span>
  );
}

/* ---- Upvote button (client-side toggle) ---- */
export function UpvoteButton({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial);
  const [voted, setVoted] = useState(false);

  const toggle = () => {
    if (voted) {
      setCount((c) => c - 1);
    } else {
      setCount((c) => c + 1);
    }
    setVoted((v) => !v);
  };

  return (
    <button
      onClick={toggle}
      aria-label={voted ? "Remove upvote" : "Upvote"}
      className={`flex min-h-[40px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 active:scale-95 ${
        voted
          ? "border-accent bg-accent text-accent-fg shadow-[var(--shadow-sm)]"
          : "border-border bg-bg-subtle text-fg-muted hover:border-accent/40 hover:text-accent"
      }`}
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill={voted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 4l8 8H4z" />
      </svg>
      <span>{count}</span>
    </button>
  );
}

/* ---- Filter tabs ---- */
export type FilterTabLabels = {
  All: string;
  Reviewing: string;
  Planned: string;
  Building: string;
  Shipped: string;
};

const DEFAULT_FILTER_LABELS: FilterTabLabels = {
  All: "All",
  Reviewing: "Reviewing",
  Planned: "Planned",
  Building: "Building",
  Shipped: "Shipped",
};

export function FilterTabs({
  active,
  counts,
  onChange,
  labels = DEFAULT_FILTER_LABELS,
}: {
  active: FeedbackStatus | "All";
  counts: Record<string, number>;
  onChange: (v: FeedbackStatus | "All") => void;
  labels?: FilterTabLabels;
}) {
  const tabs: (FeedbackStatus | "All")[] = ["All", "Reviewing", "Planned", "Building", "Shipped"];
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {tabs.map((tab) => {
        const isActive = active === tab;
        const cnt = tab === "All" ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[tab] ?? 0);
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-accent bg-accent text-accent-fg shadow-[var(--shadow-sm)]"
                : "border-border bg-card text-fg-muted hover:border-accent/40 hover:text-fg"
            }`}
          >
            {labels[tab]}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                isActive ? "bg-white/20 text-inherit" : "bg-bg-muted text-fg-subtle"
              }`}
            >
              {cnt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---- Submit form (simple, client-side) ---- */
export type SubmitFormStrings = {
  titleLabel: string;
  titlePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  emailLabel: string;
  emailOptional: string;
  submitButton: string;
  successMessage: string;
};

const DEFAULT_FORM_STRINGS: SubmitFormStrings = {
  titleLabel: "Title",
  titlePlaceholder: "Brief summary of your feedback…",
  messageLabel: "Message",
  messagePlaceholder: "Describe the issue or feature request in detail…",
  emailLabel: "Email",
  emailOptional: "(optional)",
  submitButton: "Send Feedback",
  successMessage: "Thanks for your feedback! We'll review it soon.",
};

export function SubmitForm({
  strings = DEFAULT_FORM_STRINGS,
}: {
  strings?: SubmitFormStrings;
}) {
  const [sent, setSent] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-beginner/40 bg-beginner/8 px-5 py-4 text-sm text-fg animate-fade-in">
        <span className="text-beginner text-lg">✓</span>
        <span>{strings.successMessage}</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-fg">
            {strings.titleLabel} <span className="text-accent">*</span>
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={strings.titlePlaceholder}
            className="w-full rounded-lg border border-border bg-bg-subtle px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-fg">
            {strings.messageLabel} <span className="text-accent">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={strings.messagePlaceholder}
            className="w-full resize-none rounded-lg border border-border bg-bg-subtle px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-muted">
            {strings.emailLabel}{" "}
            <span className="text-fg-subtle text-xs font-normal">{strings.emailOptional}</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-bg-subtle px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:bg-accent-hover active:scale-95"
      >
        {strings.submitButton}
      </button>
    </form>
  );
}

/* ---- Full interactive board ---- */
export interface FeedbackItem {
  id: number;
  status: FeedbackStatus;
  tag?: string;
  title: string;
  preview: string;
  upvotes: number;
}

export function FeedbackBoard({
  items,
  filterLabels,
  statusLabels,
  emptyText,
}: {
  items: FeedbackItem[];
  filterLabels?: FilterTabLabels;
  statusLabels?: Partial<Record<FeedbackStatus, string>>;
  emptyText?: string;
}) {
  const [filter, setFilter] = useState<FeedbackStatus | "All">("All");

  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
  }

  const visible = filter === "All" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="space-y-6">
      <FilterTabs
        active={filter}
        counts={counts}
        onChange={setFilter}
        labels={filterLabels}
      />

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-fg-subtle">
          {emptyText ?? "No items in this category yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]"
            >
              {/* upvote */}
              <UpvoteButton initial={item.upvotes} />

              {/* content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <StatusPill
                    status={item.status}
                    label={statusLabels?.[item.status]}
                  />
                  {item.tag && <TagPill tag={item.tag} />}
                  <span className="font-mono text-xs text-fg-faint">#{item.id}</span>
                </div>
                <h3 className="text-sm font-semibold text-fg leading-snug group-hover:text-accent transition">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-fg-muted leading-relaxed">
                  {item.preview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
