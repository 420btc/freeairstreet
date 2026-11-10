"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bike,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Droplets,
  Gauge,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  QrCode,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageToggle } from "@/components/LanguageToggle"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ReservationModal } from "@/components/ReservationModal"
import { useLanguage } from "@/contexts/LanguageContext"

type Locale = "es" | "en"
type RouteLevel = "easy" | "medium" | "hard"

interface RoutePackage {
  id: string
  name: Record<Locale, string>
  tagline: Record<Locale, string>
  description: Record<Locale, string>
  duration: Record<Locale, string>
  durationShort: Record<Locale, string>
  price: number
  distance: number
  elevation: number
  level: RouteLevel
  surface: Record<Locale, string>
  image: string
  highlights: Record<Locale, string[]>
  stops: Record<Locale, string[]>
  mapPoints: [number, number][]
  profile: number[]
}

const HERO_IMAGE = "/rutas/ruta-costa.jpg"

const routes: RoutePackage[] = [
  {
    id: "costa",
    name: { es: "Costa & La Farola", en: "Coast & La Farola" },
    tagline: {
      es: "La ruta suave para enamorarse del Mediterráneo",
      en: "The easy ride to fall in love with the Mediterranean",
    },
    description: {
      es: "Paseo costero por La Carihuela y Puerto Marina hasta La Farola de Málaga, Muelle Uno y La Malagueta. Casi todo llano, con el mar siempre a la derecha.",
      en: "A coastal ride through La Carihuela and Puerto Marina to Málaga's La Farola lighthouse, Muelle Uno and La Malagueta. Mostly flat, with the sea always on your right.",
    },
    duration: { es: "2,5 horas", en: "2.5 hours" },
    durationShort: { es: "2,5 h", en: "2.5 h" },
    price: 20,
    distance: 38,
    elevation: 180,
    level: "easy",
    surface: { es: "Asfalto y carril bici", en: "Asphalt and bike lane" },
    image: "/rutas/ruta-carihuela.jpg",
    highlights: {
      es: ["La Carihuela", "Puerto Marina", "La Farola", "Muelle Uno", "La Malagueta"],
      en: ["La Carihuela", "Puerto Marina", "La Farola", "Muelle Uno", "La Malagueta"],
    },
    stops: {
      es: ["Tienda La Colina", "La Carihuela", "Puerto Marina", "Benalmádena Costa", "La Farola", "La Malagueta"],
      en: ["La Colina shop", "La Carihuela", "Puerto Marina", "Benalmádena Costa", "La Farola", "La Malagueta"],
    },
    mapPoints: [
      [55, 250],
      [145, 242],
      [240, 222],
      [335, 192],
      [435, 152],
      [520, 112],
    ],
    profile: [12, 18, 15, 24, 32, 28, 22, 30, 26, 18, 12, 10],
  },
  {
    id: "miradores",
    name: { es: "Miradores de Benalmádena & Mijas", en: "Benalmádena & Mijas Viewpoints" },
    tagline: {
      es: "Sube, respira y mira la Costa del Sol desde arriba",
      en: "Climb, breathe and look down on the Costa del Sol",
    },
    description: {
      es: "Ascenso suave con asistencia eléctrica a Benalmádena Pueblo y Mijas Pueblo, entre castillos, plazas encaladas y miradores con el mar de fondo.",
      en: "A gentle electric-assisted climb to Benalmádena Pueblo and Mijas Pueblo, past castles, whitewashed squares and viewpoints with the sea in the background.",
    },
    duration: { es: "3 horas", en: "3 hours" },
    durationShort: { es: "3 h", en: "3 h" },
    price: 30,
    distance: 45,
    elevation: 680,
    level: "medium",
    surface: { es: "Carretera secundaria y pista", en: "Secondary road and track" },
    image: "/rutas/ruta-miradores.jpg",
    highlights: {
      es: ["Benalmádena Pueblo", "Castillo de Colomares", "Mijas Pueblo", "Mirador de Mijas", "Puerto Marina"],
      en: ["Benalmádena Pueblo", "Colomares Castle", "Mijas Pueblo", "Mijas viewpoint", "Puerto Marina"],
    },
    stops: {
      es: ["Tienda La Colina", "Benalmádena Costa", "Benalmádena Pueblo", "Castillo de Colomares", "Mijas Pueblo", "Puerto Marina"],
      en: ["La Colina shop", "Benalmádena Costa", "Benalmádena Pueblo", "Colomares Castle", "Mijas Pueblo", "Puerto Marina"],
    },
    mapPoints: [
      [55, 250],
      [145, 210],
      [220, 150],
      [300, 108],
      [390, 140],
      [500, 112],
    ],
    profile: [20, 70, 150, 240, 330, 420, 380, 430, 470, 520, 470, 390, 300, 210, 140, 90],
  },
  {
    id: "gran-vuelta",
    name: { es: "Gran Vuelta Mijas · Guadalhorce", en: "Grand Mijas · Guadalhorce Loop" },
    tagline: {
      es: "La ruta épica de medio día, con premio en cada cima",
      en: "The epic half-day ride, with a reward on every climb",
    },
    description: {
      es: "Circular de 58 km por Churriana, Alhaurín de la Torre, Alhaurín el Grande y Mijas Pueblo. La ruta completa para quien quiere algo que contar al volver a casa.",
      en: "A 58 km loop through Churriana, Alhaurín de la Torre, Alhaurín el Grande and Mijas Pueblo. The full ride for anyone who wants a story to tell back home.",
    },
    duration: { es: "6 horas", en: "6 hours" },
    durationShort: { es: "6 h", en: "6 h" },
    price: 40,
    distance: 58,
    elevation: 830,
    level: "hard",
    surface: { es: "Mixto: asfalto y camino", en: "Mixed: asphalt and trail" },
    image: "/rutas/ruta-gran-vuelta.jpg",
    highlights: {
      es: ["Churriana", "Alhaurín el Grande", "Mijas Pueblo", "Benalmádena Pueblo", "Valle del Guadalhorce"],
      en: ["Churriana", "Alhaurín el Grande", "Mijas Pueblo", "Benalmádena Pueblo", "Guadalhorce Valley"],
    },
    stops: {
      es: ["Tienda La Colina", "Churriana", "Alhaurín de la Torre", "Alhaurín el Grande", "Mijas Pueblo", "Benalmádena", "Vuelta por la costa"],
      en: ["La Colina shop", "Churriana", "Alhaurín de la Torre", "Alhaurín el Grande", "Mijas Pueblo", "Benalmádena", "Return along the coast"],
    },
    mapPoints: [
      [55, 250],
      [150, 235],
      [120, 170],
      [210, 118],
      [330, 80],
      [430, 135],
      [520, 112],
    ],
    profile: [20, 90, 180, 260, 350, 300, 420, 520, 610, 720, 640, 760, 830, 700, 560, 430, 300, 190, 90, 40],
  },
]

const copy = {
  es: {
    navTitle: "Rutas",
    heroBadge: "Nuevo · Rutas guiadas por el dueño de Free Air Street",
    heroTitleTop: "Rutas por",
    heroTitleHighlight: "Málaga",
    heroSubtitle:
      "De la costa de Torremolinos a los pueblos blancos de Mijas. Tres rutas en bici eléctrica, guiadas en persona, con paradas para fotos, miradores y buena conversación.",
    heroCtaPrimary: "Elegir mi ruta",
    heroCtaSecondary: "Cómo funciona",
    statRoutes: "3 rutas",
    statRoutesLabel: "para todos los niveles",
    statDuration: "2,5 · 3 · 6 h",
    statDurationLabel: "tú eliges el ritmo",
    statPrice: "20 · 30 · 40 €",
    statPriceLabel: "por persona",
    statGuide: "Guía local",
    statGuideLabel: "el dueño te lleva",
    pickEyebrow: "Temporada 2026",
    pickTitle: "Elige tu ruta",
    pickSubtitle: "Precio por persona · Bici eléctrica y casco incluidos · Salida desde nuestra tienda en La Colina",
    perPerson: "/ persona",
    km: "km",
    elevationGain: "desnivel +",
    level: "nivel",
    levelEasy: "Fácil",
    levelMedium: "Moderada",
    levelHard: "Exigente",
    viewRoute: "Ver ruta",
    bookRoute: "Reservar",
    selected: "Seleccionada",
    detailEyebrow: "Ruta seleccionada",
    detailTitle: "Tu ruta, al detalle",
    profileTitle: "Perfil de elevación",
    profileMax: "cota máxima",
    mapTitle: "Recorrido",
    mapNote: "Vista esquemática · GPS y track real al reservar",
    stopsTitle: "Paradas y puntos clave",
    includesTitle: "Qué incluye",
    includes: ["Bici eléctrica", "Casco", "Guía local (el dueño)", "Seguro", "Agua"],
    schedule: "Salida y llegada",
    scheduleValue: "Calle de la Playa 22, La Colina · Torremolinos",
    startTime: "Horario",
    startTimeValue: "9:00 – 18:00 (tú eliges)",
    groupSize: "Grupo",
    groupSizeValue: "Máx. 6 personas",
    surfaceLabel: "Terreno",
    bookThis: "Reservar esta ruta",
    bookingEyebrow: "Solicitud de cita",
    bookingTitle: "Pide tu ruta",
    bookingSubtitle:
      "Dinos la ruta, el día, la hora y cuántos venís. Te confirmamos la cita por email o WhatsApp el mismo día.",
    routeLabel: "1 · Elige la ruta",
    dateLabel: "2 · Fecha",
    timeLabel: "Hora",
    peopleLabel: "3 · Personas",
    estimate: "Total estimado",
    requestBtn: "Solicitar cita por email",
    whatsapp: "Prefiero WhatsApp",
    stepsNote:
      "Sin pago ahora. Al pulsar se abre el formulario con tus datos ya rellenados; el dueño confirma disponibilidad y te indica el punto de encuentro.",
    faqTitle: "Preguntas rápidas",
    faqs: [
      {
        q: "¿La bici y el casco están incluidos?",
        a: "Sí. Todas las rutas incluyen bicicleta eléctrica, casco, seguro y agua. Solo trae calzado cómodo y ganas de mirar el paisaje.",
      },
      {
        q: "¿Quién guía la ruta?",
        a: "El dueño de Free Air Street. Grupos pequeños, ritmo tranquilo y paradas para fotos, café o un baño si apetece.",
      },
      {
        q: "¿Puedo hacerla si no estoy en forma?",
        a: "Sí. La asistencia eléctrica suaviza mucho las cuestas. La ruta de 6 h pide algo más de hábito, pero se adapta el ritmo.",
      },
      {
        q: "¿Qué pasa si llueve?",
        a: "Si el tiempo no acompaña, movemos la cita sin coste al siguiente día disponible. Hablamos contigo antes por WhatsApp.",
      },
      {
        q: "¿Dónde quedamos?",
        a: "En la tienda: Calle de la Playa 22, La Colina (Torremolinos). También valoramos recogida en hotel según la ruta.",
      },
    ],
    footerTagline: "Rent & Tours · Torremolinos",
    footerRights: "© 2025 Free Air Street. Todos los derechos reservados.",
    photoCredits:
      "Fotografías de ruta: Puerto Marina © Tiia Monto (CC BY-SA 3.0) · La Carihuela © Jl FilpoC (CC BY-SA 4.0) · Benalmádena © Terry Whalebone (CC BY 2.0) · Mijas © Olaf Tausch (CC BY 3.0)",
    backHome: "Volver al inicio",
    totalPeople: (n: number) => `${n} ${n === 1 ? "persona" : "personas"}`,
  },
  en: {
    navTitle: "Routes",
    heroBadge: "New · Guided routes by the owner of Free Air Street",
    heroTitleTop: "Routes around",
    heroTitleHighlight: "Málaga",
    heroSubtitle:
      "From the Torremolinos coast to the white villages of Mijas. Three electric-bike routes, personally guided, with stops for photos, viewpoints and good conversation.",
    heroCtaPrimary: "Choose my route",
    heroCtaSecondary: "How it works",
    statRoutes: "3 routes",
    statRoutesLabel: "for every level",
    statDuration: "2.5 · 3 · 6 h",
    statDurationLabel: "you choose the pace",
    statPrice: "20 · 30 · 40 €",
    statPriceLabel: "per person",
    statGuide: "Local guide",
    statGuideLabel: "the owner takes you",
    pickEyebrow: "2026 season",
    pickTitle: "Choose your route",
    pickSubtitle: "Price per person · Electric bike and helmet included · Starts at our shop in La Colina",
    perPerson: "/ person",
    km: "km",
    elevationGain: "elevation +",
    level: "level",
    levelEasy: "Easy",
    levelMedium: "Moderate",
    levelHard: "Demanding",
    viewRoute: "View route",
    bookRoute: "Book",
    selected: "Selected",
    detailEyebrow: "Selected route",
    detailTitle: "Your route, in detail",
    profileTitle: "Elevation profile",
    profileMax: "highest point",
    mapTitle: "The ride",
    mapNote: "Schematic view · Real GPS track when you book",
    stopsTitle: "Stops and highlights",
    includesTitle: "What's included",
    includes: ["Electric bike", "Helmet", "Local guide (the owner)", "Insurance", "Water"],
    schedule: "Start and finish",
    scheduleValue: "Calle de la Playa 22, La Colina · Torremolinos",
    startTime: "Time window",
    startTimeValue: "9:00 – 18:00 (you choose)",
    groupSize: "Group",
    groupSizeValue: "Max. 6 people",
    surfaceLabel: "Terrain",
    bookThis: "Book this route",
    bookingEyebrow: "Appointment request",
    bookingTitle: "Request your route",
    bookingSubtitle:
      "Tell us the route, the day, the time and how many of you are coming. We confirm by email or WhatsApp the same day.",
    routeLabel: "1 · Choose the route",
    dateLabel: "2 · Date",
    timeLabel: "Time",
    peopleLabel: "3 · People",
    estimate: "Estimated total",
    requestBtn: "Request appointment by email",
    whatsapp: "I prefer WhatsApp",
    stepsNote:
      "No payment now. Tapping opens the form with your details already filled in; the owner confirms availability and gives you the meeting point.",
    faqTitle: "Quick questions",
    faqs: [
      {
        q: "Are the bike and helmet included?",
        a: "Yes. Every route includes an electric bike, helmet, insurance and water. Just bring comfortable shoes and good vibes.",
      },
      {
        q: "Who guides the route?",
        a: "The owner of Free Air Street. Small groups, a relaxed pace and stops for photos, coffee or a swim if you feel like it.",
      },
      {
        q: "Can I do it if I'm not fit?",
        a: "Yes. Electric assistance makes the climbs much easier. The 6-hour route asks for a bit more habit, but we adapt the pace.",
      },
      {
        q: "What happens if it rains?",
        a: "If the weather doesn't cooperate, we move your booking at no cost to the next available day. We'll speak on WhatsApp first.",
      },
      {
        q: "Where do we meet?",
        a: "At the shop: Calle de la Playa 22, La Colina (Torremolinos). Hotel pickup can be arranged depending on the route.",
      },
    ],
    footerTagline: "Rent & Tours · Torremolinos",
    footerRights: "© 2025 Free Air Street. All rights reserved.",
    photoCredits:
      "Route photos: Puerto Marina © Tiia Monto (CC BY-SA 3.0) · La Carihuela © Jl FilpoC (CC BY-SA 4.0) · Benalmádena © Terry Whalebone (CC BY 2.0) · Mijas © Olaf Tausch (CC BY 3.0)",
    backHome: "Back to home",
    totalPeople: (n: number) => `${n} ${n === 1 ? "person" : "people"}`,
  },
}

const levelStyles: Record<RouteLevel, { dot: string; chip: string; bar: string }> = {
  easy: {
    dot: "bg-emerald-500",
    chip: "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    bar: "w-1/3 bg-emerald-500",
  },
  medium: {
    dot: "bg-amber-500",
    chip: "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-300",
    bar: "w-2/3 bg-amber-500",
  },
  hard: {
    dot: "bg-rose-500",
    chip: "border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-300",
    bar: "w-full bg-rose-500",
  },
}

function ElevationChart({ data, id, distance, maxLabel }: { data: number[]; id: string; distance: number; maxLabel: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1

  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 92 - ((value - min) / span) * 72,
  }))

  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
  const area = `${line} L100,100 L0,100 Z`

  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[28, 52, 76].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.25" className="text-slate-300 dark:text-slate-700" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke="#facc15" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>0 km</span>
        <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 text-yellow-700 dark:text-yellow-300">
          {max} m · {maxLabel}
        </span>
        <span>{distance} km</span>
      </div>
    </div>
  )
}

function RouteMap({ points, labels }: { points: [number, number][]; labels: string[] }) {
  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ")
  const labelIndexes = [0, Math.floor(points.length / 2), points.length - 1]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-inner">
      <svg viewBox="0 0 560 300" className="w-full" role="img" aria-label="Route map">
        <defs>
          <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a1a33" />
            <stop offset="100%" stopColor="#0e2846" />
          </linearGradient>
          <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="560" height="300" fill="url(#mapBg)" />

        <g stroke="#1c3a60" strokeWidth="1" opacity="0.6">
          {[40, 80, 120, 160, 200, 240].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="560" y2={y} strokeDasharray="3 8" />
          ))}
          {[70, 140, 210, 280, 350, 420, 490].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" strokeDasharray="3 8" />
          ))}
        </g>

        <path d="M -20 300 C 70 262, 130 244, 200 240 S 320 214, 400 176 S 500 132, 600 78 L 600 320 L -20 320 Z" fill="#0b2038" opacity="0.9" />
        <path d="M -20 300 C 70 262, 130 244, 200 240 S 320 214, 400 176 S 500 132, 600 78" fill="none" stroke="#23507a" strokeWidth="1.5" strokeDasharray="2 6" />

        <g fill="#ffffff" opacity="0.35">
          <text x="470" y="286" fontSize="10" letterSpacing="2">MAR MEDITERRÁNEO</text>
        </g>

        <path
          d={line}
          fill="none"
          stroke="#facc15"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="12 10"
          filter="url(#routeGlow)"
          className="route-line"
        />

        {points.map(([x, y], index) => {
          const isEdge = index === 0 || index === points.length - 1
          return (
            <g key={`${x}-${y}-${index}`}>
              <circle cx={x} cy={y} r={isEdge ? 7 : 4.5} fill={isEdge ? "#facc15" : "#ffffff"} stroke="#0a1a33" strokeWidth="2.5" />
              {labelIndexes.includes(index) && (
                <text
                  x={x}
                  y={index % 2 === 0 ? y - 14 : y + 22}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#e2e8f0"
                >
                  {labels[index]}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between">
        <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
          MALAGA · GPS
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-md">
          <Compass className="h-4 w-4" />
        </span>
      </div>
    </div>
  )
}

export default function RutasPage() {
  const { language, t } = useLanguage()
  const lang = language as Locale
  const text = copy[lang]

  const [selectedId, setSelectedId] = useState(routes[0].id)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingRoute, setBookingRoute] = useState<RoutePackage>(routes[0])
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0])
  const [bookingTime, setBookingTime] = useState("10:00")
  const [bookingPeople, setBookingPeople] = useState("2")

  const selected = routes.find((route) => route.id === selectedId) ?? routes[0]
  const selectedLevel = levelStyles[selected.level]

  const prefillData = useMemo(
    () => ({
      date: bookingDate,
      time: bookingTime,
      participants: bookingPeople,
    }),
    [bookingDate, bookingTime, bookingPeople],
  )

  const total = selected.price * Number(bookingPeople || 1)

  const levelLabel = (level: RouteLevel) =>
    level === "easy" ? text.levelEasy : level === "medium" ? text.levelMedium : text.levelHard

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const selectRoute = (route: RoutePackage) => {
    setSelectedId(route.id)
    window.setTimeout(() => scrollTo("detalle"), 120)
  }

  const openBooking = (route: RoutePackage) => {
    setSelectedId(route.id)
    setBookingRoute(route)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f6f8] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      <style>{`
        @keyframes routeDash { to { stroke-dashoffset: -44; } }
        .route-line { animation: routeDash 1.8s linear infinite; }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .float-slow { animation: floatSlow 7s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <Link href="/">
              <Button variant="ghost" size="lg" className="navbar-back-button p-4 text-blue-900 hover:text-blue-700">
                <ArrowLeft className="h-12 w-12" />
              </Button>
            </Link>

            <Link
              href="/"
              className="flex cursor-pointer items-center justify-center space-x-4 font-mono italic leading-3 tracking-tighter transition-opacity hover:opacity-80 sm:justify-start lg:space-x-8"
            >
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={64} height={64} className="rounded" />
              <div className="hidden text-center sm:text-left md:block">
                <h1 className="birthstone-regular navbar-title text-2xl font-black leading-tight text-blue-900 sm:text-4xl">
                  Free Air Street
                </h1>
                <p className="birthstone-regular navbar-subtitle -mt-3 hidden text-2xl text-blue-800 sm:block">Rent &amp; Tours</p>
              </div>
            </Link>

            <nav className="hidden flex-1 justify-center space-x-4 md:flex lg:space-x-8">
              <Link href="/alquiler" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                {t("header.rental")}
              </Link>
              <Link href="/tours" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                {t("header.tours")}
              </Link>
              <Link
                href="/rutas"
                className="navbar-desktop-link border-b-2 border-blue-900 font-medium text-blue-900 transition-colors hover:text-blue-700"
              >
                {t("header.routes")}
              </Link>
              <Link href="/tienda" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                {t("header.shop")}
              </Link>
              <Link href="/contacto" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                {t("header.contact")}
              </Link>
            </nav>

            <div className="flex flex-1 justify-center md:hidden">
              <h1 className="navbar-title text-lg font-bold text-blue-900">{text.navTitle}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className="hidden cursor-pointer items-center space-x-2 rounded-lg bg-white/20 px-3 py-2 transition-colors hover:bg-white/30 sm:flex"
                onClick={() => setIsQrModalOpen(true)}
              >
                <QrCode className="h-5 w-5 text-blue-900" />
                <span className="text-sm font-medium text-blue-900">{t("header.scanPrices")}</span>
              </div>

              <div className="flex items-center space-x-2">
                <LanguageToggle />
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
              </div>

              <button
                className="navbar-mobile-button text-blue-900 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="navbar-mobile-icon h-6 w-6" /> : <Menu className="navbar-mobile-icon h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="animate-slideDown border-t border-yellow-600 py-4 md:hidden">
              <nav className="flex flex-col space-y-4">
                <Link href="/alquiler" className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700">
                  {t("header.rental")}
                </Link>
                <Link href="/tours" className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700">
                  {t("header.tours")}
                </Link>
                <Link
                  href="/rutas"
                  className="navbar-mobile-text border-l-4 border-blue-900 pl-2 font-medium text-blue-900"
                >
                  {t("header.routes")}
                </Link>
                <Link href="/tienda" className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700">
                  {t("header.shop")}
                </Link>
                <Link href="/contacto" className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700">
                  {t("header.contact")}
                </Link>
                <div className="flex items-center space-x-4 border-t border-yellow-600 pt-4">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#04122b]">
        <img
          src={HERO_IMAGE}
          alt="Rutas guiadas por la costa de Málaga"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          onError={(event) => {
            event.currentTarget.style.display = "none"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04122b]/70 via-[#04122b]/80 to-[#04122b]" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="container relative mx-auto px-4 pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              {text.heroBadge}
            </span>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
              {text.heroTitleTop}{" "}
              <span className="relative inline-block text-yellow-300">
                {text.heroTitleHighlight}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 14" fill="none" aria-hidden="true">
                  <path d="M3 10C70 3 160 2 297 7" stroke="#facc15" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">{text.heroSubtitle}</p>

            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={() => scrollTo("rutas")}
                className="h-14 rounded-full bg-yellow-400 px-8 text-base font-bold text-blue-950 shadow-xl shadow-yellow-400/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                <RouteIcon className="mr-2 h-5 w-5" />
                {text.heroCtaPrimary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollTo("reservar")}
                className="h-14 rounded-full border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
              >
                {text.heroCtaSecondary}
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: RouteIcon, value: text.statRoutes, label: text.statRoutesLabel },
                { icon: Clock, value: text.statDuration, label: text.statDurationLabel },
                { icon: Gauge, value: text.statPrice, label: text.statPriceLabel },
                { icon: Users, value: text.statGuide, label: text.statGuideLabel },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md transition hover:border-yellow-300/40 hover:bg-white/10"
                >
                  <stat.icon className="mb-2 h-5 w-5 text-yellow-300" />
                  <p className="text-base font-extrabold text-white sm:text-lg">{stat.value}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-blue-200/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Route cards */}
      <section id="rutas" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-600 dark:text-yellow-400">{text.pickEyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{text.pickTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">{text.pickSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {routes.map((route) => {
            const isSelected = route.id === selected.id
            const level = levelStyles[route.level]
            return (
              <article
                key={route.id}
                onClick={() => selectRoute(route)}
                className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border bg-white shadow-sm transition-all duration-300 dark:bg-slate-900/70 ${
                  isSelected
                    ? "border-yellow-400 ring-4 ring-yellow-300/40 dark:border-yellow-400"
                    : "border-slate-200 hover:-translate-y-1 hover:shadow-xl dark:border-white/10"
                }`}
              >
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800">
                  <img
                    src={route.image}
                    alt={route.name[lang]}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display = "none"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold backdrop-blur-md ${level.chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${level.dot}`} />
                      {levelLabel(route.level)}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-blue-950 shadow-lg">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                  )}

                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-300">{route.durationShort[lang]}</p>
                      <h3 className="mt-1 text-2xl font-black leading-tight text-white">{route.name[lang]}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black leading-none text-white">{route.price}€</p>
                      <p className="text-[10px] font-medium text-white/70">{text.perPerson}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="font-semibold leading-snug">{route.tagline[lang]}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{route.description[lang]}</p>

                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center dark:bg-white/5">
                    <div>
                      <p className="text-lg font-extrabold">{route.distance}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{text.km}</p>
                    </div>
                    <div className="border-x border-slate-200 dark:border-white/10">
                      <p className="text-lg font-extrabold">+{route.elevation} m</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{text.elevationGain}</p>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold">{levelLabel(route.level)}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{text.level}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation()
                        selectRoute(route)
                      }}
                      className="h-12 flex-1 rounded-full border-slate-300 font-semibold dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                    >
                      {text.viewRoute}
                    </Button>
                    <Button
                      onClick={(event) => {
                        event.stopPropagation()
                        openBooking(route)
                      }}
                      className="h-12 flex-1 rounded-full bg-blue-900 font-semibold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                    >
                      {text.bookRoute}
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Selected route detail */}
      <section id="detalle" className="scroll-mt-24 border-y border-slate-200/70 bg-white/60 py-16 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02] md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-600 dark:text-yellow-400">{text.detailEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{selected.name[lang]}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">{selected.description[lang]}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${selectedLevel.chip}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${selectedLevel.dot}`} />
                {levelLabel(selected.level)}
              </span>
              <span className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300">
                {selected.surface[lang]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="h-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <MapPin className="h-5 w-5 text-yellow-500" />
                    {text.mapTitle}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{text.mapNote}</span>
                </div>
                <RouteMap points={selected.mapPoints} labels={selected.stops[lang]} />

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: Clock, label: selected.duration[lang] },
                    { icon: RouteIcon, label: `${selected.distance} ${text.km}` },
                    { icon: Mountain, label: `+${selected.elevation} m` },
                    { icon: Users, label: text.groupSizeValue },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-xs font-semibold dark:bg-white/5"
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-yellow-500" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Mountain className="h-5 w-5 text-yellow-500" />
                    {text.profileTitle}
                  </h3>
                  <span className="rounded-full bg-yellow-400/15 px-2.5 py-1 text-xs font-bold text-yellow-700 dark:text-yellow-300">
                    +{selected.elevation} m
                  </span>
                </div>
                <ElevationChart
                  data={selected.profile}
                  id={`elevation-${selected.id}`}
                  distance={selected.distance}
                  maxLabel={text.profileMax}
                />

                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className={`h-full rounded-full ${selectedLevel.bar}`} />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>{text.levelEasy}</span>
                  <span>{text.levelMedium}</span>
                  <span>{text.levelHard}</span>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <ShieldCheck className="h-5 w-5 text-yellow-500" />
                  {text.includesTitle}
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {text.includes.map((item, index) => {
                    const icons = [Bike, ShieldCheck, Users, Star, Droplets]
                    const Icon = icons[index] ?? Check
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-300">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {item}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 dark:border-white/10">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{text.schedule}</p>
                      <p className="text-sm font-medium">{text.scheduleValue}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{text.startTime}</p>
                      <p className="text-sm font-medium">{text.startTimeValue}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => openBooking(selected)}
                  className="mt-5 h-12 w-full rounded-full bg-yellow-400 font-bold text-blue-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
                >
                  {text.bookThis} · {selected.price}€
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Compass className="h-5 w-5 text-yellow-500" />
              {text.stopsTitle}
            </h3>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selected.stops[lang].map((stop, index) => (
                <li key={stop} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white dark:bg-yellow-400 dark:text-blue-950">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold">{stop}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="reservar" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="relative hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-8 text-white lg:col-span-2 lg:block">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #facc15 0, transparent 45%), radial-gradient(circle at 80% 80%, #3b82f6 0, transparent 45%)" }} />
              <div className="relative flex h-full flex-col">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-200">
                  <Calendar className="h-3.5 w-3.5" />
                  {text.bookingEyebrow}
                </span>
                <h2 className="mt-5 text-4xl font-black leading-tight">{text.bookingTitle}</h2>
                <p className="mt-4 text-sm leading-relaxed text-blue-100/85">{text.bookingSubtitle}</p>

                <div className="mt-8 space-y-4">
                  {[
                    { step: "1", label: text.routeLabel },
                    { step: "2", label: text.dateLabel },
                    { step: "3", label: text.peopleLabel },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-blue-950">
                        {item.step}
                      </span>
                      <span className="text-sm font-semibold text-white/90">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-200/70">{text.estimate}</p>
                    <p className="mt-1 text-5xl font-black text-yellow-300">{total}€</p>
                    <p className="mt-1 text-xs text-blue-100/70">
                      {selected.name[lang]} · {text.totalPeople(Number(bookingPeople || 1))}
                    </p>
                  </div>
                  <p className="mt-4 text-[11px] leading-relaxed text-blue-100/60">{text.stepsNote}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:col-span-3">
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">{text.bookingEyebrow}</p>
                  <h2 className="mt-1 text-3xl font-black">{text.bookingTitle}</h2>
                </div>
                <Sparkles className="h-7 w-7 text-yellow-400" />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{text.routeLabel}</Label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {routes.map((route) => (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => setSelectedId(route.id)}
                      className={`flex min-h-[64px] flex-col justify-center rounded-2xl border px-3 py-2 text-left transition ${
                        route.id === selected.id
                          ? "border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-300/50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm font-bold leading-tight">{route.name[lang]}</span>
                      <span className="mt-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                        {route.durationShort[lang]} · {route.price}€
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="route-date" className="text-sm font-semibold">
                    {text.dateLabel}
                  </Label>
                  <Input
                    id="route-date"
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(event) => setBookingDate(event.target.value)}
                    className="mt-1 h-12 rounded-xl border-slate-300 dark:border-white/15 dark:bg-white/5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">{text.timeLabel}</Label>
                  <Select value={bookingTime} onValueChange={setBookingTime}>
                    <SelectTrigger className="mt-1 h-12 rounded-xl border-slate-300 dark:border-white/15 dark:bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00"].map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-sm font-semibold">{text.peopleLabel}</Label>
                <Select value={bookingPeople} onValueChange={setBookingPeople}>
                  <SelectTrigger className="mt-1 h-12 rounded-xl border-slate-300 dark:border-white/15 dark:bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((people) => (
                      <SelectItem key={people} value={people.toString()}>
                        {text.totalPeople(people)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {selected.name[lang]} · {selected.price}€ × {bookingPeople}
                  </span>
                  <span className="text-2xl font-black">{total}€</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{text.perPerson} · {text.includes.join(" · ")}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => openBooking(selected)}
                  className="h-14 flex-1 rounded-full bg-blue-900 text-base font-bold text-white shadow-lg hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  {text.requestBtn}
                </Button>
                <a
                  href="https://wa.me/34655707412"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-6 text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300"
                >
                  <MessageCircle className="h-5 w-5" />
                  {text.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200/70 bg-white/60 py-16 dark:border-white/5 dark:bg-white/[0.02] md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">{text.faqTitle}</h2>
          <div className="mt-8 space-y-3">
            {text.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-yellow-300 dark:border-white/10 dark:bg-slate-900/70"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold sm:text-base">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-yellow-500 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-10 text-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={60} height={60} className="rounded" />
              <div>
                <h3 className="birthstone-regular text-xl font-bold">Free Air Street</h3>
                <p className="text-sm text-gray-700">{text.footerTagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/freeairstreet?igsh=d25kaDRkM3QwNGJ6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white transition hover:scale-105"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/34655707412"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white transition hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <Link href="/contacto" className="ml-2 text-sm font-semibold text-blue-900 hover:underline">
                {t("header.contact")}
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-yellow-600/40 pt-6 text-xs text-gray-700 md:flex-row">
            <div>
              <p>{text.footerRights}</p>
              <p className="mt-1 max-w-xl text-[10px] leading-snug opacity-70">{text.photoCredits}</p>
            </div>
            <Link href="/" className="font-semibold text-blue-900 hover:underline">
              {text.backHome}
            </Link>
          </div>
        </div>
      </footer>

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative mx-4 w-full max-w-md rounded-lg bg-gradient-to-br from-white via-blue-50 to-yellow-50 p-8">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ×
            </button>

            <div className="text-center">
              <h3 className="mb-4 text-2xl font-bold text-orange-600">Rent a Quad</h3>
              <div className="mb-6">
                <Image src="/rentwuad.png" alt="Rent Quad Logo" width={200} height={80} className="mx-auto" />
              </div>
              <div className="mb-6 rounded-lg bg-white p-4 shadow-lg">
                <Image src="/rentqr.png" alt="Rent a Quad QR Code" width={200} height={200} className="mx-auto" />
              </div>
              <Button
                onClick={() => window.open("https://quadaventuracostadelsol.com/actividades-de-aventura", "_blank")}
                className="w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Acceder a Quad Aventura
              </Button>
            </div>
          </div>
        </div>
      )}

      <ReservationModal
        key={`${bookingRoute.id}-${isModalOpen}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="tour"
        itemName={bookingRoute.name[lang]}
        itemPrice={`${bookingRoute.price}€`}
        itemDuration={bookingRoute.duration[lang]}
        prefillData={prefillData}
      />
    </div>
  )
}
