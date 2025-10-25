"use client"

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, TrendingUp } from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ElevationChartProps {
  elevation: number[]
  distance: string
  routeName: string
}

export default function ElevationChart({ elevation, distance, routeName }: ElevationChartProps) {
  // Generar etiquetas de distancia basadas en el número de puntos de elevación
  const distanceLabels = elevation.map((_, index) => {
    const totalDistance = parseFloat(distance.replace(' km', ''))
    const pointDistance = (totalDistance / (elevation.length - 1)) * index
    return `${pointDistance.toFixed(1)} km`
  })

  // Calcular estadísticas
  const maxElevation = Math.max(...elevation)
  const minElevation = Math.min(...elevation)
  const elevationGain = elevation.reduce((gain, current, index) => {
    if (index === 0) return 0
    const diff = current - elevation[index - 1]
    return gain + (diff > 0 ? diff : 0)
  }, 0)

  const data = {
    labels: distanceLabels,
    datasets: [
      {
        label: 'Elevación (m)',
        data: elevation,
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Elevación: ${context.parsed.y}m`
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Distancia',
          color: '#666'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Elevación (m)',
          color: '#666'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        beginAtZero: false
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mountain className="h-5 w-5 text-green-600" />
          Perfil de Elevación - {routeName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <Line data={data} options={options} />
        </div>
        
        {/* Estadísticas de elevación */}
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{maxElevation}m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Máxima</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{minElevation}m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mínima</div>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{Math.round(elevationGain)}m</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Desnivel +</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}