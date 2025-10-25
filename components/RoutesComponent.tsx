"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Route, Navigation } from "lucide-react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useLanguage } from '../contexts/LanguageContext'

interface RouteData {
  id: string
  name: string
  description: string
  duration: string
  distance: string
  difficulty: 'easy' | 'medium' | 'hard'
  highlights: string[]
  coordinates: [number, number][]
  waypoints: {
    name: string
    coordinates: [number, number]
    description: string
  }[]
}

const STORE_COORDINATES: [number, number] = [-4.489167162077166, 36.63222134109576]

const routes: RouteData[] = [
  {
    id: 'coastal-route',
    name: 'Ruta Costera Torremolinos',
    description: 'Disfruta de las mejores vistas del mar Mediterráneo',
    duration: '2-3 horas',
    distance: '15 km',
    difficulty: 'easy',
    highlights: ['Playa de la Carihuela', 'Puerto Marina Benalmádena', 'Paseo Marítimo'],
    coordinates: [
      STORE_COORDINATES,
      [-4.5041, 36.6091], // Playa de la Carihuela
      [-4.5151, 36.5998], // Puerto Marina
      [-4.4979, 36.6162], // Paseo Marítimo
      [-4.4756, 36.6229], // Benalmádena Costa
      STORE_COORDINATES
    ],
    waypoints: [
      {
        name: 'Playa de la Carihuela',
        coordinates: [-4.5041, 36.6091],
        description: 'Playa tradicional con chiringuitos típicos andaluces'
      },
      {
        name: 'Puerto Marina Benalmádena',
        coordinates: [-4.5151, 36.5998],
        description: 'Puerto deportivo con restaurantes y vida nocturna'
      },
      {
        name: 'Paseo Marítimo',
        coordinates: [-4.4979, 36.6162],
        description: 'Hermoso paseo junto al mar con vistas panorámicas'
      }
    ]
  },
  {
    id: 'mountain-route',
    name: 'Ruta Panorámica Benalmádena',
    description: 'Aventura por las alturas de Benalmádena con vistas espectaculares',
    duration: '3-4 horas',
    distance: '25 km',
    difficulty: 'medium',
    highlights: ['Benalmádena Pueblo', 'Teleférico', 'Mirador del Macho Cabrio'],
    coordinates: [
      STORE_COORDINATES,
      [-4.4923, 36.6445], // Hacia los montes
      [-4.4967, 36.6512], // Mirador
      [-4.5012, 36.6578], // Pueblo de Benalmádena
      [-4.4978, 36.6534], // Teleférico
      [-4.4934, 36.6467], // Regreso
      STORE_COORDINATES
    ],
    waypoints: [
      {
        name: 'Benalmádena Pueblo',
        coordinates: [-4.5726, 36.5961],
        description: 'Encantador pueblo andaluz con arquitectura tradicional'
      },
      {
        name: 'Teleférico de Benalmádena',
        coordinates: [-4.5151, 36.5998],
        description: 'Estación del teleférico con vistas espectaculares'
      },
      {
        name: 'Mirador del Macho Cabrio',
        coordinates: [-4.5486, 36.6009],
        description: 'Mirador con vistas panorámicas de la Costa del Sol'
      }
    ]
  },
  {
    id: 'cultural-route',
    name: 'Ruta Cultural Málaga Centro',
    description: 'Descubre la historia y cultura del centro de Málaga',
    duration: '4-5 horas',
    distance: '35 km',
    difficulty: 'hard',
    highlights: ['Centro Histórico', 'Alcazaba', 'Museo Picasso', 'Catedral'],
    coordinates: [
      STORE_COORDINATES,
      [-4.4567, 36.6423], // Hacia Málaga
      [-4.4234, 36.6789], // Centro de Málaga
      [-4.4198, 36.7201], // Alcazaba
      [-4.4176, 36.7189], // Museo Picasso
      [-4.4187, 36.7198], // Catedral
      [-4.4234, 36.6789], // Centro
      [-4.4567, 36.6423], // Regreso
      STORE_COORDINATES
    ],
    waypoints: [
      {
        name: 'Centro Histórico Málaga',
        coordinates: [-4.4203, 36.7202],
        description: 'Corazón histórico con calles peatonales y tiendas'
      },
      {
        name: 'Alcazaba de Málaga',
        coordinates: [-4.4156, 36.7202],
        description: 'Fortaleza árabe del siglo XI con jardines nazaríes'
      },
      {
        name: 'Museo Picasso Málaga',
        coordinates: [-4.4176, 36.7189],
        description: 'Museo en Calle San Agustín dedicado al genio Pablo Picasso'
      },
      {
        name: 'Catedral de Málaga',
        coordinates: [-4.4187, 36.7198],
        description: 'Catedral renacentista conocida como "La Manquita"'
      }
    ]
  }
]

export default function RoutesComponent() {
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null)
  const [showRoutes, setShowRoutes] = useState(false)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const { t } = useLanguage()

  const getDirectionsRoute = async (waypoints: [number, number][]) => {
    try {
      const coordinates = waypoints.map(coord => `${coord[0]},${coord[1]}`).join(';')
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      )
      const data = await response.json()
      
      if (data.routes && data.routes[0]) {
        return data.routes[0].geometry.coordinates
      }
      return waypoints
    } catch (error) {
      console.error('Error getting directions:', error)
      return waypoints
    }
  }

  const clearRouteFromMap = () => {
    if (!map || !map.isStyleLoaded()) return
    
    try {
      // Clear existing route layer first
      if (map.getLayer('route')) {
        map.removeLayer('route')
      }
      
      // Then clear the source
      if (map.getSource('route')) {
        map.removeSource('route')
      }
      
      // Clear all markers
      const markers = document.querySelectorAll('.mapboxgl-marker')
      markers.forEach(marker => {
        if (!marker.classList.contains('store-marker')) {
          marker.remove()
        }
      })
      
      // Return to store location
      map.flyTo({
        center: STORE_COORDINATES,
        zoom: 17,
        duration: 1000
      })
    } catch (error) {
      console.error('Error clearing route from map:', error)
    }
  }

  const scrollToMap = () => {
    const mapContainer = document.getElementById('mapbox-container')
    if (mapContainer) {
      mapContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }

  useEffect(() => {
    if (selectedRoute && map && map.isStyleLoaded()) {
      clearRouteFromMap()
      
      // Scroll to map when route is selected
      setTimeout(() => {
        scrollToMap()
      }, 300)
      
      // Get real street directions
      const routeWaypoints = [STORE_COORDINATES, ...selectedRoute.waypoints.map(w => w.coordinates), STORE_COORDINATES]
      
      getDirectionsRoute(routeWaypoints).then(routeCoordinates => {
        try {
          if (!map || !map.isStyleLoaded()) {
            console.warn('Map not ready for route rendering')
            return
          }

          // Ensure any existing route is cleared before adding new one
          if (map.getLayer('route')) {
            map.removeLayer('route')
          }
          if (map.getSource('route')) {
            map.removeSource('route')
          }

          // Add route line with real street navigation
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          })

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 2,
              'line-opacity': 0.9
            }
          })

          // Add waypoint markers
          selectedRoute.waypoints.forEach((waypoint, index) => {
            try {
              if (!map || !map.getContainer()) {
                console.warn('Map not properly initialized, skipping marker creation')
                return
              }

              const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-bold text-sm">${waypoint.name}</h3>
                    <p class="text-xs text-gray-600">${waypoint.description}</p>
                  </div>
                `)

              new mapboxgl.Marker({
                color: '#f59e0b',
                scale: 0.8
              })
                .setLngLat(waypoint.coordinates)
                .setPopup(popup)
                .addTo(map)
            } catch (error) {
              console.error('Error adding marker to map:', error)
            }
          })

          // Fit map to route bounds
          const bounds = new mapboxgl.LngLatBounds()
          routeCoordinates.forEach((coord: [number, number]) => bounds.extend(coord))
          map.fitBounds(bounds, { padding: 50 })
        } catch (error) {
          console.error('Error rendering route on map:', error)
        }
      })
    } else if (!selectedRoute && map) {
      clearRouteFromMap()
    }
  }, [selectedRoute, map])

  useEffect(() => {
    if (!showRoutes && map) {
      clearRouteFromMap()
      setSelectedRoute(null)
    }
  }, [showRoutes, map])

  useEffect(() => {
    // Get the existing map instance
    const mapContainer = document.getElementById('mapbox-container')
    if (mapContainer) {
      // Wait for the map to be initialized
      const checkMap = () => {
        const existingMap = (window as any).mapboxMap
        if (existingMap && existingMap.isStyleLoaded && existingMap.isStyleLoaded()) {
          setMap(existingMap)
        } else if (existingMap) {
          // Map exists but style not loaded yet, wait for style to load
          existingMap.on('styledata', () => {
            if (existingMap.isStyleLoaded()) {
              setMap(existingMap)
            }
          })
        } else {
          setTimeout(checkMap, 1000)
        }
      }
      checkMap()
    }
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Medio'
      case 'hard': return 'Difícil'
      default: return 'Desconocido'
    }
  }

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <Button
          onClick={() => setShowRoutes(!showRoutes)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
        >
          <Route className="h-5 w-5 mr-2" />
          {showRoutes ? (
            <>Ocultar <span className="text-yellow-400">Rutas</span></>
          ) : (
            <>Ver <span className="text-yellow-400">Rutas</span> Disponibles</>
          )}
        </Button>
      </div>

      {showRoutes && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rutas Recomendadas</h3>
            <p className="text-gray-600">Todas las rutas comienzan y terminan en nuestra tienda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card 
                key={route.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  selectedRoute?.id === route.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    <Badge className={`${getDifficultyColor(route.difficulty)} text-white`}>
                      {getDifficultyText(route.difficulty)}
                    </Badge>
                  </div>
                  <CardDescription>{route.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Navigation className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{route.distance}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Puntos destacados:</h4>
                      <ul className="space-y-1">
                        {route.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      variant={selectedRoute?.id === route.id ? "default" : "outline"}
                    >
                      {selectedRoute?.id === route.id ? 'Ruta Seleccionada' : 'Ver en Mapa'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedRoute && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900">Ruta Activa: {selectedRoute.name}</h4>
                <Button 
                  onClick={() => setSelectedRoute(null)}
                  variant="outline"
                  size="sm"
                >
                  Limpiar Ruta
                </Button>
              </div>
              <p className="text-gray-700 mb-4">{selectedRoute.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  <span><strong>Duración:</strong> {selectedRoute.duration}</span>
                </div>
                <div className="flex items-center">
                  <Navigation className="h-4 w-4 mr-2 text-blue-600" />
                  <span><strong>Distancia:</strong> {selectedRoute.distance}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  <span><strong>Paradas:</strong> {selectedRoute.waypoints.length}</span>
                </div>
                <div className="flex items-center">
                  <Badge className={`${getDifficultyColor(selectedRoute.difficulty)} text-white`}>
                    {getDifficultyText(selectedRoute.difficulty)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}