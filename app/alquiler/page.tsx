"use client"
import { ArrowLeft, Clock, Info, Menu, X, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { LanguageToggle } from '../../components/LanguageToggle'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ReservationModal } from '../../components/ReservationModal'
import { useLanguage } from '../../contexts/LanguageContext'
import { useInventory } from '../../contexts/InventoryContext'

export default function AlquilerPage() {
  const { t, language } = useLanguage()
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
    const availableStock = getAvailableStock(itemId)
    
    if (availableStock <= 0) {
      alert('Lo siento, no hay stock disponible para este vehículo.')
      return
    }
    
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
      image: "/urban-bicycle.png",
      prices: [
        { duration: "1h", price: "3€" },
        { duration: "2h", price: "5€" },
        { duration: "3h", price: "6€" },
        { duration: "4h", price: "7€" },
        { duration: t('rental.vehicles.cityBike.allDay'), price: "13€", featured: true },
      ],
      features: currentTranslations['rental.vehicles.cityBike.features'] as string[],
    },
    {
      id: "mountain-bike",
      name: t('rental.vehicles.mountainBike.name'),
      description: t('rental.vehicles.mountainBike.description'),
      image: "/mountain-bike-trail.png",
      prices: [
        { duration: "1h", price: "6€" },
        { duration: "2h", price: "7€" },
        { duration: "3h", price: "8€" },
        { duration: "4h", price: "9€" },
        { duration: t('rental.vehicles.mountainBike.allDay'), price: "19€", featured: true },
      ],
      features: currentTranslations['rental.vehicles.mountainBike.features'] as string[],
    },
    {
      id: "electric-bike",
      name: t('rental.vehicles.electricBike.name'),
      description: t('rental.vehicles.electricBike.description'),
      image: "/modern-electric-bike.png",
      prices: [
        { duration: "1h", price: "10€" },
        { duration: "2h", price: "18€" },
        { duration: "3h", price: "25€" },
        { duration: "4h", price: "30€" },
        { duration: t('rental.vehicles.electricBike.allDay'), price: "35€", featured: true },
      ],
      features: currentTranslations['rental.vehicles.electricBike.features'] as string[],
    },
    {
      id: "fat-bike",
      name: t('rental.vehicles.fatBike.name'),
      description: t('rental.vehicles.fatBike.description'),
      image: "/fat-bike-electric-wide-tires.png",
      prices: [
        { duration: "1h", price: "10€" },
        { duration: "2h", price: "18€" },
        { duration: "3h", price: "25€" },
        { duration: "4h", price: "30€" },
        { duration: t('rental.vehicles.fatBike.allDay'), price: "35€", featured: true },
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
        { duration: t('rental.vehicles.toyotaAygo.duration1'), price: "54€" },
        { duration: "2D", price: "94€" },
        { duration: "3D", price: "118€" },
        { duration: "4D", price: "149€" },
        { duration: "5D", price: "172€" },
        { duration: "6D", price: "186€" },
        { duration: "7D", price: "196€", featured: true },
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
        { duration: "1 Día", price: "58€" },
        { duration: "2D", price: "109€" },
        { duration: "3D", price: "136€" },
        { duration: "4D", price: "156€" },
        { duration: "5D", price: "180€" },
        { duration: "6D", price: "195€" },
        { duration: "7D", price: "224€", featured: true },
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
        { duration: "1D", price: "65€" },
        { duration: "2D", price: "115€" },
        { duration: "3D", price: "145€" },
        { duration: "4D", price: "170€" },
        { duration: "5D", price: "189€" },
        { duration: "6D", price: "207€" },
        { duration: "7D", price: "238€", featured: true },
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
        { duration: "1D", price: "80€" },
        { duration: "2D", price: "150€" },
        { duration: "3D", price: "185€" },
        { duration: "4D", price: "220€" },
        { duration: "5D", price: "260€" },
        { duration: "6D", price: "295€" },
        { duration: "7D", price: "329€", featured: true },
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
        { duration: "1D", price: "99€" },
        { duration: "2D", price: "195€" },
        { duration: "3D", price: "250€" },
        { duration: "4D", price: "295€" },
        { duration: "5D", price: "320€" },
        { duration: "6D", price: "385€" },
        { duration: "7D", price: "430€", featured: true },
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
        { duration: "1D", price: "75€" },
        { duration: "2D", price: "136€" },
        { duration: "3D", price: "180€" },
        { duration: "4D", price: "215€" },
        { duration: "5D", price: "255€" },
        { duration: "6D", price: "290€" },
        { duration: "7D", price: "315€", featured: true },
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
        { duration: "1D", price: "119€" },
        { duration: "2D", price: "230€" },
        { duration: "3D", price: "310€" },
        { duration: "4D", price: "410€" },
        { duration: "5D", price: "415€" },
        { duration: "6D", price: "459€" },
        { duration: "7D", price: "495€", featured: true },
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
        { duration: "1D", price: "145€" },
        { duration: "2D", price: "280€" },
        { duration: "3D", price: "390€" },
        { duration: "4D", price: "495€" },
        { duration: "5D", price: "555€" },
        { duration: "6D", price: "600€" },
        { duration: "7D", price: "675€", featured: true },
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
        { duration: "1D", price: "65€" },
        { duration: "2D", price: "126€" },
        { duration: "3D", price: "155€" },
        { duration: "4D", price: "210€" },
        { duration: "5D", price: "239€" },
        { duration: "6D", price: "330€" },
        { duration: "7D", price: "376€", featured: true },
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
        { duration: "1D", price: "45€" },
        { duration: "2D", price: "70€" },
        { duration: "3D", price: "90€" },
        { duration: "4D", price: "110€" },
        { duration: "5D", price: "130€" },
        { duration: "6D", price: "145€" },
        { duration: "7D", price: "160€", featured: true },
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
        { duration: "1D", price: "55€" },
        { duration: "2D", price: "95€" },
        { duration: "3D", price: "125€" },
        { duration: "4D", price: "155€" },
        { duration: "5D", price: "175€" },
        { duration: "6D", price: "195€" },
        { duration: "7D", price: "220€", featured: true },
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
        { duration: "1D", price: "60€" },
        { duration: "2D", price: "110€" },
        { duration: "3D", price: "160€" },
        { duration: "4D", price: "200€" },
        { duration: "5D", price: "240€" },
        { duration: "6D", price: "275€" },
        { duration: "7D", price: "310€", featured: true },
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
        { duration: "1D", price: "60€" },
        { duration: "2D", price: "110€" },
        { duration: "3D", price: "160€" },
        { duration: "4D", price: "200€" },
        { duration: "5D", price: "240€" },
        { duration: "6D", price: "275€" },
        { duration: "7D", price: "310€", featured: true },
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
        { duration: "1D", price: "80€" },
        { duration: "2D", price: "150€" },
        { duration: "3D", price: "210€" },
        { duration: "4D", price: "260€" },
        { duration: "5D", price: "320€" },
        { duration: "6D", price: "350€" },
        { duration: "7D", price: "395€", featured: true },
      ],
      features: ["Moto trail", "Todo terreno", "Motor potente", "Aventura total"],
    },
  ]

  const quads = [
    {
      id: "quad-rental",
      name: "RENT A QUAD",
      description: "Quad para una persona, perfecto para excursiones y diversión",
      image: "/quad.jpeg",
      cc: "Quad",
      prices: [
        { duration: "1 hora", price: "30€", featured: true },
        { duration: "2 horas", price: "50€", featured: true },
      ],
      features: ["1 persona", "Fácil manejo", "Diversión garantizada", "Excursiones"],
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
            { duration: "30 min", price: "10€" },
            { duration: "1h", price: "15€", featured: true },
          ],
        },
        {
          id: "premium",
          name: "EcoXtrem",
          autonomy: "40km",
          speed: "25 km/h",
          image: "/ecoextrem.jpg",
          prices: [
            { duration: "30 min", price: "15€" },
            { duration: "1h", price: "22€", featured: true },
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
        { duration: "1D", price: "25€" },
        { duration: "3D", price: "60€", featured: true },
        { duration: "7D", price: "120€" },
      ],
      features: ["Adaptado minusválidos", "Asiento cómodo", "Fácil acceso", "Seguridad extra"],
    },
  ]

  const accessories = [
    {
      id: "sillon",
      name: "Sillón",
      price: "3€",
      description: "Asiento adicional para niños, seguro y cómodo",
      image: "/Carrobici.png",
      features: ["Hasta 22kg", "Cinturón seguridad", "Respaldo alto", "Fácil instalación"],
    },
    {
      id: "carro",
      name: "Carro",
      price: "6€",
      description: "Remolque para transporte de equipaje o niños",
      image: "/Carrobici.jpg",
      features: ["Capacidad 40kg", "Ruedas grandes", "Lona impermeable", "Enganche universal"],
    },
    {
      id: "quad-ninos",
      name: "Quad para Niños",
      price: "30€/30min",
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
    'Scooter eléctrico para movilidad urbana sostenible y eficiente': 'Electric scooter for sustainable and efficient urban mobility',
    'Scooter eléctrico especial para personas con movilidad reducida': 'Electric scooter specially designed for people with reduced mobility',
    'Asiento adicional para niños, seguro y cómodo': 'Additional child seat, safe and comfortable',
    'Remolque para transporte de equipaje o niños': 'Trailer for carrying luggage or children',
    'Quad eléctrico seguro para niños': 'Safe electric quad for children',
  }

  const durationMap: Record<string, string> = {
    '1 Día': '1 Day',
    '1D': '1D', '2D': '2D', '3D': '3D', '4D': '4D', '5D': '5D', '6D': '6D', '7D': '7D',
    '1 hora': '1 hour', '2 horas': '2 hours', '30 min': '30 min', '1h': '1h', '2h': '2h', '3h': '3h', '4h': '4h'
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

  return (
    <div className="min-h-screen bg-gray-50">
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
             <nav className="hidden md:flex space-x-8 flex-1 justify-center">
               <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
                 {t('header.rental')}
               </Link>
               <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 {t('header.tours')}
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
                  href="/tienda" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.3s' }}>{t('header.shop')}</span>
                </Link>
                <Link 
                  href="/contacto" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>{t('header.contact')}</span>
                </Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-yellow-600 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Título y Subtítulo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t('rental.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {t('rental.subtitle')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            {/* Desktop: Una sola fila con 6 elementos */}
            <TabsList className="hidden sm:grid w-full grid-cols-6 h-16">
              <TabsTrigger value="bicicletas" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🚴</span>
                <span>{t('rental.bicycles')}</span>
              </TabsTrigger>
              <TabsTrigger value="coches" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🚗</span>
                <span>{t('rental.cars')}</span>
              </TabsTrigger>
              <TabsTrigger value="motos" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🏍️</span>
                <span>{t('rental.motorcycles')}</span>
              </TabsTrigger>
              <TabsTrigger value="quads" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🏎️</span>
                <span>{t('rental.quads')}</span>
              </TabsTrigger>
              <TabsTrigger value="scooters" className="flex items-center space-x-2 py-4 px-6 text-lg relative">
                <span>🛴</span>
                <span>{t('rental.scooters')}</span>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 font-bold text-xs px-2 py-1 rounded-full border-2 border-yellow-500 shadow-lg transform rotate-12">
                  HOT!
                </div>
              </TabsTrigger>
              <TabsTrigger value="accesorios" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🛍️</span>
                <span>{t('rental.accessories')}</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Mobile: Dos filas separadas */}
             <div className="sm:hidden">
               <TabsList className="grid w-full grid-cols-3 mb-4 h-16">
                 <TabsTrigger value="bicicletas" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🚴</span>
                   <span>{t('rental.bicycles')}</span>
                 </TabsTrigger>
                 <TabsTrigger value="coches" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🚗</span>
                   <span>{t('rental.cars')}</span>
                 </TabsTrigger>
                 <TabsTrigger value="motos" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🏍️</span>
                   <span>{t('rental.motorcycles')}</span>
                 </TabsTrigger>
               </TabsList>
               <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-16">
                 <TabsTrigger value="quads" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🏎️</span>
                   <span>{t('rental.quads')}</span>
                 </TabsTrigger>
                 <TabsTrigger value="scooters" className="flex items-center justify-center space-x-2 h-full px-3 text-sm relative">
                   <span>🛴</span>
                   <span>{t('rental.scooters')}</span>
                   <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 font-bold text-xs px-1.5 py-0.5 rounded-full border-2 border-yellow-500 shadow-lg transform rotate-12">
                     HOT!
                   </div>
                 </TabsTrigger>
                 <TabsTrigger value="accesorios" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🛍️</span>
                   <span>{t('rental.accessories')}</span>
                 </TabsTrigger>
               </TabsList>
             </div>
          </div>

          {/* Tours/Visitas Button */}
          <div className="w-full mt-3 mb-3 sm:mt-6 sm:mb-8">
            <Link href="/tours">
              <Button className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold text-lg shadow-md hover:shadow-lg transition-all duration-200 rounded-lg border border-yellow-300 hover:border-yellow-400">
                <span className="mr-3 text-xl">🏛️</span>
                Tours / Visitas
                <span className="ml-3 text-xl">✨</span>
              </Button>
            </Link>
          </div>

          {/* Bicicletas Tab */}
          <TabsContent value="bicicletas" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bicycles.map((bike) => (
                <Card key={bike.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image src={bike.image || "/placeholder.svg"} alt={bike.name as string} fill className="object-cover" />

                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-gray-900">{bike.name as string}</CardTitle>
                      <Badge className={`${getStockDisplay(bike.id).color} text-white font-bold px-3 py-1`}>
                        {getStockDisplay(bike.id).text}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">{bike.description as string}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('rental.features')}:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {bike.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature as string}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-gray-900">{t('rental.prices')}:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {bike.prices.map((price, index) => {
                          const isSelected = selectedPrices[bike.name as string]?.duration === price.duration as string
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(bike.name as string, price.duration as string, price.price)}
                              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 border-2 ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 shadow-lg transform scale-105"
                                  : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-1 mb-2">
                                <Clock className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-500"}`} />
                                <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-700"}`}>{price.duration}</span>
                              </div>
                              <Badge
                                variant={price.featured ? "default" : "secondary"}
                                className={`text-lg font-bold px-3 py-1 pointer-events-none ${
                                  isSelected
                                    ? "bg-white text-blue-600"
                                    : price.featured
                                      ? "bg-yellow-500 text-blue-900 hover:bg-yellow-600"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {price.price}
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Button 
                      className={`w-full text-white ${
                        getAvailableStock(bike.id) === 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      onClick={() => handleReservation(bike.name as string, bike.id)}
                      disabled={!selectedPrices[bike.name as string] || getAvailableStock(bike.id) === 0}
                    >
                      {getAvailableStock(bike.id) === 0 
                        ? 'Sin Stock' 
                        : selectedPrices[bike.name as string] 
                          ? `${t('rental.reserve')} ${selectedPrices[bike.name as string].duration} ${t('rental.for')} ${selectedPrices[bike.name as string].price}` 
                          : t('rental.selectPrice')
                      }
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coches Tab */}
          <TabsContent value="coches" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {carsLocalized.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image src={car.image || "/placeholder.svg"} alt={car.name as string} fill className="object-cover" />

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-blue-900 font-bold">{car.group}</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{car.name as string}</CardTitle>
                    <CardDescription className="text-gray-600">{car.description as string}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('rental.features')}:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {car.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-gray-900">{t('rental.prices')}:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {car.prices.map((price: { duration: string; price: string; featured?: boolean }, index: number) => {
                          const isSelected = selectedPrices[car.name as string]?.duration === price.duration as string
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(car.name as string, price.duration as string, price.price)}
                              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 border-2 ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 shadow-lg transform scale-105"
                                  : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-1 mb-2">
                                <Clock className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-500"}`} />
                                <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-700"}`}>{price.duration}</span>
                              </div>
                              <Badge
                                variant={price.featured ? "default" : "secondary"}
                                className={`text-lg font-bold px-3 py-1 pointer-events-none ${
                                  isSelected
                                    ? "bg-white text-blue-600"
                                    : price.featured
                                      ? "bg-yellow-500 text-blue-900 hover:bg-yellow-600"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {price.price}
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleReservation(car.name as string, car.id)}
                      disabled={!selectedPrices[car.name as string]}
                    >
                      {selectedPrices[car.name as string] ? `${t('rental.reserve')} ${selectedPrices[car.name as string].duration} ${t('rental.for')} ${selectedPrices[car.name as string].price}` : t('rental.selectPrice')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Car Requirements */}
            <Card className="mt-8 bg-yellow-50 border-yellow-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">🚗</span>
                  <CardTitle className="text-yellow-900">{t('rental.carRequirements.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-yellow-800">
                  <li>• {t('rental.carRequirements.license')}</li>
                  <li>• {t('rental.carRequirements.passport')}</li>
                  <li>• {t('rental.carRequirements.creditCard')}</li>
                  <li>• {t('rental.carRequirements.age')}</li>
                  <li>• {t('rental.carRequirements.models')}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Motos Tab */}
          <TabsContent value="motos" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {motorcyclesLocalized.map((moto) => (
                <Card key={moto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image src={moto.image || "/placeholder.svg"} alt={moto.name} fill className="object-cover" />

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-blue-900 font-bold">{moto.cc}</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{moto.name}</CardTitle>
                    <CardDescription className="text-gray-600">{moto.description}</CardDescription>
                  </CardHeader>

                  <CardContent className={moto.id === 'motorbike' || moto.id === 'quad-rental' ? 'flex flex-col h-full' : ''}>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('rental.features')}</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {moto.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className={`space-y-3 mb-4 ${moto.id === 'motorbike' || moto.id === 'quad-rental' ? 'flex-grow' : ''}`}>
                      <h4 className="font-semibold text-gray-900">{t('rental.prices')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {moto.prices.map((price: { duration: string; price: string; featured?: boolean }, index: number) => {
                          const isSelected = selectedPrices[moto.name]?.duration === price.duration as string
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(moto.name, price.duration as string, price.price)}
                              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 border-2 ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 shadow-lg transform scale-105"
                                  : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-1 mb-2">
                                <Clock className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-500"}`} />
                                <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-700"}`}>{price.duration}</span>
                              </div>
                              <Badge
                                variant={price.featured ? "default" : "secondary"}
                                className={`text-lg font-bold px-3 py-1 pointer-events-none ${
                                  isSelected
                                    ? "bg-white text-blue-600"
                                    : price.featured
                                      ? "bg-yellow-500 text-blue-900 hover:bg-yellow-600"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {price.price}
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto"
                      onClick={() => handleReservation(moto.name, moto.id)}
                      disabled={!selectedPrices[moto.name]}
                    >
                      {selectedPrices[moto.name] ? `${t('rental.reserve')} ${selectedPrices[moto.name].duration} ${t('rental.for')} ${selectedPrices[moto.name].price}` : t('rental.selectPrice')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Motorcycle Requirements */}
            <Card className="mt-8 bg-red-50 border-red-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">⚡</span>
                  <CardTitle className="text-red-900">{t('rental.motorcycleRequirements.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-red-800">
                  <li>• {t('rental.motorcycleRequirements.license')}</li>
                  <li>• {t('rental.motorcycleRequirements.reservation')}</li>
                  <li>• {t('rental.motorcycleRequirements.id')}</li>
                  <li>• {t('rental.motorcycleRequirements.minAge')}</li>
                  <li>• {t('rental.motorcycleRequirements.deposit')}</li>
                  <li>• {t('rental.motorcycleRequirements.helmet')}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quads Tab */}
          <TabsContent value="quads" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quadsLocalized.map((quad) => (
                <Card key={quad.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image src={quad.image || "/placeholder.svg"} alt={quad.name} fill className="object-cover" />

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-blue-900 font-bold">{quad.cc}</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{quad.name}</CardTitle>
                    <CardDescription className="text-gray-600">{quad.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('rental.features')}</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {quad.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-gray-900">{t('rental.prices')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {quad.prices.map((price: { duration: string; price: string; featured?: boolean }, index: number) => {
                          const isSelected = selectedPrices[quad.name]?.duration === price.duration as string
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(quad.name, price.duration as string, price.price)}
                              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 border-2 ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 shadow-lg transform scale-105"
                                  : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-1 mb-2">
                                <Clock className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-500"}`} />
                                <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-700"}`}>{price.duration}</span>
                              </div>
                              <Badge
                                variant={price.featured ? "default" : "secondary"}
                                className={`text-lg font-bold px-3 py-1 pointer-events-none ${
                                  isSelected
                                    ? "bg-white text-blue-600"
                                    : price.featured
                                      ? "bg-yellow-500 text-blue-900 hover:bg-yellow-600"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {price.price}
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleReservation(quad.name, quad.id)}
                      disabled={!selectedPrices[quad.name]}
                    >
                      {selectedPrices[quad.name] ? `${t('rental.reserve')} ${selectedPrices[quad.name].duration} ${t('rental.for')} ${selectedPrices[quad.name].price}` : t('rental.selectPrice')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quad Requirements */}
            <Card className="mt-8 bg-orange-50 border-orange-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">🏎️</span>
                  <CardTitle className="text-orange-900">{t('rental.quadRequirements.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-orange-800">
                  <li>• {t('rental.quadRequirements.license')}</li>
                  <li>• {t('rental.quadRequirements.reservation')}</li>
                  <li>• {t('rental.quadRequirements.id')}</li>
                  <li>• {t('rental.quadRequirements.minAge')}</li>
                  <li>• {t('rental.quadRequirements.deposit')}</li>
                  <li>• {t('rental.quadRequirements.helmet')}</li>
                  <li>• {t('rental.quadRequirements.safetyBriefing')}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scooters Tab */}
          <TabsContent value="scooters" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scootersLocalized.map((scooter) => {
                const selectedModel = selectedModels[scooter.name] || (scooter.models ? scooter.models[0].id : null)
                const currentModel = scooter.models ? scooter.models.find((m: any) => m.id === selectedModel) : null
                const displayPrices = currentModel ? currentModel.prices : scooter.prices || []
                const displayImage = currentModel?.image || scooter.image || "/placeholder.svg"
                
                return (
                  <Card key={scooter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <Image src={displayImage} alt={currentModel?.name || scooter.name} fill className="object-contain" />
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl text-gray-900">{scooter.name}</CardTitle>
                        <Badge className={`${getStockDisplay(scooter.id).color} text-white font-bold px-3 py-1`}>
                          {getStockDisplay(scooter.id).text}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600">{scooter.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      {/* Model Selector */}
                      {scooter.models && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{t('rental.model')}</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {scooter.models.map((model: any) => {
                              const isSelected = selectedModel === model.id
                              return (
                                <button
                                  key={model.id}
                                  onClick={() => handleModelSelection(scooter.name, model.id)}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                    isSelected
                                      ? "bg-yellow-500 border-yellow-500 text-blue-900 shadow-lg"
                                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="text-sm font-semibold">{model.name}</div>
                                  <div className="text-xs mt-1">
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
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('rental.features')}</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {scooter.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                              {feature}
                            </div>
                          ))}
                          {currentModel && (
                            <>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                                {t('rental.autonomy')} {currentModel.autonomy}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                                {t('rental.speed')} {currentModel.speed}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-semibold text-gray-900">{t('rental.prices')}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {displayPrices.map((price: { duration: string; price: string; featured?: boolean }, index: number) => {
                            const isSelected = selectedPrices[scooter.name]?.duration === price.duration as string
                            return (
                              <button
                                key={index}
                                onClick={() => handlePriceSelection(scooter.name, price.duration as string, price.price)}
                                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 border-2 ${
                                  isSelected
                                    ? "bg-blue-600 border-blue-600 shadow-lg transform scale-105"
                                    : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200"
                                }`}
                              >
                                <div className="flex items-center space-x-1 mb-2">
                                  <Clock className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-500"}`} />
                                  <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-700"}`}>{price.duration}</span>
                                </div>
                                <Badge
                                  variant={price.featured ? "default" : "secondary"}
                                  className={`text-lg font-bold px-3 py-1 pointer-events-none ${
                                    isSelected
                                      ? "bg-white text-blue-600"
                                      : price.featured
                                        ? "bg-yellow-500 text-blue-900 hover:bg-yellow-600"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {price.price}
                                </Badge>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <Button 
                        className={`w-full text-white ${
                          getAvailableStock(scooter.id) === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={() => handleReservation(scooter.name, scooter.id)}
                        disabled={!selectedPrices[scooter.name] || getAvailableStock(scooter.id) === 0}
                      >
                        {getAvailableStock(scooter.id) === 0 
                          ? 'Sin Stock' 
                          : selectedPrices[scooter.name] 
                            ? `${t('rental.reserve')} ${selectedPrices[scooter.name].duration} ${t('rental.for')} ${selectedPrices[scooter.name].price}` 
                            : t('rental.selectPrice')
                        }
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Accesorios Tab */}
          <TabsContent value="accesorios" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessoriesLocalized.map((accessory) => (
                <Card key={accessory.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    {accessory.image ? (
                       <div className="mx-auto mb-4 w-48 h-48 relative">
                         <Image
                           src={accessory.image}
                           alt={accessory.name}
                           fill
                           className="object-contain rounded-lg"
                         />
                       </div>
                    ) : (
                      <div className="mx-auto mb-4 p-4 bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <span className="text-blue-600 text-2xl">💰</span>
                      </div>
                    )}
                    <CardTitle className="text-xl text-gray-900">{accessory.name}</CardTitle>
                    <CardDescription className="text-gray-600">{accessory.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('tours.whatIncludes')}</h4>
                      <div className="space-y-1">
                        {accessory.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-4">
                      <Badge className="bg-yellow-500 text-blue-900 text-xl font-bold px-6 py-3">
                        {accessory.price}
                      </Badge>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleReservation(accessory.name, accessory.id)}
                    >
                      {t('rental.reserve')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900">Información Importante</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Incluido en el alquiler:</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Casco de seguridad homologado</li>
                  <li>• Seguro básico de responsabilidad civil</li>
                  <li>• Kit de reparación básico</li>
                  <li>• Candado de seguridad</li>
                  <li>• Mapa de rutas recomendadas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Condiciones:</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Documento de identidad obligatorio</li>
                  <li>• Depósito de seguridad requerido</li>
                  <li>• Menores acompañados por adulto</li>
                  <li>• Horario: 9:00 - 22:00 todos los días</li>
                  <li>• Reserva anticipada recomendada</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-0">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">¿Necesitas ayuda para elegir?</h3>
              <p className="text-blue-800 mb-6">
                Nuestro equipo te ayudará a encontrar la opción perfecta para tu aventura
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('tel:655707412', '_self')}
                >
                  Llamar Ahora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                  onClick={() => window.open('https://wa.me/34655707412', '_blank')}
                >
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
      <footer className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
               <div className="flex items-center space-x-3">
                 <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={60} height={60} className="rounded" />
                 <div>
                   <h3 className="font-bold birthstone-regular">Free Air Street</h3>
                   <p className="text-sm text-gray-700">Rent & Tours</p>
                 </div>
               </div>
               
               {/* Instagram Link */}
               <a
                 href="https://www.instagram.com/freeairstreet?igsh=d25kaDRkM3QwNGJ6"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                 </svg>
                 <span className="font-semibold">freeairstreet</span>
               </a>
               
               {/* WhatsApp Link */}
               <a
                 href="https://wa.me/34655707412"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                 </svg>
               </a>
             </div>

            <div className="text-center md:text-right">
              <p className="text-gray-700">© 2025 Free Air Street. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
