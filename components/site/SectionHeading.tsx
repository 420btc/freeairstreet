import { ReactNode } from "react"

interface SectionHeadingProps {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl text-left"} ${className}`}
    >
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-600 dark:text-yellow-400">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  )
}
