"use client"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bike,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  Menu,
  MessageCircle,
  QrCode,
  Sparkles,
  Tag,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHero } from "@/components/site/PageHero"
import { SectionHeading } from "@/components/site/SectionHeading"
import { SiteFooter } from "@/components/site/SiteFooter"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { LanguageToggle } from '../../components/LanguageToggle'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ReservationModal } from '../../components/ReservationModal'
import { useLanguage } from '../../contexts/LanguageContext'
import { useInventory } from '../../contexts/InventoryContext'
import { usePricing } from '../../contexts/PricingContext'

function VehicleImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0)
  const total = images.length
  const hasMultiple = total > 1

  const goTo = (direction: number) => {
    setCurrent((prev) => (prev + direction + total) % total)
  }

  return (
    <>
      <Image
        key={images[current]}
        src={images[current] || "/placeholder.svg"}
        alt={alt}
        fill
        className="animate-in object-cover fade-in duration-700 group-hover:scale-105"
      />
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/40 px-2.5 py-1.5 backdrop-blur">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ver imagen ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === current ? "w-4 bg-yellow-400" : "w-1.5 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default function AlquilerPage() {
  const { t, language } = useLanguage()
  const { getPrice } = usePricing()
  const { getAvailableStock, makeReservation, inventory } = useInventory()
  const translations = {
    es: {
      'rental.vehicles.cityBike.features': ['Cesta delantera', 'Luces LED', 'Cambio de 7 velocidades', 'Asiento cómodo'],
      'rental.vehicles.mountainBike.features': ['Suspensión delantera', 'Frenos de disco', '21 velocidades', 'Neumáticos todo terreno'],
      'rental.vehicles.electricBike.features': ['Motor eléctrico', 'Batería de larga duración', 'Pantalla LCD', 'Cargador incluido'],
      'rental.vehicles.fatBike.features': ['Neumáticos anchos', 'Motor potente', 'Suspensión completa', 'Resistente al agua'],
      'rental.vehicles.toyotaAygo.features': ['Aire acondicionado', 'Dirección asistida', '5 puertas', 'Consumo eficiente']
    },
    en: {
      'rental.vehicles.cityBike.features': ['Front basket', 'LED lights', '7-speed gear', 'Comfortable seat'],
      'rental.vehicles.mountainBike.features': ['Front suspension', 'Disc brakes', '21 speeds', 'All-terrain tires'],
      'rental.vehicles.electricBike.features': ['Electric motor', 'Long-lasting battery', 'LCD display', 'Charger included'],
      'rental.vehicles.fatBike.features': ['Wide tires', 'Powerful motor', 'Full suspension', 'Water resistant'],
      'rental.vehicles.toyotaAygo.features': ['Air conditioning', 'Power steering', '5 doors', 'Efficient consumption']
    }
  }
  const currentTranslations = translations[language]
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("bicicletas")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{name: string, price?: string, duration?: string, id?: string}>({name: ""})
  const [selectedPrices, setSelectedPrices] = useState<{[key: string]: {duration: string, price: string}}>({})
  const [selectedModels, setSelectedModels] = useState<{[key: string]: string}>({})

  const handlePriceSelection = (itemName: string, duration: string, price: string) => {
    setSelectedPrices(prev => ({
      ...prev,
      [itemName]: { duration, price }
    }))
  }

  const handleModelSelection = (scooterName: string, modelId: string) => {
    setSelectedModels(prev => ({
      ...prev,
      [scooterName]: modelId
    }))
    // Reset price selection when model changes
    setSelectedPrices(prev => {
      const newPrices = { ...prev }
      delete newPrices[scooterName]
      return newPrices
    })
  }

  const handleReservation = (itemName: string, itemId: string) => {
    const selectedPrice = selectedPrices[itemName]
    
    setSelectedItem({
      name: itemName, 
      price: selectedPrice?.price,
      duration: selectedPrice?.duration,
      id: itemId
    })
    setIsModalOpen(true)
  }

  const getStockDisplay = (itemId: string) => {
    const availableStock = getAvailableStock(itemId)
    const totalStock = inventory.find(item => item.id === itemId)?.totalStock || 0
    const isLowStock = availableStock <= totalStock * 0.2 // 20% o menos
    const isOutOfStock = availableStock === 0
    
    return {
      text: `${availableStock}/${totalStock}`,
      color: isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
    }
  }

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["bicicletas", "coches", "motos", "quads", "scooters", "accesorios"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const bicycles = [
    {
      id: "city-bike",
      name: t('rental.vehicles.cityBike.name'),
      description: t('rental.vehicles.cityBike.description'),
      images: ["/urban-bicycle.png"],
      prices: [
        { duration: "1h", price: getPrice("city-bike-1h", "4,50€") },
        { duration: "2h", price: getPrice("city-bike-2h", "6€") },
        { duration: "3h", price: getPrice("city-bike-3h", "8€") },
        { duration: "4h", price: getPrice("city-bike-4h", "9€") },
        { duration: t('rental.vehicles.cityBike.allDay'), price: getPrice("city-bike-allday", "18€"), featured: true },
      ],
      features: currentTranslations['rental.vehicles.cityBike.features'] as string[],
    },
    {
      id: "mountain-bike",
      name: t('rental.vehicles.mountainBike.name'),
      description: t('rental.vehicles.mountainBike.description'),
      images: ["/mountain-bike-trail.png"],
      prices: [
        { duration: "1h", price: getPrice("mountain-bike-1h", "8€") },
        { duration: "2h", price: getPrice("mountain-bike-2h", "9€") },
        { duration: "3h", price: getPrice("mountain-bike-3h", "10€") },
        { duration: "4h", price: getPrice("mountain-bike-4h", "11€") },
        { duration: t('rental.vehicles.mountainBike.allDay'), price: getPrice("mountain-bike-allday", "21€"), featured: true },
      ],
      features: currentTranslations['rental.vehicles.mountainBike.features'] as string[],
    },
    {
      id: "electric-bike",
      name: t('rental.vehicles.electricBike.name'),
      description: t('rental.vehicles.electricBike.description'),
      images: ["/bicinuevas.jpeg", "/modern-electric-bike.png"],
      prices: [
        { duration: "1h", price: getPrice('electric-bike-1h', "10€") },
        { duration: "2h", price: getPrice('electric-bike-2h', "18€") },
        { duration: "3h", price: getPrice('electric-bike-3h', "25€") },
        { duration: "4h", price: getPrice('electric-bike-4h', "30€") },
        { duration: t('rental.vehicles.electricBike.allDay'), price: getPrice('electric-bike-allday', "35€"), featured: true },
      ],
      features: currentTranslations['rental.vehicles.electricBike.features'] as string[],
    },
    {
      id: "fat-bike",
      name: t('rental.vehicles.fatBike.name'),
      description: t('rental.vehicles.fatBike.description'),
      images: ["/fat-bike-electric-wide-tires.png"],
      prices: [
        { duration: "1h", price: getPrice('fat-bike-1h', "10€") },
        { duration: "2h", price: getPrice('fat-bike-2h', "18€") },
        { duration: "3h", price: getPrice('fat-bike-3h', "25€") },
        { duration: "4h", price: getPrice('fat-bike-4h', "30€") },
        { duration: t('rental.vehicles.fatBike.allDay'), price: getPrice('fat-bike-allday', "35€"), featured: true },
      ],
      features: currentTranslations['rental.vehicles.fatBike.features'] as string[],
    },
  ]

  const cars = [
    {
      id: "toyota-aygo",
      name: "TOYOTA AYGO",
      group: t('rental.vehicles.toyotaAygo.group'),
      description: t('rental.vehicles.toyotaAygo.description'),
      image: "/coches/toyotaaygo.png",

      prices: [
        { duration: t('rental.vehicles.toyotaAygo.duration1'), price: getPrice('toyota-aygo-1d', '54€') },
        { duration: "2D", price: "94€" },
        { duration: "3D", price: "118€" },
        { duration: "4D", price: "149€" },
        { duration: "5D", price: "172€" },
        { duration: "6D", price: "186€" },
        { duration: "7D", price: getPrice('toyota-aygo-7d', '196€'), featured: true },
      ],
      features: currentTranslations['rental.vehicles.toyotaAygo.features'] as string[],
    },
    {
      id: "citroen-c1",
      name: "CITROËN C-1",
      group: "GRUPO B",
      description: "Coche compacto ideal para la ciudad, económico y fácil de aparcar",
      image: "/coches/citroenc1.jpg",
      prices: [
        { duration: "1 Día", price: getPrice('citroen-c1-1d', '58€') },
        { duration: "2D", price: "109€" },
        { duration: "3D", price: "136€" },
        { duration: "4D", price: "156€" },
        { duration: "5D", price: "180€" },
        { duration: "6D", price: "195€" },
        { duration: "7D", price: getPrice('citroen-c1-7d', '224€'), featured: true },
      ],
      features: ["Aire acondicionado", "5 puertas", "Consumo eficiente", "Fácil aparcamiento"],
    },
    {
      id: "seat-ibiza",
      name: "SEAT IBIZA",
      group: "GRUPO C",
      description: "Vehículo versátil con más espacio y comodidad para viajes largos",
      image: "/coches/seatibiza.jpg",
      prices: [
        { duration: "1D", price: getPrice('seat-ibiza-1d', '65€') },
        { duration: "2D", price: "115€" },
        { duration: "3D", price: "145€" },
        { duration: "4D", price: "170€" },
        { duration: "5D", price: "189€" },
        { duration: "6D", price: "207€" },
        { duration: "7D", price: getPrice('seat-ibiza-7d', '238€'), featured: true },
      ],
      features: ["Mayor espacio", "Maletero amplio", "Tecnología avanzada", "Confort superior"],
    },
    {
      id: "seat-arona",
      name: "SEAT ARONA",
      group: "GRUPO F",
      description: "SUV compacto versátil con más espacio y comodidad para viajes largos",
      image: "/coches/seatarona.png",
      prices: [
        { duration: "1D", price: getPrice('seat-arona-1d', '80€') },
        { duration: "2D", price: "150€" },
        { duration: "3D", price: "185€" },
        { duration: "4D", price: "220€" },
        { duration: "5D", price: "260€" },
        { duration: "6D", price: "295€" },
        { duration: "7D", price: getPrice('seat-arona-7d', '329€'), featured: true },
      ],
      features: ["Mayor espacio", "Maletero amplio", "Tecnología avanzada", "Confort superior"],
    },
    {
      id: "seat-ateca",
      name: "SEAT ATECA",
      group: "GRUPO G",
      description: "SUV familiar versátil con más espacio y comodidad para viajes largos",
      image: "/coches/seatateca.png",
      prices: [
        { duration: "1D", price: getPrice('seat-ateca-1d', '99€') },
        { duration: "2D", price: "195€" },
        { duration: "3D", price: "250€" },
        { duration: "4D", price: "295€" },
        { duration: "5D", price: "320€" },
        { duration: "6D", price: "385€" },
        { duration: "7D", price: getPrice('seat-ateca-7d', '430€'), featured: true },
      ],
      features: ["Mayor espacio", "Maletero amplio", "Tecnología avanzada", "Confort superior"],
    },
    {
      id: "seat-leon",
      name: "SEAT LEÓN",
      group: "GRUPO D",
      description: "Vehículo deportivo versátil con más espacio y comodidad para viajes largos",
      image: "/coches/seatleon.png",
      prices: [
        { duration: "1D", price: getPrice('seat-leon-1d', '75€') },
        { duration: "2D", price: "136€" },
        { duration: "3D", price: "180€" },
        { duration: "4D", price: "215€" },
        { duration: "5D", price: "255€" },
        { duration: "6D", price: "290€" },
        { duration: "7D", price: getPrice('seat-leon-7d', '315€'), featured: true },
      ],
      features: ["Mayor espacio", "Maletero amplio", "Tecnología avanzada", "Confort superior"],
    },
    {
      id: "volkswagen-touran",
      name: "VOLKSWAGEN TOURAN",
      group: "GRUPO I",
      description: "Monovolumen familiar con capacidad para 7 personas y gran maletero",
      image: "/coches/volktouran.png",
      prices: [
        { duration: "1D", price: getPrice('volkswagen-touran-1d', '119€') },
        { duration: "2D", price: "230€" },
        { duration: "3D", price: "310€" },
        { duration: "4D", price: "410€" },
        { duration: "5D", price: "415€" },
        { duration: "6D", price: "459€" },
        { duration: "7D", price: getPrice('volkswagen-touran-7d', '495€'), featured: true },
      ],
      features: ["7 plazas", "Maletero XXL", "Puertas correderas", "Ideal familias"],
    },
    {
      id: "minibus-9-seat",
      name: "MINIBUS 9 SEAT",
      group: "GRUPO H",
      description: "Minibús para grupos grandes, perfecto para excursiones y eventos",
      image: "/coches/Boxer-9-seat.png",
      prices: [
        { duration: "1D", price: getPrice('minibus-9-1d', '145€') },
        { duration: "2D", price: "280€" },
        { duration: "3D", price: "390€" },
        { duration: "4D", price: "495€" },
        { duration: "5D", price: "555€" },
        { duration: "6D", price: "600€" },
        { duration: "7D", price: getPrice('minibus-9-7d', '675€'), featured: true },
      ],
      features: ["9 plazas", "Aire acondicionado", "Espacio equipaje", "Ideal grupos"],
    },
    {
      id: "renault-clio",
      name: "RENAULT CLIO AUTOMÁTICO",
      group: "GRUPO J",
      description: "Coche automático cómodo y fácil de conducir para cualquier ocasión",
      image: "/coches/renaultclio.jpeg",
      prices: [
        { duration: "1D", price: getPrice('renault-clio-1d', '65€') },
        { duration: "2D", price: "126€" },
        { duration: "3D", price: "155€" },
        { duration: "4D", price: "210€" },
        { duration: "5D", price: "239€" },
        { duration: "6D", price: "330€" },
        { duration: "7D", price: getPrice('renault-clio-7d', '357€'), featured: true },
      ],
      features: ["Transmisión automática", "Fácil conducción", "Confort urbano", "Tecnología moderna"],
    },
  ]

  const motorcycles = [
    {
      id: "motorbike",
      name: "MOTORBIKE MOTO ELÉCTRICA",
      description: "Moto eléctrica para recorridos más largos con comodidad y estilo",
      image: "/motos/motobike.jpeg",

      cc: "Eléctrica",
      prices: [
        { duration: "1h", price: "15€" },
        { duration: "2h", price: "25€", featured: true },
      ],
      features: ["Asiento cómodo", "Gran autonomía", "Velocidad 45km/h", "Baúl incluido"],
    },
    {
      id: "yamaha-neos-50cc",
      name: "YAMAHA NEO'S 50CC",
      description: "Scooter urbano de 50cc, perfecto para la ciudad. No requiere carnet A",
      image: "/motos/yamahaneos50cc.png",
      cc: "50cc",
      prices: [
        { duration: "1D", price: "40€" },
        { duration: "2D", price: "65€" },
        { duration: "3D", price: "85€" },
        { duration: "4D", price: "105€" },
        { duration: "5D", price: "125€" },
        { duration: "6D", price: "140€" },
        { duration: "7D", price: "155€", featured: true },
      ],
      features: ["Automático", "Bajo consumo", "Fácil manejo", "Ideal ciudad"],
    },
    {
      id: "piaggio-liberty-125cc",
      name: "PIAGGIO LIBERTY 125CC",
      description: "Scooter clásico de 125cc con estilo italiano y gran comodidad",
      image: "/motos/piaggoliberty125cc.png",
      cc: "125cc",
      prices: [
        { duration: "1D", price: getPrice('moto-electrica-1d', '45€') },
        { duration: "2D", price: "70€" },
        { duration: "3D", price: "90€" },
        { duration: "4D", price: "110€" },
        { duration: "5D", price: "130€" },
        { duration: "6D", price: "145€" },
        { duration: "7D", price: getPrice('moto-electrica-7d', '160€'), featured: true },
      ],
      features: ["Diseño italiano", "Cómodo", "Maletero bajo asiento", "Económico"],
    },
    {
      id: "yamaha-xenter-125cc",
      name: "YAMAHA XENTER 125CC",
      description: "Scooter deportivo de 125cc con tecnología avanzada y gran rendimiento",
      image: "/motos/yamahaxenter125cc.jpg",
      cc: "125cc",
      prices: [
        { duration: "1D", price: getPrice('yamaha-xenter-1d', '55€') },
        { duration: "2D", price: "95€" },
        { duration: "3D", price: "125€" },
        { duration: "4D", price: "155€" },
        { duration: "5D", price: "175€" },
        { duration: "6D", price: "195€" },
        { duration: "7D", price: getPrice('yamaha-xenter-7d', '220€'), featured: true },
      ],
      features: ["Deportivo", "Tecnología avanzada", "Alto rendimiento", "Estilo moderno"],
    },
    {
      id: "bmw-310r",
      name: "BMW 310R",
      description: "Moto naked de alta gama con motor de 313cc y tecnología BMW",
      image: "/motos/bmw310r.jpg",
      cc: "313cc",
      prices: [
        { duration: "1D", price: getPrice('bmw-310r-1d', '60€') },
        { duration: "2D", price: "110€" },
        { duration: "3D", price: "160€" },
        { duration: "4D", price: "200€" },
        { duration: "5D", price: "240€" },
        { duration: "6D", price: "275€" },
        { duration: "7D", price: getPrice('bmw-310r-7d', '310€'), featured: true },
      ],
      features: ["Calidad BMW", "Motor potente", "Diseño deportivo", "Tecnología premium"],
    },
    {
      id: "kymco-superdink-350",
      name: "KYMCO SUPERDINK 350",
      description: "Maxiscooter de 350cc ideal para viajes largos y carretera",
      image: "/motos/kymcosuperdink350cc.png",
      cc: "350cc",
      prices: [
        { duration: "1D", price: getPrice('kymco-superdink-1d', '60€') },
        { duration: "2D", price: "110€" },
        { duration: "3D", price: "160€" },
        { duration: "4D", price: "200€" },
        { duration: "5D", price: "240€" },
        { duration: "6D", price: "275€" },
        { duration: "7D", price: getPrice('kymco-superdink-7d', '310€'), featured: true },
      ],
      features: ["Maxiscooter", "Viajes largos", "Gran comodidad", "Maletero amplio"],
    },
    {
      id: "cfmoto-650mt",
      name: "CFMOTO 650 MT",
      description: "Moto trail de 650cc para aventuras on-road y off-road",
      image: "/motos/cfmoto650mt.png",
      cc: "650cc",
      prices: [
        { duration: "1D", price: getPrice('cfmoto-650mt-1d', '80€') },
        { duration: "2D", price: "150€" },
        { duration: "3D", price: "210€" },
        { duration: "4D", price: "260€" },
        { duration: "5D", price: "320€" },
        { duration: "6D", price: "350€" },
        { duration: "7D", price: getPrice('cfmoto-650mt-7d', '395€'), featured: true },
      ],
      features: ["Moto trail", "Todo terreno", "Motor potente", "Aventura total"],
    },
  ]

  const quads = [
    {
      id: "quad-rental",
      name: "NORMAL QUAD",
      description: "Quad potente para aventuras extremas y emociones fuertes",
      image: "/quad.jpeg",
      cc: "Quad",
      prices: [
        { duration: "1 hora", price: getPrice('quad-normal-1h', "30€"), featured: true },
        { duration: "2 horas", price: getPrice('quad-normal-2h', "50€"), featured: true },
      ],
      features: ["Alta potencia", "Aventuras extremas", "Emociones fuertes", "Deportivo"],
    },
    {
      id: "quad-premium",
      name: "QUAD DOBLE",
      description: "Quad doble con dos asientos, cómodo y seguro para dos personas",
      image: "/quad2.png",
      cc: "Quad Doble",
      prices: [
        { duration: "1 hora", price: getPrice('quad-doble-1h', "15€") },
        { duration: "2 horas", price: "25€" },
        { duration: "Todo el día", price: getPrice('quad-doble-allday', "60€"), featured: true },
      ],
      features: ["Dos asientos", "Para 2 personas", "Ideal familias", "Máxima seguridad"],
    },
  ]

  const scooters = [
    {
      id: "electric-scooter",
      name: "SCOOTER / PATINETE",
      description: "Scooter eléctrico para movilidad urbana sostenible y eficiente",
      image: "/patinelectrico.jpg",
      models: [
        {
          id: "basic",
          name: "Skateflash 3.0",
          autonomy: "25km",
          speed: "20 km/h",
          image: "/skateflash.jpg",
          prices: [
            { duration: "30 min", price: getPrice('scooter-premium-30m', "10€") },
            { duration: "1h", price: getPrice('scooter-premium-1h', "15€"), featured: true },
          ],
        },
        {
          id: "premium",
          name: "EcoXtrem",
          autonomy: "40km",
          speed: "25 km/h",
          image: "/ecoextrem.jpg",
          prices: [
            { duration: "30 min", price: getPrice('scooter-30m', "10€") },
            { duration: "1h", price: getPrice('scooter-1h', "15€"), featured: true },
          ],
        },
      ],
      features: ["Motor eléctrico", "Plegable", "App móvil", "Luces LED"],
    },
    {
      id: "electric-scooter-disabled",
      name: "ELECTRIC SCOOTER",
      description: "Scooter eléctrico especial para personas con movilidad reducida",
      image: "/Scooterelectrico.jpg",
      prices: [
        { duration: "1D", price: getPrice('scooter-disabled-1d', "25€") },
        { duration: "3D", price: getPrice('scooter-disabled-3d', "60€"), featured: true },
        { duration: "7D", price: getPrice('scooter-disabled-7d', "120€") },
      ],
      features: ["Adaptado minusválidos", "Asiento cómodo", "Fácil acceso", "Seguridad extra"],
    },
  ]

  const accessories = [
    {
      id: "sillon",
      name: "Sillón",
      price: getPrice('accesorio-sillon', '3€'),
      description: "Asiento adicional para niños, seguro y cómodo",
      image: "/Carrobici.png",
      features: ["Hasta 22kg", "Cinturón seguridad", "Respaldo alto", "Fácil instalación"],
    },
    {
      id: "carro",
      name: "Carro",
      price: getPrice('accesorio-carro', '6€'),
      description: "Remolque para transporte de equipaje o niños",
      image: "/Carrobici.jpg",
      features: ["Capacidad 40kg", "Ruedas grandes", "Lona impermeable", "Enganche universal"],
    },
    {
      id: "quad-ninos",
      name: "Quad para Niños",
      price: getPrice('accesorio-quad-ninos', '30€/30min'),
      description: "Quad eléctrico seguro para niños",
      image: "/quad.jpeg",
      features: ["Eléctrico", "Seguro para niños", "Fácil manejo", "Supervisión adulta"],
    },
  ]

  // ===== Localization helpers (runtime) =====
  const featureMap: Record<string, string> = {
    'Aire acondicionado': 'Air conditioning',
    '5 puertas': '5 doors',
    'Consumo eficiente': 'Fuel efficient',
    'Fácil aparcamiento': 'Easy parking',
    'Mayor espacio': 'More space',
    'Maletero amplio': 'Large trunk',
    'Tecnología avanzada': 'Advanced technology',
    'Confort superior': 'Superior comfort',
    '7 plazas': '7 seats',
    'Maletero XXL': 'XXL trunk',
    'Puertas correderas': 'Sliding doors',
    'Ideal familias': 'Ideal for families',
    'Transmisión automática': 'Automatic transmission',
    'Fácil conducción': 'Easy driving',
    'Confort urbano': 'Urban comfort',
    'Tecnología moderna': 'Modern technology',
    'Asiento cómodo': 'Comfortable seat',
    'Gran autonomía': 'Long range',
    'Eléctrico': 'Electric',
    'Seguro para niños': 'Safe for children',
    'Fácil manejo': 'Easy handling',
    'Supervisión adulta': 'Adult supervision',
    'Velocidad 45km/h': 'Speed 45 km/h',
    'Baúl incluido': 'Top case included',
    'Automático': 'Automatic',
    'Bajo consumo': 'Low consumption',
    'Ideal ciudad': 'Ideal for city',
    'Diseño italiano': 'Italian design',
    'Cómodo': 'Comfortable',
    'Maletero bajo asiento': 'Under-seat storage',
    'Económico': 'Economical',
    'Deportivo': 'Sporty',
    'Alto rendimiento': 'High performance',
    'Estilo moderno': 'Modern style',
    'Calidad BMW': 'BMW quality',
    'Motor potente': 'Powerful engine',
    'Tecnología premium': 'Premium technology',
    'Maxiscooter': 'Maxi scooter',
    'Viajes largos': 'Long trips',
    'Gran comodidad': 'Great comfort',
    'Moto trail': 'Trail bike',
    'Todo terreno': 'All terrain',
    'Aventura total': 'Total adventure',
    '1 persona': '1 person',
    'Diversión garantizada': 'Guaranteed fun',
    'Excursiones': 'Excursions',
    'Motor eléctrico': 'Electric motor',
    'Plegable': 'Foldable',
    'App móvil': 'Mobile app',
    'Luces LED': 'LED lights',
    'Adaptado minusválidos': 'Adapted for reduced mobility',
    'Fácil acceso': 'Easy access',
    'Seguridad extra': 'Extra safety',
    'Alta potencia': 'High power',
    'Aventuras extremas': 'Extreme adventures',
    'Emociones fuertes': 'Strong emotions',
    'Dos asientos': 'Two seats',
    'Para 2 personas': 'For 2 people',
    'Máxima seguridad': 'Maximum safety',
  }

  const descMap: Record<string, string> = {
    'Coche compacto ideal para la ciudad, económico y fácil de aparcar': 'Compact city car, economical and easy to park',
    'Vehículo versátil con más espacio y comodidad para viajes largos': 'Versatile vehicle with more space and comfort for long trips',
    'SUV compacto versátil con más espacio y comodidad para viajes largos': 'Compact SUV with more space and comfort for long trips',
    'SUV familiar versátil con más espacio y comodidad para viajes largos': 'Family SUV with more space and comfort for long trips',
    'Vehículo deportivo versátil con más espacio y comodidad para viajes largos': 'Sporty versatile vehicle with more space and comfort for long trips',
    'Monovolumen familiar con capacidad para 7 personas y gran maletero': 'Family minivan with capacity for 7 people and a large trunk',
    'Minibús para grupos grandes, perfecto para excursiones y eventos': 'Minibus for large groups, perfect for excursions and events',
    'Coche automático cómodo y fácil de conducir para cualquier ocasión': 'Automatic car, comfortable and easy to drive for any occasion',
    'Moto eléctrica para recorridos más largos con comodidad y estilo': 'Electric motorbike for longer rides with comfort and style',
    "Scooter urbano de 50cc, perfecto para la ciudad. No requiere carnet A": '50cc urban scooter, perfect for the city. No A license required',
    'Scooter clásico de 125cc con estilo italiano y gran comodidad': 'Classic 125cc scooter with Italian style and great comfort',
    'Scooter deportivo de 125cc con tecnología avanzada y gran rendimiento': 'Sporty 125cc scooter with advanced technology and great performance',
    'Moto naked de alta gama con motor de 313cc y tecnología BMW': 'High-end naked bike with 313cc engine and BMW technology',
    'Maxiscooter de 350cc ideal para viajes largos y carretera': '350cc maxi scooter ideal for long trips and highway',
    'Moto trail de 650cc para aventuras on-road y off-road': '650cc trail bike for on-road and off-road adventures',
    'Quad para una persona, perfecto para excursiones y diversión': 'Quad for one person, perfect for excursions and fun',
    'Quad potente para aventuras extremas y emociones fuertes': 'Powerful quad for extreme adventures and strong emotions',
    'Quad doble con dos asientos, cómodo y seguro para dos personas': 'Double quad with two seats, comfortable and safe for two people',
    'Scooter eléctrico para movilidad urbana sostenible y eficiente': 'Electric scooter for sustainable and efficient urban mobility',
    'Scooter eléctrico especial para personas con movilidad reducida': 'Electric scooter specially designed for people with reduced mobility',
    'Asiento adicional para niños, seguro y cómodo': 'Additional child seat, safe and comfortable',
    'Remolque para transporte de equipaje o niños': 'Trailer for carrying luggage or children',
    'Quad eléctrico seguro para niños': 'Safe electric quad for children',
  }

  const durationMap: Record<string, string> = {
    '1 Día': '1 Day',
    '1D': '1D', '2D': '2D', '3D': '3D', '4D': '4D', '5D': '5D', '6D': '6D', '7D': '7D',
    '1 hora': '1 hour', '2 horas': '2 hours', 'Todo el día': 'All day', '30 min': '30 min', '1h': '1h', '2h': '2h', '3h': '3h', '4h': '4h'
  }

  const groupTransform = (g?: string) => g?.startsWith('GRUPO ') ? g.replace('GRUPO ', 'GROUP ') : g
  const translateFeatures = (arr: string[] = []) => arr.map((f: string) => featureMap[f] || f)

  const translateCar = (c: any) => ({
    ...c,
    group: groupTransform(c.group),
    description: descMap[c.description] || c.description,
    features: translateFeatures(c.features),
    prices: Array.isArray(c.prices) ? c.prices.map((p: any) => ({ ...p, duration: durationMap[p.duration] || p.duration })) : c.prices,
  })

  const translateMoto = (m: any) => ({
    ...m,
    name: m.name === 'MOTORBIKE MOTO ELÉCTRICA' ? 'ELECTRIC MOTORBIKE' : m.name,
    cc: m.cc === 'Eléctrica' ? 'Electric' : m.cc,
    description: descMap[m.description] || m.description,
    features: translateFeatures(m.features),
    prices: Array.isArray(m.prices) ? m.prices.map((p: any) => ({ ...p, duration: durationMap[p.duration] || p.duration })) : m.prices,
  })

  const translateQuad = (q: any) => ({
    ...q,
    name: q.name === 'NORMAL QUAD' ? 'NORMAL QUAD' : q.name === 'QUAD DOBLE' ? 'DOUBLE QUAD' : q.name,
    cc: q.cc === 'Quad Doble' ? 'Double Quad' : q.cc,
    description: descMap[q.description] || q.description,
    features: translateFeatures(q.features),
    prices: Array.isArray(q.prices) ? q.prices.map((p: any) => ({ ...p, duration: durationMap[p.duration] || p.duration })) : q.prices,
  })

  const translateScooter = (s: any) => ({
    ...s,
    name: s.name === 'SCOOTER / PATINETE' ? 'SCOOTER / E-SCOOTER' : s.name,
    description: descMap[s.description] || s.description,
    features: translateFeatures(s.features),
    models: Array.isArray(s.models) ? s.models.map((m: any) => ({
      ...m,
      name: m.name === 'Skateflash 3.0' ? 'Skateflash 3.0' : m.name === 'EcoXtrem' ? 'EcoXtrem' : m.name,
      prices: Array.isArray(m.prices) ? m.prices.map((p: any) => ({ ...p, duration: durationMap[p.duration] || p.duration })) : m.prices,
    })) : s.models,
    prices: Array.isArray(s.prices) ? s.prices.map((p: any) => ({
      ...p,
      duration: p.duration === 'Consultar' ? 'Consult' : (durationMap[p.duration] || p.duration),
      price: p.price === 'Precio a consultar' ? 'Price on request' : p.price,
    })) : s.prices,
  })

  const translateAccessory = (a: any) => ({
    ...a,
    name: a.name === 'Sillón' ? 'Child seat' : a.name === 'Carro' ? 'Trailer' : a.name === 'Quad para Niños' ? 'Kids Quad' : a.name,
    description: descMap[a.description] || a.description,
    features: translateFeatures(a.features),
  })

  const carsLocalized = language === 'en' ? cars.map(translateCar) : cars
  const motorcyclesLocalized = language === 'en' ? motorcycles.map(translateMoto) : motorcycles
  const quadsLocalized = language === 'en' ? quads.map(translateQuad) : quads
  const scootersLocalized = language === 'en' ? scooters.map(translateScooter) : scooters
  const accessoriesLocalized = language === 'en' ? accessories.map(translateAccessory) : accessories

  const heroText = language === 'en'
    ? {
        badge: 'Rental in Torremolinos',
        ctaPrimary: 'See the fleet',
        statVehicles: '24 vehicles',
        statVehiclesLabel: 'bikes, cars, motorbikes and quads',
        statPrice: 'From 3 €',
        statPriceLabel: 'lowest rental price',
        statHours: '9:00 – 22:00',
        statHoursLabel: 'every day',
        statPickup: 'La Colina',
        statPickupLabel: 'Torremolinos · pickup point',
      }
    : {
        badge: 'Alquiler en Torremolinos',
        ctaPrimary: 'Ver la flota',
        statVehicles: '24 vehículos',
        statVehiclesLabel: 'bicis, coches, motos y quads',
        statPrice: 'Desde 3 €',
        statPriceLabel: 'precio más bajo',
        statHours: '9:00 – 22:00',
        statHoursLabel: 'todos los días',
        statPickup: 'La Colina',
        statPickupLabel: 'Torremolinos · punto de recogida',
      }

  const fleetTabs = [
    { value: 'bicicletas', icon: '🚴', label: t('rental.bicycles'), hot: false },
    { value: 'scooters', icon: '🛴', label: t('rental.scooters'), hot: true },
    { value: 'coches', icon: '🚗', label: t('rental.cars'), hot: false },
    { value: 'motos', icon: '🏍️', label: t('rental.motorcycles'), hot: false },
    { value: 'quads', icon: '🏎️', label: t('rental.quads'), hot: false },
    { value: 'accesorios', icon: '🛍️', label: t('rental.accessories'), hot: false },
  ]

  const tabTriggerClass =
    'inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-100 data-[state=active]:bg-blue-900 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 dark:text-slate-300 dark:hover:bg-white/10 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950'

  const tabTriggerClassMobile =
    'relative inline-flex min-h-[52px] items-center justify-center gap-1.5 rounded-full px-2 text-xs font-bold leading-tight text-slate-600 transition-all duration-200 hover:bg-slate-100 data-[state=active]:bg-blue-900 data-[state=active]:text-white data-[state=active]:shadow-lg dark:text-slate-300 dark:hover:bg-white/10 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950'

  const cardClass =
    'group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70'

  const mediaClass =
    'relative aspect-video overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800'

  const overlayClass = 'absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent'

  const chipClass =
    'rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200'

  const smallHeadingClass = 'text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'

  const scrollToFleet = () => {
    document.getElementById('flota')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const renderPriceOptions = (
    itemName: string,
    prices: { duration: string; price: string; featured?: boolean }[]
  ) =>
    prices.map((price, index) => {
      const isSelected = selectedPrices[itemName]?.duration === price.duration
      return (
        <button
          key={index}
          onClick={() => handlePriceSelection(itemName, price.duration, price.price)}
          className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3 transition-all duration-200 ${
            isSelected
              ? 'border-blue-900 bg-blue-900 text-white shadow-lg shadow-blue-900/20 dark:border-yellow-400 dark:bg-yellow-400 dark:text-blue-950'
              : 'border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:border-yellow-300/40'
          }`}
        >
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide opacity-80">
            <Clock className="h-3.5 w-3.5" />
            {price.duration}
          </span>
          <span
            className={`text-xl font-black leading-none ${
              !isSelected && price.featured ? 'text-yellow-600 dark:text-yellow-300' : ''
            }`}
          >
            {price.price}
          </span>
        </button>
      )
    })

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f6f8] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
             {/* Back Arrow */}
              <Link href="/">
                <Button variant="ghost" size="lg" className="text-blue-900 hover:text-blue-700 navbar-back-button p-4">
                  <ArrowLeft className="h-12 w-12" />
                </Button>
              </Link>

            {/* Logo */}
            <Link href="/" className="flex items-center justify-center sm:justify-start leading-3 font-mono italic tracking-tighter space-x-4 sm:space-x-12 hover:opacity-80 transition-opacity cursor-pointer">
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={64} height={64} className="rounded" />
              <div className="hidden md:block text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-black text-blue-900 navbar-title birthstone-regular leading-tight">Free Air Street</h1>
                <p className="hidden sm:block text-2xl text-blue-800 navbar-subtitle birthstone-regular -mt-3">Rent & Tours</p>
              </div>
            </Link>

             {/* Desktop Navigation - Centered */}
             <nav className="hidden md:flex space-x-4 lg:space-x-8 flex-1 justify-center">
               <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
                 {t('header.rental')}
               </Link>
               <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 {t('header.tours')}
               </Link>
               <Link href="/rutas" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 {t('header.routes')}
               </Link>
               <Link href="/tienda" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 {t('header.shop')}
               </Link>
               <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 {t('header.contact')}
               </Link>
             </nav>

             {/* Page Title for Mobile - Centered */}
             <div className="md:hidden flex-1 text-center">
               <h1 className="text-lg font-bold text-blue-900 navbar-title">{t('header.rental')}</h1>
             </div>

            {/* QR Code, Language Toggle and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div 
                className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => setIsQrModalOpen(true)}
              >
                <QrCode className="h-5 w-5 text-blue-900" />
                <span className="text-sm text-blue-900 font-medium">{t('header.scanPrices')}</span>
              </div>

              {/* Language Toggle and Theme Toggle */}
              <div className="flex items-center space-x-2">
                <LanguageToggle />
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
              </div>

             {/* Mobile Menu Button */}
             <button className="md:hidden text-blue-900 navbar-mobile-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               {isMenuOpen ? <X className="h-6 w-6 navbar-mobile-icon" /> : <Menu className="h-6 w-6 navbar-mobile-icon" />}
             </button>
           </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-yellow-600 animate-slideDown">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/alquiler" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium border-l-4 border-blue-900 pl-2 animate-fadeInUp"
                  style={{ animationDelay: '0.1s' }}
                >
                  <span className="animate-typewriter">{t('header.rental')}</span>
                </Link>
                <Link 
                  href="/tours" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.2s' }}>{t('header.tours')}</span>
                </Link>
                <Link 
                  href="/rutas" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.3s' }}>{t('header.routes')}</span>
                </Link>
                <Link 
                  href="/tienda" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>{t('header.shop')}</span>
                </Link>
                <Link 
                  href="/contacto" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.5s' }}>{t('header.contact')}</span>
                </Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-yellow-600 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <PageHero
        badge={
          <>
            <Sparkles className="h-4 w-4" />
            {heroText.badge}
          </>
        }
        title={t('rental.title')}
        subtitle={t('rental.subtitle')}
        image="/hero.png"
        imageAlt="Free Air Street · alquiler de vehículos en Torremolinos"
        stats={[
          { value: heroText.statVehicles, label: heroText.statVehiclesLabel, icon: <Bike className="h-5 w-5" /> },
          { value: heroText.statPrice, label: heroText.statPriceLabel, icon: <Tag className="h-5 w-5" /> },
          { value: heroText.statHours, label: heroText.statHoursLabel, icon: <Clock className="h-5 w-5" /> },
          { value: heroText.statPickup, label: heroText.statPickupLabel, icon: <MapPin className="h-5 w-5" /> },
        ]}
        actions={
          <>
            <Button
              onClick={scrollToFleet}
              className="h-14 rounded-full bg-yellow-400 px-8 text-base font-bold text-blue-950 shadow-xl shadow-yellow-400/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              <Car className="mr-2 h-5 w-5" />
              {heroText.ctaPrimary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a
              href="https://wa.me/34655707412"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </>
        }
      />

      {/* Fleet */}
      <section id="flota" className="scroll-mt-24">
        <div className="container mx-auto px-4 pb-16 pt-14 md:pb-20 md:pt-20">
          <SectionHeading
            eyebrow="Torremolinos · La Colina"
            title={`${t('rental.bicycles')}, ${t('rental.cars')}, ${t('rental.motorcycles')} & ${t('rental.quads')}`}
          />

          <div className="mt-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="rounded-full border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                {/* Desktop: Una sola fila con 6 elementos */}
                <TabsList className="hidden h-auto w-full grid-cols-6 gap-1 bg-transparent p-0 sm:grid">
                  {fleetTabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className={`relative ${tabTriggerClass}`}>
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                      {tab.hot ? (
                        <span className="absolute -right-1 -top-1 rounded-full border-2 border-yellow-500 bg-yellow-400 px-2 py-0.5 text-[10px] font-bold leading-none text-red-600 shadow-lg transform rotate-12">
                          HOT!
                        </span>
                      ) : null}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Mobile: Dos filas separadas */}
                <div className="space-y-2 sm:hidden">
                  <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-0">
                    {fleetTabs.slice(0, 3).map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClassMobile}>
                        <span className="text-base">{tab.icon}</span>
                        <span>{tab.label}</span>
                        {tab.hot ? (
                          <span className="absolute -right-1 -top-1 rounded-full border-2 border-yellow-500 bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold leading-none text-red-600 shadow-lg transform rotate-12">
                            HOT!
                          </span>
                        ) : null}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-0">
                    {fleetTabs.slice(3).map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClassMobile}>
                        <span className="text-base">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              {/* Tours/Visitas Button */}
              <div className="mt-4 sm:mt-6">
                <Link href="/tours" className="block">
                  <Button className="h-14 w-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-base font-bold text-blue-900 shadow-sm transition hover:from-yellow-300 hover:to-yellow-400 hover:shadow-lg">
                    <span className="mr-2 text-xl">🏛️</span>
                    Tours / Visitas
                    <span className="ml-2 text-xl">✨</span>
                  </Button>
                </Link>
              </div>

          {/* Bicicletas Tab */}
          <TabsContent value="bicicletas" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {bicycles.map((bike) => (
                <article key={bike.id} className={cardClass}>
                  <div className={mediaClass}>
                    <VehicleImageCarousel images={bike.images} alt={bike.name as string} />
                    <div className={overlayClass} />

                    <div className="absolute right-4 top-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg ${getStockDisplay(bike.id).color}`}>
                        {getStockDisplay(bike.id).text}
                      </span>
                    </div>

                    <div className="absolute inset-x-4 bottom-4">
                      <h3 className="text-2xl font-black leading-tight text-white">{bike.name as string}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{bike.description as string}</p>

                    {/* Features */}
                    <div className="mt-5">
                      <h4 className={smallHeadingClass}>{t('rental.features')}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {bike.features.map((feature, index) => (
                          <span key={index} className={chipClass}>
                            {feature as string}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="mt-5">
                      <h4 className={smallHeadingClass}>{t('rental.prices')}</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {renderPriceOptions(
                          bike.name as string,
                          bike.prices as { duration: string; price: string; featured?: boolean }[],
                        )}
                      </div>
                    </div>

                    <Button
                      className={`mt-5 h-12 w-full rounded-full font-bold text-white ${
                        getAvailableStock(bike.id) === 0
                          ? 'cursor-not-allowed bg-slate-400'
                          : 'bg-blue-900 hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300'
                      }`}
                      onClick={() => handleReservation(bike.name as string, bike.id)}
                      disabled={!selectedPrices[bike.name as string]}
                    >
                      {selectedPrices[bike.name as string]
                        ? `${t('rental.reserve')} ${selectedPrices[bike.name as string].duration} ${t('rental.for')} ${selectedPrices[bike.name as string].price}`
                        : t('rental.selectPrice')
                      }
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          {/* Coches Tab */}
          <TabsContent value="coches" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {carsLocalized.map((car) => (
                <article key={car.id} className={cardClass}>
                  <div className={mediaClass}>
                    <Image src={car.image || "/placeholder.svg"} alt={car.name as string} fill className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className={overlayClass} />

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-blue-950 shadow-lg">
                        {car.group}
                      </span>
                    </div>

                    <div className="absolute inset-x-4 bottom-4">
                      <h3 className="text-2xl font-black leading-tight text-white">{car.name as string}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{car.description as string}</p>

                    {/* Features */}
                    <div className="mt-5">
                      <h4 className={smallHeadingClass}>{t('rental.features')}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {car.features.map((feature: string, index: number) => (
                          <span key={index} className={chipClass}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="mt-5">
                      <h4 className={smallHeadingClass}>{t('rental.prices')}</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {renderPriceOptions(car.name as string, car.prices)}
                      </div>
                    </div>

                    <Button
                      className="mt-5 h-12 w-full rounded-full bg-blue-900 font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                      onClick={() => handleReservation(car.name as string, car.id)}
                      disabled={!selectedPrices[car.name as string]}
                    >
                      {selectedPrices[car.name as string] ? `${t('rental.reserve')} ${selectedPrices[car.name as string].duration} ${t('rental.for')} ${selectedPrices[car.name as string].price}` : t('rental.selectPrice')}
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {/* Car Requirements */}
            <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/10 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400/20 text-xl">🚗</span>
                <h3 className="text-xl font-black tracking-tight text-amber-900 dark:text-amber-100">
                  {t('rental.carRequirements.title')}
                </h3>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-2 text-sm font-medium text-amber-900 dark:text-amber-100/90 sm:grid-cols-2">
                {[
                  t('rental.carRequirements.license'),
                  t('rental.carRequirements.passport'),
                  t('rental.carRequirements.creditCard'),
                  t('rental.carRequirements.age'),
                  t('rental.carRequirements.models'),
                ].map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2 rounded-2xl bg-white/60 px-3 py-2 dark:bg-white/5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-yellow-300" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* Motos Tab */}
          <TabsContent value="motos" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {motorcyclesLocalized.map((moto) => (
                <article key={moto.id} className={cardClass}>
                  <div className={mediaClass}>
                    <Image src={moto.image || "/placeholder.svg"} alt={moto.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className={overlayClass} />

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-blue-950 shadow-lg">
                        {moto.cc}
                      </span>
                    </div>

                    <div className="absolute inset-x-4 bottom-4">
                      <h3 className="text-2xl font-black leading-tight text-white">{moto.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{moto.description}</p>

                    {/* Features */}
                    <div className="mt-5">
                      <h4 className={smallHeadingClass}>{t('rental.features')}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {moto.features.map((feature: string, index: number) => (
                          <span key={index} className={chipClass}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className={`mt-5 ${moto.id === 'motorbike' || moto.id === 'quad-rental' ? 'flex-grow' : ''}`}>
                      <h4 className={smallHeadingClass}>{t('rental.prices')}</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {renderPriceOptions(moto.name, moto.prices)}
                      </div>
                    </div>

                    <Button
                      className="mt-5 h-12 w-full rounded-full bg-blue-900 font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                      onClick={() => handleReservation(moto.name, moto.id)}
                      disabled={!selectedPrices[moto.name]}
                    >
                      {selectedPrices[moto.name] ? `${t('rental.reserve')} ${selectedPrices[moto.name].duration} ${t('rental.for')} ${selectedPrices[moto.name].price}` : t('rental.selectPrice')}
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {/* Motorcycle Requirements */}
            <div className="mt-8 rounded-[2rem] border border-rose-200 bg-rose-50 p-6 shadow-sm dark:border-rose-400/20 dark:bg-rose-400/10 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/15 text-xl">⚡</span>
                <h3 className="text-xl font-black tracking-tight text-rose-900 dark:text-rose-100">
                  {t('rental.motorcycleRequirements.title')}
                </h3>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-2 text-sm font-medium text-rose-900 dark:text-rose-100/90 sm:grid-cols-2">
                {[
                  t('rental.motorcycleRequirements.license'),
                  t('rental.motorcycleRequirements.reservation'),
                  t('rental.motorcycleRequirements.id'),
                  t('rental.motorcycleRequirements.minAge'),
                  t('rental.motorcycleRequirements.deposit'),
                  t('rental.motorcycleRequirements.helmet'),
                ].map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2 rounded-2xl bg-white/60 px-3 py-2 dark:bg-white/5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* Quads Tab */}
          <TabsContent value="quads" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {quadsLocalized.map((quad) => (
                <article key={quad.id} className={cardClass}>
                  <div className={mediaClass}>
                    <Image src={quad.image || "/placeholder.svg"} alt={quad.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className={overlayClass} />

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-blue-950 shadow-lg">
                        {quad.cc}
                      </span>
                    </div>

                    <div className="absolute inset-x-4 bottom-4">
                      <h3 className="text-2xl font-black leading-tight text-white">{quad.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{quad.description}</p>

                    {/* Features */}
                    <div className="mt-5">
                      <h4 className={smallHeadingClass}>{t('rental.features')}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {quad.features.map((feature: string, index: number) => (
                          <span key={index} className={chipClass}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="mt-5">
                      <h4 className={smallHeadingClass}>{t('rental.prices')}</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {renderPriceOptions(quad.name, quad.prices)}
                      </div>
                    </div>

                    <Button
                      className="mt-5 h-12 w-full rounded-full bg-blue-900 font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                      onClick={() => handleReservation(quad.name, quad.id)}
                      disabled={!selectedPrices[quad.name]}
                    >
                      {selectedPrices[quad.name] ? `${t('rental.reserve')} ${selectedPrices[quad.name].duration} ${t('rental.for')} ${selectedPrices[quad.name].price}` : t('rental.selectPrice')}
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {/* Quad Requirements */}
            <div className="mt-8 rounded-[2rem] border border-orange-200 bg-orange-50 p-6 shadow-sm dark:border-orange-400/20 dark:bg-orange-400/10 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/15 text-xl">🏎️</span>
                <h3 className="text-xl font-black tracking-tight text-orange-900 dark:text-orange-100">
                  {t('rental.quadRequirements.title')}
                </h3>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-2 text-sm font-medium text-orange-900 dark:text-orange-100/90 sm:grid-cols-2">
                {[
                  t('rental.quadRequirements.license'),
                  t('rental.quadRequirements.reservation'),
                  t('rental.quadRequirements.id'),
                  t('rental.quadRequirements.minAge'),
                  t('rental.quadRequirements.deposit'),
                  t('rental.quadRequirements.helmet'),
                  t('rental.quadRequirements.safetyBriefing'),
                ].map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2 rounded-2xl bg-white/60 px-3 py-2 dark:bg-white/5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600 dark:text-orange-300" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* Scooters Tab */}
          <TabsContent value="scooters" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {scootersLocalized.map((scooter) => {
                const selectedModel = selectedModels[scooter.name] || (scooter.models ? scooter.models[0].id : null)
                const currentModel = scooter.models ? scooter.models.find((m: any) => m.id === selectedModel) : null
                const displayPrices = currentModel ? currentModel.prices : scooter.prices || []
                const displayImage = currentModel?.image || scooter.image || "/placeholder.svg"

                return (
                  <article key={scooter.id} className={cardClass}>
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
                      <Image src={displayImage} alt={currentModel?.name || scooter.name} fill className="object-contain p-4 transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      <div className="absolute right-4 top-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg ${getStockDisplay(scooter.id).color}`}>
                          {getStockDisplay(scooter.id).text}
                        </span>
                      </div>

                      <div className="absolute inset-x-4 bottom-4">
                        <h3 className="text-2xl font-black leading-tight text-white">{scooter.name}</h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{scooter.description}</p>

                      {/* Model Selector */}
                      {scooter.models && (
                        <div className="mt-5">
                          <h4 className={smallHeadingClass}>{t('rental.model')}</h4>
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {scooter.models.map((model: any) => {
                              const isSelected = selectedModel === model.id
                              return (
                                <button
                                  key={model.id}
                                  onClick={() => handleModelSelection(scooter.name, model.id)}
                                  className={`rounded-2xl border px-2 py-3 transition-all duration-200 ${
                                    isSelected
                                      ? 'border-yellow-400 bg-yellow-400 text-blue-950 shadow-lg'
                                      : 'border-slate-200 bg-slate-50 text-slate-900 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100'
                                  }`}
                                >
                                  <div className="text-sm font-bold leading-tight">{model.name}</div>
                                  <div className="mt-1 text-xs font-semibold opacity-80">
                                    <div>{model.autonomy}</div>
                                    <div>{model.speed}</div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      <div className="mt-5">
                        <h4 className={smallHeadingClass}>{t('rental.features')}</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {scooter.features.map((feature: string, index: number) => (
                            <span key={index} className={chipClass}>
                              {feature}
                            </span>
                          ))}
                          {currentModel && (
                            <>
                              <span className={chipClass}>
                                {t('rental.autonomy')} {currentModel.autonomy}
                              </span>
                              <span className={chipClass}>
                                {t('rental.speed')} {currentModel.speed}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="mt-5">
                        <h4 className={smallHeadingClass}>{t('rental.prices')}</h4>
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {renderPriceOptions(scooter.name, displayPrices)}
                        </div>
                      </div>

                      <Button
                        className={`mt-5 h-12 w-full rounded-full font-bold text-white ${
                          getAvailableStock(scooter.id) === 0
                            ? 'cursor-not-allowed bg-slate-400'
                            : 'bg-blue-900 hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300'
                        }`}
                        onClick={() => handleReservation(scooter.name, scooter.id)}
                        disabled={!selectedPrices[scooter.name]}
                      >
                        {selectedPrices[scooter.name]
                          ? `${t('rental.reserve')} ${selectedPrices[scooter.name].duration} ${t('rental.for')} ${selectedPrices[scooter.name].price}`
                          : t('rental.selectPrice')
                        }
                        <ArrowUpRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          </TabsContent>

          {/* Accesorios Tab */}
          <TabsContent value="accesorios" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {accessoriesLocalized.map((accessory) => (
                <article key={accessory.id} className={`${cardClass} p-6 text-center`}>
                  {accessory.image ? (
                    <div className="relative mx-auto mb-5 h-48 w-48">
                      <Image
                        src={accessory.image}
                        alt={accessory.name}
                        fill
                        className="rounded-[1.5rem] object-contain transition duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/20">
                      <span className="text-2xl text-blue-900 dark:text-yellow-300">💰</span>
                    </div>
                  )}

                  <h3 className="text-xl font-black tracking-tight">{accessory.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{accessory.description}</p>

                  {/* Features */}
                  <div className="mt-5 text-left">
                    <h4 className={smallHeadingClass}>{t('tours.whatIncludes')}</h4>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {accessory.features.map((feature: string, index: number) => (
                        <span key={index} className={chipClass}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-5 flex justify-center">
                    <span className="rounded-full bg-yellow-400 px-5 py-2 text-3xl font-black leading-none text-blue-950 shadow-sm">
                      {accessory.price}
                    </span>
                  </div>

                  <Button
                    className="mt-5 h-12 w-full rounded-full bg-blue-900 font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                    onClick={() => handleReservation(accessory.name, accessory.id)}
                  >
                    {t('rental.reserve')}
                    <ArrowUpRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </article>
              ))}
            </div>
          </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="informacion" className="scroll-mt-24">
        <div className="container mx-auto px-4 pb-16 md:pb-20">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
            <SectionHeading
              align="left"
              title={
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-300">
                    <Info className="h-5 w-5" />
                  </span>
                  Información Importante
                </span>
              }
            />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Incluido en el alquiler:
                </h4>
                <ul className="mt-3 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {[
                    'Casco de seguridad homologado',
                    'Seguro básico de responsabilidad civil',
                    'Kit de reparación básico',
                    'Candado de seguridad',
                    'Mapa de rutas recomendadas',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Condiciones:
                </h4>
                <ul className="mt-3 space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {[
                    'Documento de identidad obligatorio',
                    'Depósito de seguridad requerido',
                    'Menores acompañados por adulto',
                    'Horario: 9:00 - 22:00 todos los días',
                    'Reserva anticipada recomendada',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="ayuda" className="scroll-mt-24">
        <div className="container mx-auto px-4 pb-16 md:pb-20">
          <div className="rounded-[2rem] bg-gradient-to-r from-yellow-400 to-yellow-500 p-7 text-center shadow-sm sm:p-10">
            <SectionHeading
              align="center"
              title="¿Necesitas ayuda para elegir?"
              subtitle="Nuestro equipo te ayudará a encontrar la opción perfecta para tu aventura"
              className="[&_h2]:text-blue-950 [&_p]:text-blue-900"
            />
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-full bg-blue-900 px-8 font-bold text-white shadow-lg hover:bg-blue-800"
                onClick={() => window.open('tel:655707412', '_self')}
              >
                Llamar Ahora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-blue-900/30 bg-white/70 px-8 font-bold text-blue-950 hover:bg-white"
                onClick={() => window.open('https://wa.me/34655707412', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="rental"
        itemName={selectedItem.name}
        itemPrice={selectedItem.price}
        itemDuration={selectedItem.duration}
        itemId={selectedItem.id}
      />

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white via-blue-50 to-yellow-50 rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Rent a Quad</h3>
              
              <div className="mb-6">
                <Image
                  src="/rentwuad.png"
                  alt="Rent Quad Logo"
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <Image
                  src="/rentqr.png"
                  alt="Rent a Quad QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
              
              <Button
                onClick={() => window.open('https://quadaventuracostadelsol.com/actividades-de-aventura', '_blank')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Acceder a Quad Aventura
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <SiteFooter
        tagline="Rent & Tours"
        rights="© 2025 Free Air Street. Todos los derechos reservados."
        contactLabel={t('header.contact')}
        backHomeLabel={language === 'en' ? 'Back to home' : 'Volver al inicio'}
      />
    </div>
  )
}
