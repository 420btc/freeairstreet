"use client"
import { ArrowLeft, Clock, Info, Menu, X } from "lucide-react"
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

export default function AlquilerPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("bicicletas")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{name: string, price?: string, duration?: string}>({name: ""})
  const [selectedPrices, setSelectedPrices] = useState<{[key: string]: {duration: string, price: string}}>({})

  const handlePriceSelection = (itemName: string, duration: string, price: string) => {
    setSelectedPrices(prev => ({
      ...prev,
      [itemName]: { duration, price }
    }))
  }

  const handleReservation = (itemName: string) => {
    const selectedPrice = selectedPrices[itemName]
    setSelectedItem({
      name: itemName, 
      price: selectedPrice?.price,
      duration: selectedPrice?.duration
    })
    setIsModalOpen(true)
  }

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["bicicletas", "coches", "motos", "scooters", "accesorios"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const bicycles = [
    {
      id: "city-bike",
      name: "BICI PASEO / CITY BIKE",
      description: "Perfecta para paseos urbanos y recorridos tranquilos por la ciudad",
      image: "/urban-bicycle.png",
      prices: [
        { duration: "1h", price: "3€" },
        { duration: "2h", price: "5€" },
        { duration: "3h", price: "6€" },
        { duration: "4h", price: "7€" },
        { duration: "Todo el día (11h)", price: "13€", featured: true },
      ],
      features: ["Cómoda y ligera", "Ideal para ciudad", "Cesta incluida", "Luces LED"],
    },
    {
      id: "mountain-bike",
      name: "MOUNTAIN BIKE / BICI CARRETERA",
      description: "Para aventuras en montaña y carretera, diseñada para terrenos exigentes",
      image: "/mountain-bike-trail.png",
      prices: [
        { duration: "1h", price: "6€" },
        { duration: "2h", price: "7€" },
        { duration: "3h", price: "8€" },
        { duration: "Todo el día (11h)", price: "19€", featured: true },
      ],
      features: ["Suspensión completa", "21 velocidades", "Frenos de disco", "Neumáticos todo terreno"],
    },
    {
      id: "electric-bike",
      name: "BIKE ELECT (Bicicleta eléctrica)",
      description: "Sin esfuerzo, máxima diversión y alcance. Perfecta para distancias largas",
      image: "/modern-electric-bike.png",
      prices: [
        { duration: "1h", price: "10€" },
        { duration: "2h", price: "18€" },
        { duration: "3h", price: "25€" },
        { duration: "4h", price: "30€" },
        { duration: "Todo el día (11h)", price: "35€", featured: true },
      ],
      features: ["Motor eléctrico", "Batería 50km", "Pantalla LCD", "Cargador incluido"],
    },
    {
      id: "fat-bike",
      name: "FAT BIKE ELECTRIC",
      description: "Bicicleta eléctrica con ruedas anchas para todo tipo de terreno",
      image: "/fat-bike-electric-wide-tires.png",
      prices: [
        { duration: "1h", price: "10€" },
        { duration: "2h", price: "18€" },
        { duration: "3h", price: "25€" },
        { duration: "4h", price: "30€" },
        { duration: "Todo el día (11h)", price: "35€", featured: true },
      ],
      features: ["Ruedas extra anchas", "Motor potente", "Todo terreno", "Estabilidad máxima"],
    },
  ]

  const cars = [
    {
      id: "toyota-aygo",
      name: "TOYOTA AYGO",
      group: "GRUPO A",
      description: "Coche compacto ideal para la ciudad, económico y fácil de aparcar",
      image: "/coches/toyotaaygo.png",

      prices: [
        { duration: "1 Día", price: "54€" },
        { duration: "2D", price: "94€" },
        { duration: "3D", price: "118€" },
        { duration: "4D", price: "149€" },
        { duration: "5D", price: "172€" },
        { duration: "6D", price: "186€" },
        { duration: "7D", price: "196€", featured: true },
      ],
      features: ["Aire acondicionado", "5 puertas", "Consumo eficiente", "Fácil aparcamiento"],
    },
    {
      id: "citroen-c1",
      name: "CITROËN C-1",
      group: "GRUPO A",
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
      group: "GRUPO B",
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
      group: "GRUPO B",
      description: "SUV compacto versátil con más espacio y comodidad para viajes largos",
      image: "/coches/seatarona.png",
      prices: [
        { duration: "1D", price: "75€" },
        { duration: "2D", price: "136€" },
        { duration: "3D", price: "180€" },
        { duration: "4D", price: "215€" },
        { duration: "5D", price: "255€" },
        { duration: "6D", price: "296€" },
        { duration: "7D", price: "320€", featured: true },
      ],
      features: ["Mayor espacio", "Maletero amplio", "Tecnología avanzada", "Confort superior"],
    },
    {
      id: "seat-ateca",
      name: "SEAT ATECA",
      group: "GRUPO B",
      description: "SUV familiar versátil con más espacio y comodidad para viajes largos",
      image: "/coches/seatateca.png",
      prices: [
        { duration: "1D", price: "80€" },
        { duration: "2D", price: "150€" },
        { duration: "3D", price: "185€" },
        { duration: "4D", price: "220€" },
        { duration: "5D", price: "265€" },
        { duration: "6D", price: "329€" },
        { duration: "7D", price: "315€", featured: true },
      ],
      features: ["Mayor espacio", "Maletero amplio", "Tecnología avanzada", "Confort superior"],
    },
    {
      id: "seat-leon",
      name: "SEAT LEÓN",
      group: "GRUPO B",
      description: "Vehículo deportivo versátil con más espacio y comodidad para viajes largos",
      image: "/coches/seatleon.png",
      prices: [
        { duration: "1D", price: "99€" },
        { duration: "2D", price: "195€" },
        { duration: "3D", price: "250€" },
        { duration: "4D", price: "295€" },
        { duration: "5D", price: "350€" },
        { duration: "6D", price: "385€" },
        { duration: "7D", price: "430€", featured: true },
      ],
      features: ["Mayor espacio", "Maletero amplio", "Tecnología avanzada", "Confort superior"],
    },
    {
      id: "volkswagen-touran",
      name: "VOLKSWAGEN TOURAN",
      group: "GRUPO C",
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
      group: "GRUPO D",
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
      group: "GRUPO E",
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
      prices: [
        { duration: "30 min", price: "10€" },
        { duration: "1h", price: "15€", featured: true },
      ],
      features: ["Motor eléctrico", "Autonomía 25km", "Plegable", "App móvil"],
    },
    {
      id: "electric-scooter-disabled",
      name: "ELECTRIC SCOOTER",
      description: "Scooter eléctrico especial para personas con movilidad reducida",
      image: "/Scooterelectrico.jpg",
      prices: [
        { duration: "Consultar", price: "Precio a consultar", featured: true },
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
  ]

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

             {/* Desktop Navigation - Centered */}
             <nav className="hidden md:flex space-x-8 flex-1 justify-center">
               <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
                 Alquiler
               </Link>
               <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 Visitas Guiadas
               </Link>
               <a href="/#tienda" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 Tienda
               </a>
               <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 Contacto
               </Link>
             </nav>

             {/* Page Title for Mobile - Centered */}
             <div className="md:hidden flex-1 text-center">
               <h1 className="text-lg font-bold text-blue-900 navbar-title">Alquiler</h1>
             </div>

             {/* Desktop Controls */}
             <div className="hidden md:flex items-center space-x-2">
               <LanguageToggle />
               <ThemeToggle />
             </div>

             {/* Mobile Menu Button */}
             <button className="md:hidden text-blue-900 navbar-mobile-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               {isMenuOpen ? <X className="h-6 w-6 navbar-mobile-icon" /> : <Menu className="h-6 w-6 navbar-mobile-icon" />}
             </button>
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
                  <span className="animate-typewriter">Alquiler</span>
                </Link>
                <Link 
                  href="/tours" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.2s' }}>Visitas Guiadas</span>
                </Link>
                <a 
                  href="/#tienda" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.3s' }}>Tienda</span>
                </a>
                <Link 
                  href="/contacto" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>Contacto</span>
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
            Alquiler de Vehículos
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Descubre la libertad de moverte por Torremolinos con nuestras bicicletas, coches, motos y scooters. 
            ¡Elige tu vehículo ideal y vive una experiencia única!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            {/* Desktop: Una sola fila con 5 elementos */}
            <TabsList className="hidden sm:grid w-full grid-cols-5 h-16">
              <TabsTrigger value="bicicletas" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🚴</span>
                <span>Bicicletas</span>
              </TabsTrigger>
              <TabsTrigger value="coches" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🚗</span>
                <span>Coches</span>
              </TabsTrigger>
              <TabsTrigger value="motos" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🏍️</span>
                <span>Motos</span>
              </TabsTrigger>
              <TabsTrigger value="scooters" className="flex items-center space-x-2 py-4 px-6 text-lg relative">
                <span>🛴</span>
                <span>Scooters</span>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 font-bold text-xs px-2 py-1 rounded-full border-2 border-yellow-500 shadow-lg transform rotate-12">
                  HOT!
                </div>
              </TabsTrigger>
              <TabsTrigger value="accesorios" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🛍️</span>
                <span>Accesorios</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Mobile: Dos filas separadas */}
             <div className="sm:hidden">
               <TabsList className="grid w-full grid-cols-3 mb-4 h-16">
                 <TabsTrigger value="bicicletas" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🚴</span>
                   <span>Bicicletas</span>
                 </TabsTrigger>
                 <TabsTrigger value="coches" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🚗</span>
                   <span>Coches</span>
                 </TabsTrigger>
                 <TabsTrigger value="motos" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🏍️</span>
                   <span>Motos</span>
                 </TabsTrigger>
               </TabsList>
               <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-16">
                 <TabsTrigger value="scooters" className="flex items-center justify-center space-x-2 h-full px-3 text-sm relative">
                   <span>🛴</span>
                   <span>Scooters</span>
                   <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 font-bold text-xs px-1.5 py-0.5 rounded-full border-2 border-yellow-500 shadow-lg transform rotate-12">
                     HOT!
                   </div>
                 </TabsTrigger>
                 <TabsTrigger value="accesorios" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                   <span>🛍️</span>
                   <span>Accesorios</span>
                 </TabsTrigger>
               </TabsList>
             </div>
          </div>

          {/* Bicicletas Tab */}
          <TabsContent value="bicicletas" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bicycles.map((bike) => (
                <Card key={bike.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image src={bike.image || "/placeholder.svg"} alt={bike.name} fill className="object-cover" />

                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{bike.name}</CardTitle>
                    <CardDescription className="text-gray-600">{bike.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Características:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {bike.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-gray-900">Precios:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {bike.prices.map((price, index) => {
                          const isSelected = selectedPrices[bike.name]?.duration === price.duration
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(bike.name, price.duration, price.price)}
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
                      onClick={() => handleReservation(bike.name)}
                      disabled={!selectedPrices[bike.name]}
                    >
                      {selectedPrices[bike.name] ? `Reservar ${selectedPrices[bike.name].duration} por ${selectedPrices[bike.name].price}` : "Selecciona un precio"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coches Tab */}
          <TabsContent value="coches" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cars.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image src={car.image || "/placeholder.svg"} alt={car.name} fill className="object-cover" />

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-blue-900 font-bold">{car.group}</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{car.name}</CardTitle>
                    <CardDescription className="text-gray-600">{car.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Características:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {car.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-gray-900">Precios:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {car.prices.map((price, index) => {
                          const isSelected = selectedPrices[car.name]?.duration === price.duration
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(car.name, price.duration, price.price)}
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
                      onClick={() => handleReservation(car.name)}
                      disabled={!selectedPrices[car.name]}
                    >
                      {selectedPrices[car.name] ? `Reservar ${selectedPrices[car.name].duration} por ${selectedPrices[car.name].price}` : "Selecciona un precio"}
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
                  <CardTitle className="text-yellow-900">Requisitos para Alquiler de Coches</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-yellow-800">
                  <li>
                    • <strong>Carnet de conducir</strong> válido y vigente
                  </li>
                  <li>
                    • <strong>Pasaporte</strong> o DNI en vigor
                  </li>
                  <li>
                    • <strong>Tarjeta de crédito</strong> para depósito de seguridad
                  </li>
                  <li>• Edad mínima: 21 años (25 años para grupos C y D)</li>
                  <li>• Los modelos de coches son orientativos y pueden variar según disponibilidad</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Motos Tab */}
          <TabsContent value="motos" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {motorcycles.map((moto) => (
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
                      <h4 className="font-semibold text-gray-900 mb-2">Características:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {moto.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className={`space-y-3 mb-4 ${moto.id === 'motorbike' || moto.id === 'quad-rental' ? 'flex-grow' : ''}`}>
                      <h4 className="font-semibold text-gray-900">Precios:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {moto.prices.map((price, index) => {
                          const isSelected = selectedPrices[moto.name]?.duration === price.duration
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(moto.name, price.duration, price.price)}
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
                      onClick={() => handleReservation(moto.name)}
                      disabled={!selectedPrices[moto.name]}
                    >
                      {selectedPrices[moto.name] ? `Reservar ${selectedPrices[moto.name].duration} por ${selectedPrices[moto.name].price}` : "Selecciona un precio"}
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
                  <CardTitle className="text-red-900">Requisitos para Alquiler de Motos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-red-800">
                  <li>
                    • <strong>Carnet de conducir</strong> válido y vigente (A1, A2 o A según cilindrada)
                  </li>
                  <li>
                    • <strong>Reserva obligatoria</strong> con antelación
                  </li>
                  <li>
                    • <strong>Documento de identidad</strong> (DNI o pasaporte)
                  </li>
                  <li>• Edad mínima: 16 años (50cc), 18 años (125cc), 20 años (+300cc)</li>
                  <li>• Depósito de seguridad requerido</li>
                  <li>• Casco homologado incluido</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scooters Tab */}
          <TabsContent value="scooters" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scooters.map((scooter) => (
                <Card key={scooter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image src={scooter.image || "/placeholder.svg"} alt={scooter.name} fill className="object-contain" />

                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{scooter.name}</CardTitle>
                    <CardDescription className="text-gray-600">{scooter.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Características:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {scooter.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-gray-900">Precios:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {scooter.prices.map((price, index) => {
                          const isSelected = selectedPrices[scooter.name]?.duration === price.duration
                          return (
                            <button
                              key={index}
                              onClick={() => handlePriceSelection(scooter.name, price.duration, price.price)}
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
                      onClick={() => handleReservation(scooter.name)}
                      disabled={!selectedPrices[scooter.name]}
                    >
                      {selectedPrices[scooter.name] ? `Reservar ${selectedPrices[scooter.name].duration} por ${selectedPrices[scooter.name].price}` : "Selecciona un precio"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Accesorios Tab */}
          <TabsContent value="accesorios" className="sm:data-[state=active]:animate-none data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessories.map((accessory) => (
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
                      <h4 className="font-semibold text-gray-900 mb-2">Incluye:</h4>
                      <div className="space-y-1">
                        {accessory.features.map((feature, index) => (
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
                      onClick={() => handleReservation(accessory.name)}
                    >
                      Añadir al Alquiler
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
                  <li>• Horario: 9:00 - 20:00 todos los días</li>
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
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Llamar Ahora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
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
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
               <div className="flex items-center space-x-3">
                 <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={40} height={40} className="rounded" />
                 <div>
                   <h3 className="font-bold birthstone-regular">Free Air Street</h3>
                   <p className="text-sm text-gray-400">Rent & Tours</p>
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
             </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2025 Free Air Street. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
