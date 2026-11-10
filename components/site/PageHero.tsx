import { ReactNode } from "react"

export interface PageHeroStat {
  value: ReactNode
  label: ReactNode
  icon?: ReactNode
}

interface PageHeroProps {
  badge?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  image?: string
  imageAlt?: string
  stats?: PageHeroStat[]
  actions?: ReactNode
  compact?: boolean
}

export function PageHero({
  badge,
  title,
  subtitle,
  image,
  imageAlt = "",
  stats,
  actions,
  compact = false,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#04122b]">
      {image ? (
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04122b]/70 via-[#04122b]/85 to-[#04122b]" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className={`container relative mx-auto px-4 ${compact ? "py-14 md:py-20" : "py-16 md:py-24"}`}>
        <div className="mx-auto max-w-4xl text-center">
          {badge ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200 backdrop-blur-md">
              {badge}
            </span>
          ) : null}

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>

          {subtitle ? (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">{subtitle}</p>
          ) : null}

          {actions ? (
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              {actions}
            </div>
          ) : null}

          {stats && stats.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md transition hover:border-yellow-300/40 hover:bg-white/10"
                >
                  {stat.icon ? <div className="mb-2 text-yellow-300">{stat.icon}</div> : null}
                  <p className="text-base font-extrabold text-white sm:text-lg">{stat.value}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-blue-200/70">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
