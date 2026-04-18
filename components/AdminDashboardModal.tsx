"use client"

import React, { useState, useEffect } from 'react'
import { X, Lock, Save, LogOut, CheckCircle, Search } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { usePricing } from '../contexts/PricingContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

// Datos predefinidos para editar
const pricingCategories = [
  { id: 'bicicletas', label: 'Bicicletas / Biciclette' },
  { id: 'coches', label: 'Coches / Auto' },
  { id: 'motos', label: 'Motos / Moto' },
  { id: 'quads', label: 'Quads' },
  { id: 'scooters', label: 'Patinetes / Monopattini' },
  { id: 'tours', label: 'Tours & Excursiones' }
]

const initialEditableItems = [
  // Bicicletas
  { id: 'city-bike-1h', category: 'bicicletas', name: 'Bicicleta de Paseo - 1h', defaultPrice: '4,50€' },
  { id: 'city-bike-2h', category: 'bicicletas', name: 'Bicicleta de Paseo - 2h', defaultPrice: '6€' },
  { id: 'city-bike-3h', category: 'bicicletas', name: 'Bicicleta de Paseo - 3h', defaultPrice: '8€' },
  { id: 'city-bike-4h', category: 'bicicletas', name: 'Bicicleta de Paseo - 4h', defaultPrice: '9€' },
  { id: 'city-bike-allday', category: 'bicicletas', name: 'Bicicleta de Paseo - Todo el día', defaultPrice: '18€' },
  
  { id: 'mountain-bike-1h', category: 'bicicletas', name: 'Bicicleta Montaña - 1h', defaultPrice: '8€' },
  { id: 'mountain-bike-2h', category: 'bicicletas', name: 'Bicicleta Montaña - 2h', defaultPrice: '9€' },
  { id: 'mountain-bike-3h', category: 'bicicletas', name: 'Bicicleta Montaña - 3h', defaultPrice: '10€' },
  { id: 'mountain-bike-4h', category: 'bicicletas', name: 'Bicicleta Montaña - 4h', defaultPrice: '11€' },
  { id: 'mountain-bike-allday', category: 'bicicletas', name: 'Bicicleta Montaña - Todo el día', defaultPrice: '21€' },
  
  { id: 'electric-bike-1h', category: 'bicicletas', name: 'Bicicleta Eléctrica - 1h', defaultPrice: '10€' },
  { id: 'electric-bike-2h', category: 'bicicletas', name: 'Bicicleta Eléctrica - 2h', defaultPrice: '18€' },
  { id: 'electric-bike-3h', category: 'bicicletas', name: 'Bicicleta Eléctrica - 3h', defaultPrice: '25€' },
  { id: 'electric-bike-4h', category: 'bicicletas', name: 'Bicicleta Eléctrica - 4h', defaultPrice: '30€' },
  { id: 'electric-bike-allday', category: 'bicicletas', name: 'Bicicleta Eléctrica - Todo el día', defaultPrice: '35€' },
  
  { id: 'fat-bike-1h', category: 'bicicletas', name: 'Fat Bike Eléctrica - 1h', defaultPrice: '10€' },
  { id: 'fat-bike-2h', category: 'bicicletas', name: 'Fat Bike Eléctrica - 2h', defaultPrice: '18€' },
  { id: 'fat-bike-3h', category: 'bicicletas', name: 'Fat Bike Eléctrica - 3h', defaultPrice: '25€' },
  { id: 'fat-bike-4h', category: 'bicicletas', name: 'Fat Bike Eléctrica - 4h', defaultPrice: '30€' },
  { id: 'fat-bike-allday', category: 'bicicletas', name: 'Fat Bike Eléctrica - Todo el día', defaultPrice: '35€' },

  // Coches
  { id: 'toyota-aygo-1d', category: 'coches', name: 'Toyota Aygo - 1 Día', defaultPrice: '54€' },
  { id: 'toyota-aygo-7d', category: 'coches', name: 'Toyota Aygo - 7 Días', defaultPrice: '196€' },
  { id: 'citroen-c1-1d', category: 'coches', name: 'Citroën C-1 - 1 Día', defaultPrice: '58€' },
  { id: 'citroen-c1-7d', category: 'coches', name: 'Citroën C-1 - 7 Días', defaultPrice: '224€' },
  { id: 'seat-ibiza-1d', category: 'coches', name: 'Seat Ibiza - 1 Día', defaultPrice: '65€' },
  { id: 'seat-ibiza-7d', category: 'coches', name: 'Seat Ibiza - 7 Días', defaultPrice: '238€' },
  { id: 'seat-leon-1d', category: 'coches', name: 'Seat León - 1 Día', defaultPrice: '75€' },
  { id: 'seat-leon-7d', category: 'coches', name: 'Seat León - 7 Días', defaultPrice: '315€' },
  { id: 'seat-arona-1d', category: 'coches', name: 'Seat Arona - 1 Día', defaultPrice: '80€' },
  { id: 'seat-arona-7d', category: 'coches', name: 'Seat Arona - 7 Días', defaultPrice: '329€' },
  { id: 'seat-ateca-1d', category: 'coches', name: 'Seat Ateca - 1 Día', defaultPrice: '99€' },
  { id: 'seat-ateca-7d', category: 'coches', name: 'Seat Ateca - 7 Días', defaultPrice: '430€' },
  { id: 'minibus-9-1d', category: 'coches', name: 'Minibus 9 Plazas - 1 Día', defaultPrice: '145€' },
  { id: 'minibus-9-7d', category: 'coches', name: 'Minibus 9 Plazas - 7 Días', defaultPrice: '675€' },
  { id: 'renault-clio-1d', category: 'coches', name: 'Renault Clio Auto - 1 Día', defaultPrice: '65€' },
  { id: 'renault-clio-7d', category: 'coches', name: 'Renault Clio Auto - 7 Días', defaultPrice: '357€' },
  { id: 'volkswagen-touran-1d', category: 'coches', name: 'Volkswagen Touran - 1 Día', defaultPrice: '119€' },
  { id: 'volkswagen-touran-7d', category: 'coches', name: 'Volkswagen Touran - 7 Días', defaultPrice: '495€' },

  // Motos
  { id: 'moto-electrica-1d', category: 'motos', name: 'Moto Eléctrica - 1 Día', defaultPrice: '45€' },
  { id: 'moto-electrica-7d', category: 'motos', name: 'Moto Eléctrica - 7 Días', defaultPrice: '160€' },
  { id: 'yamaha-xenter-1d', category: 'motos', name: 'Yamaha Xenter 125cc - 1 Día', defaultPrice: '55€' },
  { id: 'yamaha-xenter-7d', category: 'motos', name: 'Yamaha Xenter 125cc - 7 Días', defaultPrice: '220€' },
  { id: 'bmw-310r-1d', category: 'motos', name: 'BMW 310R - 1 Día', defaultPrice: '60€' },
  { id: 'bmw-310r-7d', category: 'motos', name: 'BMW 310R - 7 Días', defaultPrice: '310€' },
  { id: 'kymco-superdink-1d', category: 'motos', name: 'Kymco Superdink 350 - 1 Día', defaultPrice: '60€' },
  { id: 'kymco-superdink-7d', category: 'motos', name: 'Kymco Superdink 350 - 7 Días', defaultPrice: '310€' },
  { id: 'cfmoto-650mt-1d', category: 'motos', name: 'CFMoto 650 MT - 1 Día', defaultPrice: '80€' },
  { id: 'cfmoto-650mt-7d', category: 'motos', name: 'CFMoto 650 MT - 7 Días', defaultPrice: '395€' },
  { id: 'scooter-30m', category: 'scooters', name: 'Patinete Skateflash - 30 min', defaultPrice: '10€' },
  { id: 'scooter-1h', category: 'scooters', name: 'Patinete Skateflash - 1h', defaultPrice: '15€' },
  { id: 'scooter-premium-30m', category: 'scooters', name: 'Patinete EcoXtrem - 30 min', defaultPrice: '10€' },
  { id: 'scooter-premium-1h', category: 'scooters', name: 'Patinete EcoXtrem - 1h', defaultPrice: '15€' },
  { id: 'scooter-disabled-1d', category: 'scooters', name: 'Scooter Minusválidos - 1 Día', defaultPrice: '25€' },
  { id: 'scooter-disabled-3d', category: 'scooters', name: 'Scooter Minusválidos - 3 Días', defaultPrice: '60€' },
  { id: 'scooter-disabled-7d', category: 'scooters', name: 'Scooter Minusválidos - 7 Días', defaultPrice: '120€' },

  // Accesorios
  { id: 'accesorio-sillon', category: 'bicicletas', name: 'Sillón para Niños', defaultPrice: '3€' },
  { id: 'accesorio-carro', category: 'bicicletas', name: 'Carro Remolque', defaultPrice: '6€' },
  { id: 'accesorio-quad-ninos', category: 'quads', name: 'Quad para Niños - 30min', defaultPrice: '30€' },

  // Tours Quads
  { id: 'quad-tour-1h-1', category: 'quads', name: 'Quad Tour 1H (1 Pers)', defaultPrice: '75€' },
  { id: 'quad-tour-1h-2', category: 'quads', name: 'Quad Tour 1H (2 Pers)', defaultPrice: '90€' },
  { id: 'quad-tour-2h-1', category: 'quads', name: 'Quad Tour 2H (1 Pers)', defaultPrice: '90€' },
  { id: 'quad-tour-2h-2', category: 'quads', name: 'Quad Tour 2H (2 Pers)', defaultPrice: '120€' },
  { id: 'quad-tour-3h-1', category: 'quads', name: 'Quad Tour 3H (1 Pers)', defaultPrice: '150€' },
  { id: 'quad-tour-3h-2', category: 'quads', name: 'Quad Tour 3H (2 Pers)', defaultPrice: '170€' },

  // Tours
  { id: 'dolphin-trip', category: 'tours', name: 'Dolphin Trip', defaultPrice: '18€' },
  { id: 'dolphin-trip-child', category: 'tours', name: 'Dolphin Trip (Niño)', defaultPrice: '12€' },
  { id: 'alhambra-granada', category: 'tours', name: 'Alhambra de Granada', defaultPrice: '94€' },
  { id: 'caminito-rey', category: 'tours', name: 'Caminito del Rey', defaultPrice: '63€' },
  { id: 'paseo-caballo', category: 'tours', name: 'Paseos a Caballo', defaultPrice: '65€' },
  { id: 'gibraltar-shopping', category: 'tours', name: 'Gibraltar Shopping', defaultPrice: '33€' },
  { id: 'gibraltar-visit', category: 'tours', name: 'Gibraltar Visit', defaultPrice: '83€' },
  { id: 'sevilla', category: 'tours', name: 'Sevilla', defaultPrice: '81€' },
  { id: 'cordoba', category: 'tours', name: 'Córdoba', defaultPrice: '81€' },
  { id: 'ronda', category: 'tours', name: 'Ronda', defaultPrice: '59€' },
  { id: 'nerja-setenil', category: 'tours', name: 'Nerja y Setenil', defaultPrice: '54€' },
  { id: 'frigiliana', category: 'tours', name: 'Frigiliana', defaultPrice: '45€' },
  { id: 'marbella-mijas', category: 'tours', name: 'Marbella y Mijas', defaultPrice: '48€' },
  { id: 'tanger', category: 'tours', name: 'Tánger', defaultPrice: '115€' },
  
  // Quads
  { id: 'quad-normal-1h', category: 'quads', name: 'Quad Normal - 1h', defaultPrice: '30€' },
  { id: 'quad-normal-2h', category: 'quads', name: 'Quad Normal - 2h', defaultPrice: '50€' },
  { id: 'quad-doble-1h', category: 'quads', name: 'Quad Doble - 1h', defaultPrice: '15€' },
  { id: 'quad-doble-allday', category: 'quads', name: 'Quad Doble - Todo el día', defaultPrice: '60€' },
]

export default function AdminDashboardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [savedMessage, setSavedMessage] = useState(false)

  const { prices, updatePrice, getPrice } = usePricing()

  // Local state for editing before saving
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  // Lógica de 3 clicks
  useEffect(() => {
    const trigger = document.getElementById('admin-dashboard-trigger')
    
    let timeout: NodeJS.Timeout
    const handleClick = () => {
      setClickCount(prev => {
        const newCount = prev + 1
        if (newCount === 3) {
          setIsOpen(true)
          return 0
        }
        return newCount
      })
      
      clearTimeout(timeout)
      timeout = setTimeout(() => setClickCount(0), 1000) // Reset after 1s
    }

    if (trigger) {
      trigger.addEventListener('click', handleClick)
    }

    return () => {
      if (trigger) trigger.removeEventListener('click', handleClick)
      clearTimeout(timeout)
    }
  }, [])

  // Initialize edit values
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const initial: Record<string, string> = {}
      initialEditableItems.forEach(item => {
        initial[item.id] = getPrice(item.id, item.defaultPrice)
      })
      setEditValues(initial)
    }
  }, [isOpen, isAuthenticated, getPrice])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'DanielleX30..'
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Contraseña incorrecta / Password errata')
    }
  }

  const handleSave = (id: string) => {
    updatePrice(id, editValues[id])
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    setPassword('')
    setError('')
    setClickCount(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <X className="h-6 w-6" />
        </button>

        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Panel de Administración <br/> <span className="text-lg font-normal text-gray-600">Pannello di Amministrazione</span>
            </h2>
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña / Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-center text-lg"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Acceder / Accedi
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-blue-900">Gestión de Precios / Gestione Prezzi</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Cambia los precios de los vehículos y tours. / Modifica i prezzi di veicoli e tour.</p>
                </div>
                <div className="flex items-center gap-4">
                  {savedMessage && (
                    <span className="flex items-center text-green-600 text-sm font-medium animate-in fade-in">
                      <CheckCircle className="h-4 w-4 mr-1" /> Guardado / Salvato
                    </span>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}>
                    <LogOut className="h-4 w-4 mr-2" /> Salir / Esci
                  </Button>
                </div>
              </div>
              <div className="mt-4 relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar ítem... / Cerca elemento..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-0">
              <Tabs defaultValue="bicicletas" className="w-full">
                <div className="border-b bg-white sticky top-0 z-10 px-6 py-2">
                  <TabsList className="w-full justify-start h-auto flex-wrap bg-transparent gap-2">
                    {pricingCategories.map(cat => (
                      <TabsTrigger 
                        key={cat.id} 
                        value={cat.id}
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 rounded-full px-4 py-2"
                      >
                        {cat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {pricingCategories.map(category => {
                  const items = initialEditableItems.filter(item => 
                    item.category === category.id && 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )

                  return (
                    <TabsContent key={category.id} value={category.id} className="p-6 m-0 outline-none">
                      {items.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No hay elementos / Nessun elemento</p>
                      ) : (
                        <div className="grid gap-4">
                          {items.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                              <div className="mb-3 sm:mb-0">
                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                <span className="text-xs text-gray-500 font-mono">ID: {item.id}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Input 
                                    value={editValues[item.id] || ''}
                                    onChange={(e) => setEditValues({...editValues, [item.id]: e.target.value})}
                                    className="w-24 text-right font-semibold"
                                  />
                                </div>
                                <Button 
                                  onClick={() => handleSave(item.id)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={editValues[item.id] === getPrice(item.id, item.defaultPrice)}
                                >
                                  <Save className="h-4 w-4 mr-1" /> Guardar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  )
                })}
              </Tabs>
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  )
}