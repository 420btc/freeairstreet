"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone, Mail, MapPin, QrCode, Clock, Users, Car, Bike, Zap, Wrench, ChevronDown, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageToggle } from '../components/LanguageToggle'
import { ThemeToggle } from '../components/ThemeToggle'
import RoutesComponent from '../components/RoutesComponent'



export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isMapActive, setIsMapActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useLanguage()


  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Free Air Street",
    "description": "Alquiler de bicicletas, patinetes eléctricos, motos, coches y tours guiados en Torremolinos",
    "url": "https://www.freeairstreet.com",
    "telephone": "+34655707412",
    "email": "rentairstreet@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle de la Playa, 22",
      "addressLocality": "Torremolinos",
      "addressRegion": "Málaga",
      "postalCode": "29620",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 36.6322,
      "longitude": -4.4892
    },
    "openingHours": "Mo-Su 09:00-22:00",
    "priceRange": "€€",
    "image": "https://www.freeairstreet.com/hero.png",
    "sameAs": [
      "https://www.freeairstreet.com"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Alquiler y Tours",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Alquiler de Bicicletas",
            "description": "Bicicletas urbanas, eléctricas y mountain bikes"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Tours en Quad",
            "description": "Experiencias de aventura en quad por los alrededores de Málaga"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Patinetes Eléctricos",
            "description": "Alquiler de patinetes eléctricos para movilidad urbana"
          }
        }
      ]
    }
  }

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Only run on client-side where window is defined
    if (typeof window === 'undefined') return;
    
    // Ensure the map container exists
    if (!document.getElementById('mapbox-container')) return;
    
    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw';

    try {
      // Initialize map
      const map = new mapboxgl.Map({
        container: 'mapbox-container',
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [0, 0], // Start with global view
        zoom: 1,
        projection: 'globe'
      });

      // Disable map interactions on mobile until activated
      if (isMobile) {
        map.scrollZoom.disable();
        map.boxZoom.disable();
        map.dragRotate.disable();
        map.dragPan.disable();
        map.keyboard.disable();
        map.doubleClickZoom.disable();
        map.touchZoomRotate.disable();
      }

      // Handle double click to activate map on mobile
      let clickCount = 0;
      const mapContainer = document.getElementById('mapbox-container');
      
      if (isMobile && mapContainer) {
        const handleMapClick = () => {
          clickCount++;
          
          if (clickCount === 1) {
            setTimeout(() => {
              if (clickCount === 1) {
                // Single click - do nothing
                clickCount = 0;
              }
            }, 300);
          } else if (clickCount === 2) {
            // Double click - activate map
            setIsMapActive(true);
            map.scrollZoom.enable();
            map.boxZoom.enable();
            map.dragRotate.enable();
            map.dragPan.enable();
            map.keyboard.enable();
            map.doubleClickZoom.enable();
            map.touchZoomRotate.enable();
            clickCount = 0;
          }
        };
        
        mapContainer.addEventListener('click', handleMapClick);
      }

      map.on('load', () => {
        // Make map globally accessible for routes component
        (window as any).mapboxMap = map;
        
        // Force map resize to ensure it fills container properly
        setTimeout(() => {
          map.resize();
        }, 100);
        
        // Add atmosphere for globe effect
        map.setFog({
          'color': 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        });

        // Wait a moment then animate to location
        setTimeout(() => {
          map.flyTo({
            center: [-4.489167162077166, 36.63222134109576], // Exact coordinates
            zoom: 17,
            duration: 3000,
            essential: true
          });

          // Add custom scooter marker after animation
          setTimeout(() => {
            // Create custom marker element
            const markerElement = document.createElement('div');
            markerElement.innerHTML = '🛴';
            markerElement.style.fontSize = '12px';
            markerElement.style.backgroundColor = '#fbbf24';
            markerElement.style.borderRadius = '50%';
            markerElement.style.padding = '4px';
            markerElement.style.border = '1px solid #f59e0b';
            markerElement.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';

            // Create popup for main store
            const mainStorePopup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              closeOnClick: false
            }).setHTML(`
              <div class="p-3 text-center">
                <h3 class="font-bold text-sm text-gray-900 mb-1">Tienda Principal</h3>
                <p class="text-xs text-gray-600">Calle de la Playa, 22</p>
                <p class="text-xs text-gray-600">29620 Torremolinos</p>
              </div>
            `);

            const storeMarker = new mapboxgl.Marker(markerElement)
              .setLngLat([-4.489167162077166, 36.63222134109576])
              .setPopup(mainStorePopup)
              .addTo(map);
            
            // Add class to identify store marker
            setTimeout(() => {
              const markerEl = storeMarker.getElement();
              if (markerEl) {
                markerEl.classList.add('store-marker');
                
                // Add hover events for desktop
                markerEl.addEventListener('mouseenter', () => {
                  mainStorePopup.addTo(map);
                });
                markerEl.addEventListener('mouseleave', () => {
                  mainStorePopup.remove();
                });
              }
            }, 100);
            
            // Add second store marker (red scooter)
             const secondMarkerElement = document.createElement('div');
             secondMarkerElement.innerHTML = '🛴';
             secondMarkerElement.style.fontSize = '12px';
             secondMarkerElement.style.backgroundColor = '#ef4444';
             secondMarkerElement.style.borderRadius = '50%';
             secondMarkerElement.style.padding = '4px';
             secondMarkerElement.style.border = '1px solid #dc2626';
             secondMarkerElement.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';

             // Create popup for second store
             const secondStorePopup = new mapboxgl.Popup({
               offset: 25,
               closeButton: false,
               closeOnClick: false
             }).setHTML(`
               <div class="p-3 text-center">
                 <h3 class="font-bold text-sm text-gray-900 mb-1">Segunda Tienda</h3>
                 <p class="text-xs text-gray-600">Calle Obispo Juan Alonso, 8</p>
                 <p class="text-xs text-gray-600">Los Álamos, Torremolinos</p>
               </div>
             `);

             const secondStoreMarker = new mapboxgl.Marker(secondMarkerElement)
               .setLngLat([-4.487738, 36.635466])
               .setPopup(secondStorePopup)
               .addTo(map);
             
             // Add class to identify second store marker
             setTimeout(() => {
               const secondMarkerEl = secondStoreMarker.getElement();
               if (secondMarkerEl) {
                 secondMarkerEl.classList.add('store-marker');
                 
                 // Add hover events for desktop
                 secondMarkerEl.addEventListener('mouseenter', () => {
                   secondStorePopup.addTo(map);
                 });
                 secondMarkerEl.addEventListener('mouseleave', () => {
                   secondStorePopup.remove();
                 });
               }
             }, 100);
          }, 3200);
        }, 1000);
      });

      // Handle window resize to ensure map stays properly sized
      const handleResize = () => {
        if (map) {
          setTimeout(() => {
            map.resize();
          }, 100);
        }
      };
      
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (map) {
          map.remove();
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [isMobile])



  const services = [
    {
      title: t('services.bikeRental'),
      description: t('services.bikeDescription'),
      icon: <Bike className="h-10 w-10" />,
      href: "/alquiler?tab=bicicletas",
    },
    {
      title: t('services.guidedTours'),
      description: t('services.toursDescription'),
      icon: <Users className="h-10 w-10" />,
      href: "/tours",
    },
    {
      title: t('services.carRental'),
      description: t('services.carDescription'),
      icon: <Car className="h-10 w-10" />,
      href: "/alquiler?tab=coches",
    },
    {
      title: t('services.motosScooters'),
      description: t('services.motosDescription'),
      icon: <Zap className="h-10 w-10" />,
      href: "/alquiler?tab=scooters",
    },
    {
      title: t('services.repairService'),
      description: t('services.repairDescription'),
      icon: <Wrench className="h-10 w-10" />,
      href: "/tienda",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center sm:justify-start leading-3 font-mono italic tracking-tighter space-x-4 sm:space-x-12 hover:opacity-80 transition-opacity cursor-pointer">
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={64} height={64} className="rounded" />
              <div className="text-center sm:text-left" style={{marginLeft: '3px'}}>
                <div className="text-3xl sm:text-4xl font-black text-blue-900 navbar-title birthstone-regular leading-tight whitespace-nowrap">Free Air Street</div>
                <p className="hidden sm:block text-2xl text-blue-800 navbar-subtitle birthstone-regular -mt-3">Rent & Tours</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
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
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
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
                <button 
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-left text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp flex items-center space-x-2"
                  style={{ animationDelay: '0.5s' }}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="animate-typewriter" style={{ animationDelay: '0.5s' }}>Rent a Quad</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 md:py-56 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          ref={(el) => {
            if (el) {
              const image = el.querySelector('img');
              const video = el.querySelector('video');
              let playCount = 0;
              
              // Mostrar imagen por 3 segundos
              setTimeout(() => {
                if (image && video) {
                  image.style.opacity = '0';
                  video.style.opacity = '1';
                  video.play();
                }
              }, 3000);
              
              // Escuchar cuando el video termine
              if (video) {
                video.addEventListener('ended', () => {
                  playCount++;
                  if (playCount < 3) {
                    video.play(); // Reproducir de nuevo
                  } else {
                    // Después de 3 reproducciones, volver a la imagen
                    video.style.opacity = '0';
                    if (image) {
                      image.style.opacity = '1';
                    }
                  }
                });
              }
            }
          }}
        >
          <Image 
            src="/hero.png" 
            alt="Hero background" 
            fill 
            className="object-cover transition-opacity duration-1000" 
            style={{ filter: 'blur(1px)', opacity: 1 }}
            priority
          />
          <video
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ filter: 'blur(1px)', opacity: 0 }}
          >
            <source src="/herov.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)'}}>{t('hero.title')}</h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-8 max-w-3xl mx-auto drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'}}>
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/alquiler">
              <Button size="xl" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 md:px-12 md:py-7 md:text-xl">
                {t('hero.viewRentals')}
              </Button>
            </Link>
            <Link href="/tours">
              <Button
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 bg-transparent md:bg-white md:text-blue-600 md:border-blue-600 md:hover:bg-blue-50 md:px-12 md:py-7 md:text-xl"
              >
                {t('hero.bookTour')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('services.title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {t('services.subtitle')}
              </p>
          </div>

          {/* Desktop (md+) layout: keep existing structure and include Store card */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* First row: 2 cards */}
            {services.slice(0, 2).map((service, index) => (
              <Link key={index} href={service.href}>
                <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                      <div className="h-10 w-10 flex items-center justify-center">
                        {service.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{service.description}</CardDescription>
                    <div className="text-center mt-3">
                      <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {t('common.seeMore')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Second row: Repair Service (2 cols) */}
            <div className="lg:col-span-2">
              <Link href={services[4].href}>
                <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                      <div className="h-10 w-10 flex items-center justify-center">
                        {services[4].icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{services[4].title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{services[4].description}</CardDescription>
                    <div className="text-center mt-3">
                      <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {t('common.seeMore')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Second row: Car and Motos cards */}
            {services.slice(2, 4).map((service, index) => (
              <Link key={index} href={service.href}>
                <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                      <div className="h-10 w-10 flex items-center justify-center">
                        {service.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{service.description}</CardDescription>
                    <div className="text-center mt-3">
                      <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {t('common.seeMore')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Store Card (desktop only visible due to parent) */}
            <div className="lg:col-span-2">
              <Link href="/tienda?tab=store">
                <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                      <div className="h-10 w-10 flex items-center justify-center">
                        <Store className="h-10 w-10" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{t('services.store')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{t('services.storeDescription')}</CardDescription>
                    <div className="text-center mt-3">
                      <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {t('common.seeMore')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Mobile (sm) layout: custom order without Store card */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {/* 1. Alquiler de Bicicletas (services[0]) */}
            <Link href={services[0].href}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                    <div className="h-10 w-10 flex items-center justify-center">
                      {services[0].icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{services[0].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{services[0].description}</CardDescription>
                  <div className="text-center mt-3">
                    <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {t('common.seeMore')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 2. Alquiler de Coches (services[2]) */}
            <Link href={services[2].href}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                    <div className="h-10 w-10 flex items-center justify-center">
                      {services[2].icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{services[2].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{services[2].description}</CardDescription>
                  <div className="text-center mt-3">
                    <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Ver más →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 3. Motos y Scooters (services[3]) */}
            <Link href={services[3].href}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                    <div className="h-10 w-10 flex items-center justify-center">
                      {services[3].icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{services[3].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{services[3].description}</CardDescription>
                  <div className="text-center mt-3">
                    <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Ver más →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 4. Visitas Guiadas (services[1]) */}
            <Link href={services[1].href}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                    <div className="h-10 w-10 flex items-center justify-center">
                      {services[1].icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{services[1].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{services[1].description}</CardDescription>
                  <div className="text-center mt-3">
                    <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Ver más →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 5. Servicio Reparación (services[4]) */}
            <Link href={services[4].href}>
              <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group h-full border-2 border-transparent hover:border-yellow-400 max-w-sm md:max-w-none mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-yellow-400 rounded-full text-blue-600 group-hover:bg-yellow-500 transition-colors">
                    <div className="h-10 w-10 flex items-center justify-center">
                      {services[4].icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">{services[4].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-lg text-gray-600 group-hover:text-gray-800 transition-colors">{services[4].description}</CardDescription>
                  <div className="text-center mt-3">
                    <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Ver más →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

        </div>
      </section>

      {/* Where We Are Section */}
      <section className="pt-8 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('location.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('location.description.before')}
              <Badge className="bg-yellow-400 text-blue-600 hover:bg-yellow-500 text-lg">Torremolinos</Badge>
              {t('location.description.after')}
            </p>
          </div>
          
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <div id="mapbox-container" className="w-full h-full"></div>
            
            {/* Mobile activation notice */}
            {isMobile && !isMapActive && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs shadow-md z-10 pointer-events-none">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xs">👆</span>
                  {t('map.doubleClickToActivate') || '2 toques para activar'}
                </span>
              </div>
            )}
            
            {/* Overlay to prevent scrolling interference on mobile */}
            {isMobile && !isMapActive && (
              <div className="absolute inset-0 bg-transparent z-5"></div>
            )}
          </div>
          
          {/* Routes Component */}
          <div className="mt-8 mb-8">
            <RoutesComponent />
          </div>
          
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Location Info */}
              <div className="bg-gray-50 rounded-lg p-8 shadow-lg border">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                  {t('location.ourLocation')}
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <span className="font-semibold text-gray-900 min-w-0 flex-1">
                      {t('location.address')}<br/>
                      {t('location.city')}<br/>
                      {t('location.country')}
                    </span>
                  </p>
                </div>
                <div className="mt-6">
                  <a 
                    href="https://www.google.com/local/place/fid/0xd72fbe7f18b7617:0x749a1052ecf23196/photosphere?iu=https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid%3Dya1f82-P9e7HTdzyoS5egg%26cb_client%3Dsearch.gws-prod.gps%26yaw%3D348.13068%26pitch%3D0%26thumbfov%3D100%26w%3D0%26h%3D0&ik=CAISFnlhMWY4Mi1QOWU3SFRkenlvUzVlZ2c%3D&sa=X&ved=2ahUKEwitnuPJ1PSOAxVaS_EDHX-WKOQQpx96BAggEBA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t('location.streetView')}
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 rounded-lg p-8 shadow-lg border">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                   <Phone className="h-6 w-6 mr-2 text-blue-600" />
                   {t('contact.title')}
                 </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{t('location.phone')}</p>
                      <p className="text-sm text-gray-600">{t('location.hours')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div>
                       <p className="font-semibold text-gray-900">{t('location.email')}</p>
                       <p className="text-sm text-gray-600">{t('contact.emailResponse')}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Store Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="relative">
              <Image 
                src="/solhiress.jpeg" 
                alt="Segunda tienda Free Air Street" 
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-[300px] md:h-[400px]"
              />
            </div>
            
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t('secondStore.title')} <span className="text-blue-600 underline">{t('secondStore.otherStore')}</span> {t('secondStore.available')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{t('secondStore.secondLocation')}</p>
                    <p className="text-gray-700">{t('secondStore.address')}</p>
                    <p className="text-gray-700">{t('secondStore.city')}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {t('secondStore.description')}
                </p>
              </div>
              
              <a 
                href="https://maps.app.goo.gl/5KcHf2wMjwn9kMEFA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('secondStore.viewOnMaps')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Prices Section */}
      <section className="py-16 bg-yellow-400">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{t('prices.title')}</h2>
            <p className="text-lg text-blue-800">{t('prices.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-blue-900">{t('prices.cityBike')}</CardTitle>
                <CardDescription>{t('prices.cityBikeDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between">
                    <span>{t('prices.hour')}</span>
                    <Badge variant="secondary" className="text-lg font-bold">3€</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('prices.allDay')}</span>
                    <Badge className="bg-yellow-500 text-blue-900 text-xl font-bold">13€</Badge>
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <Link href="/alquiler?tab=bicicletas">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2">
                      Reservar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-blue-900">{t('prices.electricBike')}</CardTitle>
                <CardDescription>{t('prices.electricBikeDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between">
                    <span>{t('prices.hour')}</span>
                    <Badge variant="secondary" className="text-lg font-bold">10€</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('prices.allDay')}</span>
                    <Badge className="bg-yellow-500 text-blue-900 text-xl font-bold">35€</Badge>
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <Link href="/alquiler?tab=bicicletas">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2">
                      Reservar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-blue-900">{t('prices.traditionalScooter')}</CardTitle>
                <CardDescription>{t('prices.traditionalScooterDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between">
                    <span>{t('prices.halfHour')}</span>
                    <Badge variant="secondary" className="text-lg font-bold">10€</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('prices.hour')}</span>
                    <Badge className="bg-yellow-500 text-blue-900 text-xl font-bold">15€</Badge>
                  </div>
                </div>
                <div className="text-center mt-auto">
                  <Link href="/alquiler?tab=scooters">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2">
                      Reservar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>


          </div>
          
          {/* Scooter Promotion Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="relative">
                <Image 
                  src="/patinetex.png" 
                  alt="Patinete eléctrico" 
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain"
                />
              </div>
              
              {/* Content */}
              <div className="text-center lg:text-left space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-blue-900">
                  ¡Descubre nuestros patinetes eléctricos!
                </h3>
                <p className="text-lg text-gray-700">
                  La forma más divertida y ecológica de moverte por Torremolinos.
                </p>
                <Link href="/alquiler?tab=scooters">
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 py-3 text-lg shadow-lg">
                    Reservar Patinete
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="tours-destacados" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('tours.title')}</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {t('tours.subtitle')}
            </p>
          </div>

          {/* Sol Hires Images and Video Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mt-8 mb-8">
            {/* Sol Hires Animated Images - Left Side */}
            <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md">
              <div 
                className="relative w-full h-auto sol-hires-container overflow-hidden"
                ref={(el) => {
                  if (el) {
                    const observer = new IntersectionObserver(
                      (entries) => {
                        entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                            entry.target.classList.add('animate');
                            observer.unobserve(entry.target);
                          }
                        });
                      },
                      { threshold: 0.5 }
                    );
                    observer.observe(el);
                  }
                }}
              >
                <Image
                  src="/solhires.png"
                  alt="Sol Hires 1"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover object-top sol-hires-front"
                  style={{objectPosition: '50% 20%'}}
                />
                <Image
                  src="/solhires2.png"
                  alt="Sol Hires 2"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover object-top sol-hires-back absolute top-0 left-0 opacity-0"
                  style={{objectPosition: '50% 20%'}}
                />
              </div>
            </div>
            
            {/* Video Section - Right Side */}
             <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md">
               <div 
                   className="relative w-full h-auto overflow-hidden rounded-lg shadow-lg mb-6"
                   ref={(el) => {
                     if (el) {
                       const video = el.querySelector('video');
                       const source = video?.querySelector('source');
                       let isHighQuality = false;
                       
                       const observer = new IntersectionObserver(
                         (entries) => {
                           entries.forEach((entry) => {
                             if (video && source) {
                               if (entry.isIntersecting && !isHighQuality) {
                                 // Usuario está viendo el video - cambiar a alta calidad
                                 const currentTime = video.currentTime;
                                 source.src = '/videoplayback.mp4';
                                 video.load();
                                 video.currentTime = currentTime;
                                 video.play();
                                 isHighQuality = true;
                               } else if (!entry.isIntersecting && isHighQuality) {
                                 // Usuario no está viendo el video - cambiar a baja calidad
                                 const currentTime = video.currentTime;
                                 source.src = '/videopedido.mp4'; // Video de menor calidad
                                 video.load();
                                 video.currentTime = currentTime;
                                 video.play();
                                 isHighQuality = false;
                               }
                             }
                           });
                         },
                         { 
                           threshold: 0.3,
                           rootMargin: '-50px 0px -50px 0px'
                         }
                       );
                       observer.observe(el);
                     }
                   }}
                 >
                   <video
                     autoPlay
                     loop
                     muted
                     playsInline
                     className="w-full h-auto object-cover transition-opacity duration-500 ease-in-out"
                   >
                     <source src="/videopedido.mp4" type="video/mp4" />
                     Tu navegador no soporta el elemento de video.
                   </video>
                 </div>
               
               {/* Quad Tours Pricing Table */}
               <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200">
                 <div className="text-center mb-4">
                   <h3 className="text-lg font-bold text-gray-800 mb-1">{t('quadTours.title')}</h3>
                   <p className="text-sm text-gray-600">{t('quadTours.subtitle')}</p>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-1 text-xs font-bold">
                   {/* Headers */}
                   <div className="bg-black text-white p-2 text-center rounded-tl">{t('quadTours.hour')}</div>
                   <div className="bg-black text-white p-2 text-center">{t('quadTours.tour')}</div>
                   <div className="bg-black text-white p-2 text-center rounded-tr">{t('quadTours.price')}</div>
                   
                   {/* 1H Row */}
                      <div className="bg-yellow-400 text-black p-2 text-center flex items-center justify-center font-black text-lg">1H</div>
                      <div className="bg-yellow-400 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-lg mb-1">👤</div>
                        <div className="text-lg">👥</div>
                      </div>
                      <div className="bg-yellow-400 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-xs font-bold mb-1">75€ {t('quadTours.perQuad')}</div>
                        <div className="text-xs font-bold">90€ {t('quadTours.perQuad')}</div>
                      </div>
                      
                      {/* 2H Row */}
                      <div className="bg-orange-500 text-black p-2 text-center flex items-center justify-center font-black text-lg">2H</div>
                      <div className="bg-orange-500 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-lg mb-1">👤</div>
                        <div className="text-lg">👥</div>
                      </div>
                      <div className="bg-orange-500 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-xs font-bold mb-1">90€ {t('quadTours.perQuad')}</div>
                        <div className="text-xs font-bold">120€ {t('quadTours.perQuad')}</div>
                      </div>
                      
                      {/* 3H Row */}
                      <div className="bg-red-500 text-white p-2 text-center flex items-center justify-center font-black text-lg">3H</div>
                      <div className="bg-red-500 text-white p-2 text-center flex flex-col justify-center">
                        <div className="text-lg mb-1">👤</div>
                        <div className="text-lg">👥</div>
                      </div>
                      <div className="bg-red-500 text-white p-2 text-center flex flex-col justify-center">
                        <div className="text-xs font-bold mb-1">150€ {t('quadTours.perQuad')}</div>
                        <div className="text-xs font-bold">170€ {t('quadTours.perQuad')}</div>
                      </div>
                 </div>
                 
                 <div className="mt-3 text-center">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded text-xs font-semibold">
                      {t('quadTours.kidsTravel')}
                      <div className="text-xs font-normal">({t('quadTours.ageRange')})</div>
                      <div className="text-xs font-bold">{t('quadTours.adventureForAll')}</div>
                    </div>
                    
                    {/* Rent Quad Logo and Reserve Button */}
                     <div className="mt-3 flex items-center justify-center gap-3">
                       <Image
                         src="/rentwuad.png"
                         alt="Rent Quad Logo"
                         width={80}
                         height={30}
                         className="object-contain"
                       />
                       <Button
                           onClick={() => window.open('https://quadaventuracostadelsol.com/actividades-de-aventura', '_blank')}
                           className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded text-sm"
                         >
                           Reservar Ahora
                         </Button>
                     </div>
                  </div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src="/lugares/dolphintrip.jpg"
                  alt="Dolphin Trip"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">🐬</div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-blue-900 font-bold text-xl">18€</Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl text-gray-900">
                    {t('tours.dolphinTrip')}
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mt-1">{t('tours.adults')}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Marina Benalmádena</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('tours.dolphinDesc')}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.children')}
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.familyExperience')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src="/destinos/alhambragranada.png"
                  alt="Granada Alhambra"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">🏰</div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-blue-900 font-bold text-xl">79€</Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl text-gray-900">
                    {t('tours.granadaAlhambra')}
                  </CardTitle>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{t('tours.thursdayFriday')}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{t('tours.granadaDesc')}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.unescoHeritage')}
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.officialGuide')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src="/lugares/paseocaballo.jpeg"
                  alt="Paseos a Caballo"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">🐎</div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-blue-900 font-bold text-xl">65€</Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl text-gray-900">
                    {t('tours.horseRiding')}
                  </CardTitle>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{t('tours.duration')}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('tours.horseDesc')}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>{t('tours.onePersonPerHorse')}
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.expertGuide')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/tours">
              <Button size="xl" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg">
                {t('tours.viewAllTours')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('contact.title')}</h2>
            <p className="text-lg text-blue-100">{t('contact.subtitle')}</p>
            <div className="mt-6">
              <a
                href="tel:655707412"
                className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <Phone className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.phone')}</h3>
              <a href="tel:655707412" className="text-blue-100 hover:text-white transition-colors cursor-pointer">655 707 412</a>
              <p className="text-blue-200 text-sm mt-1">{t('contact.phoneHours')}</p>
            </div>

            <div className="text-white">
              <Mail className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.email')}</h3>
              <p className="text-blue-100">rentairstreet@gmail.com</p>
              <p className="text-blue-200 text-sm mt-1">{t('contact.emailResponse')}</p>
            </div>

            <div className="text-white">
              <MapPin className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.location')}</h3>
              <p className="text-blue-100">{t('location.address')}</p>
              <p className="text-blue-200 text-sm mt-1">{t('location.city')}</p>
            </div>
          </div>
        </div>
      </section>

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
              <p className="text-gray-700">{t('footer.rights')}</p>
              <div className="flex items-center justify-center md:justify-end space-x-2 mt-2">
                <span className="text-gray-700 text-sm">Web made by:</span>
                <a 
                  href="https://carlosfr.es" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-400 transition-colors cursor-pointer"
                >
                  Carlosfr.es
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

    </div>
  )
}
