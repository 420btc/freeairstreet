"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone, Mail, MapPin, QrCode, Clock, Users, Car, Bike, Zap, Wrench, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useLanguage } from '../contexts/LanguageContext'
import { usePricing } from '../contexts/PricingContext'
import { LanguageToggle } from '../components/LanguageToggle'
import { ThemeToggle } from '../components/ThemeToggle'
import RoutesComponent from '../components/RoutesComponent'
import QuickRentalSection from '../components/QuickRentalSection'
import { SectionHeading } from "@/components/site/SectionHeading"
import { SiteFooter } from "@/components/site/SiteFooter"



export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isMapActive, setIsMapActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useLanguage()
  const { getPrice } = usePricing()


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
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

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
        
        // Additional resize for desktop with proper timing
        if (!isMobile) {
          setTimeout(() => {
            map.resize();
          }, 200);
          
          // Final resize to ensure proper rendering
          setTimeout(() => {
            map.resize();
          }, 1000);
        }
        
        // Add atmosphere for globe effect
        map.setFog({
          'color': 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        });

        // Wait a moment then animate to location
        // Ejecutar la animación inmediatamente después de cargar
        map.flyTo({
          center: [-4.489167162077166, 36.63222134109576], // Exact coordinates
          zoom: 18, // Un poco más de zoom para ver mejor
          pitch: 45, // Añadir inclinación para efecto 3D
          bearing: -17.6, // Orientación
          duration: 4000, // Un poco más lento para apreciar el viaje
          essential: true
        });

        // Add markers immediately so they are ready when we arrive
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = '🛴';
        markerElement.style.fontSize = '24px'; // Más grande
        markerElement.style.backgroundColor = '#fbbf24';
        markerElement.style.borderRadius = '50%';
        markerElement.style.padding = '8px';
        markerElement.style.border = '2px solid #f59e0b';
        markerElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        markerElement.style.zIndex = '10';
        // markerElement.className = 'animate-bounce'; // Eliminado para evitar que flote

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
        
        // Mostrar popup al terminar la animación
        map.once('moveend', () => {
            mainStorePopup.addTo(map);
        });
        
        // Add class to identify store marker
        const markerEl = storeMarker.getElement();
        if (markerEl) {
          markerEl.classList.add('store-marker');
          
          // Add hover events for desktop
          markerEl.addEventListener('mouseenter', () => {
            mainStorePopup.addTo(map);
          });
          markerEl.addEventListener('mouseleave', () => {
             // Mantener abierto si es el destino principal, o cerrar
             // mainStorePopup.remove(); 
          });
        }
        
        // Add second store marker (red scooter)
          const secondMarkerElement = document.createElement('div');
          secondMarkerElement.innerHTML = '🛴';
          secondMarkerElement.style.fontSize = '18px';
          secondMarkerElement.style.backgroundColor = '#ef4444';
          secondMarkerElement.style.borderRadius = '50%';
          secondMarkerElement.style.padding = '6px';
          secondMarkerElement.style.border = '2px solid #dc2626';
          secondMarkerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

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
      });

      // Handle window resize to ensure map stays properly sized
      const handleResize = () => {
        if (map) {
          // Debounce resize calls to prevent excessive resizing
          clearTimeout((window as any).mapResizeTimeout);
          (window as any).mapResizeTimeout = setTimeout(() => {
            map.resize();
          }, 150);
        }
      };
      
      window.addEventListener('resize', handleResize);

      // Use ResizeObserver to handle container size changes robustly
      const resizeObserver = new ResizeObserver(() => {
        if (map) {
           map.resize();
        }
      });
      
      const container = document.getElementById('mapbox-container');
      if (container) {
        resizeObserver.observe(container);
      }

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (container) {
          resizeObserver.unobserve(container);
        }
        resizeObserver.disconnect();
        clearTimeout((window as any).mapResizeTimeout);
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

  const renderServiceCard = (service: (typeof services)[number]) => (
    <Link
      key={service.href}
      href={service.href}
      className="group flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
    >
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-blue-950 transition group-hover:bg-yellow-300">
        {service.icon}
      </span>
      <h3 className="text-xl font-black leading-tight text-slate-900 dark:text-white">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{service.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-900 transition-all group-hover:gap-2 dark:text-yellow-300">
        {t('common.seeMore')}
      </span>
    </Link>
  )

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f6f8] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
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
            <nav className="hidden md:flex space-x-4 lg:space-x-8">
              <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
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
                <button 
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-left text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp flex items-center space-x-2"
                  style={{ animationDelay: '0.6s' }}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="animate-typewriter" style={{ animationDelay: '0.6s' }}>Rent a Quad</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#04122b] py-24 md:py-36">
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
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#04122b]/85 via-[#04122b]/70 to-[#04122b]" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-200 backdrop-blur-md sm:text-xs">
            <Zap className="h-4 w-4" />
            Rent &amp; Tours · Torremolinos
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-2xl sm:text-6xl md:text-7xl">
            {t('hero.title')}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            {t('hero.subtitle')}
          </p>

          <div className="mx-auto mt-9 flex max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/alquiler" className="sm:flex-1">
              <Button className="h-14 w-full rounded-full bg-yellow-400 px-8 text-base font-bold text-blue-950 shadow-xl shadow-yellow-400/20 transition hover:-translate-y-0.5 hover:bg-yellow-300">
                {t('hero.viewRentals')}
              </Button>
            </Link>
            <Link href="/tours" className="sm:flex-1">
              <Button
                variant="outline"
                className="h-14 w-full rounded-full border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
              >
                {t('hero.bookTour')}
              </Button>
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, value: t('location.hours') },
              { icon: MapPin, value: t('location.address') },
              { icon: Phone, value: t('location.phone') },
              { icon: Mail, value: t('location.email'), isEmail: true },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-md transition hover:border-yellow-300/40 hover:bg-white/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-300">
                  <stat.icon className="h-4 w-4" />
                </span>
                {stat.isEmail ? (
                  <a
                    href={`mailto:${String(stat.value)}`}
                    className="max-w-full break-all text-sm font-semibold leading-snug text-white underline-offset-4 transition hover:text-yellow-300 hover:underline"
                    aria-label={`Enviar email a ${String(stat.value)}`}
                  >
                    {stat.value}
                  </a>
                ) : (
                  <p className="max-w-full break-words text-sm font-semibold leading-snug text-white">{stat.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Rental Section */}
      <QuickRentalSection />

      {/* Where We Are Section */}
      <section className="pb-16 pt-8">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <SectionHeading
              eyebrow={t('location.ourLocation')}
              title={t('location.title')}
              subtitle={
                <>
                  {t('location.description.before')}
                  <span className="mx-1 inline-flex items-center rounded-full bg-yellow-400 px-2.5 py-0.5 text-sm font-bold text-blue-950">
                    Torremolinos
                  </span>
                  {t('location.description.after')}
                </>
              }
            />
            
            {/* Imagen Banana World y Texto */}
            <div className="mt-12 flex flex-col lg:flex-row items-center gap-8">
              {/* Imagen a la izquierda en desktop */}
              <div className="lg:w-1/2">
                <Image 
                  src="/banana-world-hero.png" 
                  alt="Banana World" 
                  width={800} 
                  height={400} 
                  className="max-w-full h-auto"
                  priority
                />
              </div>
              
              {/* Texto a la derecha en desktop */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">
                   {t('location.discover')}
                 </h3>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                   {t('location.discoverDesc')}
                 </p>
              </div>
            </div>
          </div>
          
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm dark:border-white/10">
            <div id="mapbox-container" className="w-full h-full"></div>
            
            {/* Mobile activation notice */}
            {isMobile && !isMapActive && (
              <div className="absolute bottom-3 right-3 rounded-full bg-[#04122b]/90 px-3 py-1.5 text-white text-xs shadow-md z-10 pointer-events-none">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Location Info */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
                <h3 className="mb-6 flex items-center text-xl font-black text-slate-900 dark:text-white">
                  <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-300">
                    <MapPin className="h-5 w-5" />
                  </span>
                  {t('location.ourLocation')}
                </h3>
                <div className="space-y-3 text-slate-600 dark:text-slate-300">
                  <p className="flex items-start">
                    <span className="font-semibold text-slate-900 dark:text-white min-w-0 flex-1">
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
                    className="inline-flex h-12 items-center rounded-full bg-blue-900 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t('location.streetView')}
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
                <h3 className="mb-6 flex items-center text-xl font-black text-slate-900 dark:text-white">
                   <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-300">
                     <Phone className="h-5 w-5" />
                   </span>
                   {t('contact.title')}
                 </h3>
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-yellow-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{t('location.phone')}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t('location.hours')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-yellow-500 flex-shrink-0" />
                    <div>
                       <p className="font-semibold text-slate-900 dark:text-white">{t('location.email')}</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400">{t('contact.emailResponse')}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <SectionHeading title={t('services.title')} subtitle={t('services.subtitle')} />
          </div>

          {/* Desktop (md+) layout: keep existing structure and include Store card */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* First row: 2 cards */}
            {services.slice(0, 2).map(renderServiceCard)}

            {/* Second row: Repair Service (2 cols) */}
            <div className="lg:col-span-2">{renderServiceCard(services[4])}</div>

            {/* Second row: Car and Motos cards */}
            {services.slice(2, 4).map(renderServiceCard)}

            {/* Store Card (desktop only visible due to parent) */}
            <div className="lg:col-span-2">
              <Link
                href="/tienda?tab=store"
                className="group flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-blue-950 transition group-hover:bg-yellow-300">
                  <Store className="h-10 w-10" />
                </span>
                <h3 className="text-xl font-black leading-tight text-slate-900 dark:text-white">{t('services.store')}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t('services.storeDescription')}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-900 transition-all group-hover:gap-2 dark:text-yellow-300">
                  {t('common.seeMore')}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile (sm) layout: custom order without Store card */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {/* 1. Alquiler de Bicicletas (services[0]) */}
            {renderServiceCard(services[0])}

            {/* 2. Alquiler de Coches (services[2]) */}
            {renderServiceCard(services[2])}

            {/* 3. Motos y Scooters (services[3]) */}
            {renderServiceCard(services[3])}

            {/* 4. Visitas Guiadas (services[1]) */}
            {renderServiceCard(services[1])}

            {/* 5. Servicio Reparación (services[4]) */}
            {renderServiceCard(services[4])}
          </div>

        </div>
      </section>

      {/* Second Store Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="relative">
              <Image 
                src="/solhiress.jpeg" 
                alt="Segunda tienda Free Air Street" 
                width={600}
                height={400}
                className="h-[300px] w-full rounded-[2rem] border border-slate-200 object-cover shadow-sm dark:border-white/10 md:h-[420px]"
              />
            </div>
            
            {/* Content */}
            <div className="space-y-6">
              <SectionHeading
                align="left"
                title={
                  <>
                    {t('secondStore.title')}{" "}
                    <span className="text-yellow-500 dark:text-yellow-400">{t('secondStore.otherStore')}</span>{" "}
                    {t('secondStore.available')}
                  </>
                }
              />
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{t('secondStore.secondLocation')}</p>
                    <p className="text-slate-600 dark:text-slate-300">{t('secondStore.address')}</p>
                    <p className="text-slate-600 dark:text-slate-300">{t('secondStore.city')}</p>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('secondStore.description')}
                </p>
              </div>
              
              <a 
                href="https://maps.app.goo.gl/5KcHf2wMjwn9kMEFA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full bg-blue-900 px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
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
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <SectionHeading title={t('prices.title')} subtitle={t('prices.subtitle')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('prices.cityBike')}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('prices.cityBikeDesc')}</p>
              <div className="mt-5 flex-1 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('prices.hour')}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-lg font-black text-slate-900 dark:bg-white/10 dark:text-white">{getPrice('city-bike-1h', '4,50€')}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('prices.allDay')}</span>
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-xl font-black text-blue-950">{getPrice('city-bike-allday', '18€')}</span>
                </div>
              </div>
              <Link href="/alquiler?tab=bicicletas" className="mt-6 block">
                <Button className="h-12 w-full rounded-full bg-blue-900 text-sm font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300">
                  {t('rental.reserve') || 'Reservar'}
                </Button>
              </Link>
            </div>

            <div className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('prices.electricBike')}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('prices.electricBikeDesc')}</p>
              <div className="mt-5 flex-1 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('prices.hour')}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-lg font-black text-slate-900 dark:bg-white/10 dark:text-white">{getPrice('electric-bike-1h', '10€')}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('prices.allDay')}</span>
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-xl font-black text-blue-950">{getPrice('electric-bike-allday', '35€')}</span>
                </div>
              </div>
              <Link href="/alquiler?tab=bicicletas" className="mt-6 block">
                <Button className="h-12 w-full rounded-full bg-blue-900 text-sm font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300">
                  {t('rental.reserve') || 'Reservar'}
                </Button>
              </Link>
            </div>

            <div className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('prices.traditionalScooter')}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('prices.traditionalScooterDesc')}</p>
              <div className="mt-5 flex-1 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('prices.halfHour')}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-lg font-black text-slate-900 dark:bg-white/10 dark:text-white">{getPrice('scooter-30m', '10€')}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('prices.hour')}</span>
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-xl font-black text-blue-950">{getPrice('scooter-1h', '15€')}</span>
                </div>
              </div>
              <Link href="/alquiler?tab=scooters" className="mt-6 block">
                <Button className="h-12 w-full rounded-full bg-blue-900 text-sm font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300">
                  {t('rental.reserve') || 'Reservar'}
                </Button>
              </Link>
            </div>


          </div>
          
          {/* Scooter Promotion Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center overflow-hidden rounded-[2.5rem] bg-[#04122b] p-6 shadow-sm md:p-10">
              {/* Image */}
              <div className="relative flex items-center justify-center">
                <Image 
                  src="/patinetex.png" 
                  alt="Patinete eléctrico" 
                  width={400}
                  height={300}
                  className="h-auto w-full max-w-xs object-contain"
                />
              </div>
              
              {/* Content */}
              <div className="text-center lg:text-left space-y-5">
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  {t('scooterPromo.title')}
                </h3>
                <p className="text-base text-blue-100/85">
                  {t('scooterPromo.description')}
                </p>
                <Link href="/alquiler?tab=scooters">
                  <Button className="h-12 rounded-full bg-yellow-400 px-6 text-sm font-bold text-blue-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300">
                    {t('scooterPromo.button')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="tours-destacados" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <SectionHeading title={t('tours.title')} subtitle={t('tours.subtitle')} />
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
                   className="relative w-full h-auto overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm dark:border-white/10 mb-6"
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
               <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-5">
                 <div className="text-center mb-4">
                   <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{t('quadTours.title')}</h3>
                   <p className="text-sm text-slate-600 dark:text-slate-400">{t('quadTours.subtitle')}</p>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-2xl text-xs font-bold">
                   {/* Headers */}
                   <div className="bg-[#04122b] text-white p-2 text-center">{t('quadTours.hour')}</div>
                   <div className="bg-[#04122b] text-white p-2 text-center">{t('quadTours.tour')}</div>
                   <div className="bg-[#04122b] text-white p-2 text-center">{t('quadTours.price')}</div>
                   
                   {/* 1H Row */}
                      <div className="bg-yellow-400 text-black p-2 text-center flex items-center justify-center font-black text-lg">1H</div>
                      <div className="bg-yellow-400 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-lg mb-1">👤</div>
                        <div className="text-lg">👥</div>
                      </div>
                      <div className="bg-yellow-400 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-xs font-bold mb-1">{getPrice('quad-tour-1h-1', '75€')} {t('quadTours.perQuad')}</div>
                        <div className="text-xs font-bold">{getPrice('quad-tour-1h-2', '90€')} {t('quadTours.perQuad')}</div>
                      </div>
                      
                      {/* 2H Row */}
                      <div className="bg-orange-500 text-black p-2 text-center flex items-center justify-center font-black text-lg">2H</div>
                      <div className="bg-orange-500 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-lg mb-1">👤</div>
                        <div className="text-lg">👥</div>
                      </div>
                      <div className="bg-orange-500 text-black p-2 text-center flex flex-col justify-center">
                        <div className="text-xs font-bold mb-1">{getPrice('quad-tour-2h-1', '90€')} {t('quadTours.perQuad')}</div>
                        <div className="text-xs font-bold">{getPrice('quad-tour-2h-2', '120€')} {t('quadTours.perQuad')}</div>
                      </div>
                      
                      {/* 3H Row */}
                      <div className="bg-red-500 text-white p-2 text-center flex items-center justify-center font-black text-lg">3H</div>
                      <div className="bg-red-500 text-white p-2 text-center flex flex-col justify-center">
                        <div className="text-lg mb-1">👤</div>
                        <div className="text-lg">👥</div>
                      </div>
                      <div className="bg-red-500 text-white p-2 text-center flex flex-col justify-center">
                        <div className="text-xs font-bold mb-1">{getPrice('quad-tour-3h-1', '150€')} {t('quadTours.perQuad')}</div>
                        <div className="text-xs font-bold">{getPrice('quad-tour-3h-2', '170€')} {t('quadTours.perQuad')}</div>
                      </div>
                 </div>
                 
                 <div className="mt-3 text-center">
                    <div className="rounded-xl bg-blue-50 text-blue-900 p-2 text-xs font-semibold dark:bg-white/10 dark:text-blue-100">
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
                           className="h-11 rounded-full bg-yellow-400 px-4 text-sm font-bold text-blue-950 hover:bg-yellow-300"
                         >
                           Reservar Ahora
                         </Button>
                     </div>
                  </div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <div className="aspect-video relative">
                <Image
                  src="/lugares/dolphintrip.jpg"
                  alt="Dolphin Trip"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl backdrop-blur-sm">🐬</div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-base font-black text-blue-950 shadow">{getPrice('dolphin-trip', '18€')}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                    {t('tours.dolphinTrip')}
                  </h3>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-1">{t('tours.adults')}</p>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span>Marina Benalmádena</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t('tours.dolphinDesc')}
                </p>
                <ul className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                    {t('tours.children')}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                    {t('tours.familyExperience')}
                  </li>
                </ul>
              </div>
            </article>

            <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <div className="aspect-video relative">
                <Image
                  src="/destinos/alhambragranada.png"
                  alt="Granada Alhambra"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl backdrop-blur-sm">🏰</div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-base font-black text-blue-950 shadow">{getPrice('alhambra-granada', '79€')}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                  {t('tours.granadaAlhambra')}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span>{t('tours.thursdayFriday')}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t('tours.granadaDesc')}</p>
                <ul className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                    {t('tours.unescoHeritage')}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                    {t('tours.officialGuide')}
                  </li>
                </ul>
              </div>
            </article>

            <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <div className="aspect-video relative">
                <Image
                  src="/lugares/paseocaballo.jpeg"
                  alt="Paseos a Caballo"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl backdrop-blur-sm">🐎</div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-base font-black text-blue-950 shadow">{getPrice('paseo-caballo', '65€')}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                  {t('tours.horseRiding')}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span>{t('tours.duration')}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t('tours.horseDesc')}
                </p>
                <ul className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-400"></span>{t('tours.onePersonPerHorse')}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                    {t('tours.expertGuide')}
                  </li>
                </ul>
              </div>
            </article>
          </div>

          <div className="text-center mt-8">
            <Link href="/tours">
              <Button className="h-14 rounded-full bg-blue-900 px-10 text-base font-bold text-white shadow-lg hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300">
                {t('tours.viewAllTours')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-[2.5rem] bg-[#04122b] px-5 py-12 shadow-sm sm:px-8 md:px-12 md:py-16">
            <SectionHeading
              title={<span className="text-white">{t('contact.title')}</span>}
              subtitle={<span className="text-blue-100/80">{t('contact.subtitle')}</span>}
            />
            <div className="mt-8 flex justify-center">
              <a
                href="tel:655707412"
                className="inline-flex h-12 items-center rounded-full bg-yellow-400 px-6 text-sm font-bold text-blue-950 shadow-lg shadow-yellow-400/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('contact.callNow') || 'Llamar Ahora'}
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-300">
                  <Phone className="h-5 w-5" />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-blue-200/70">{t('contact.phone')}</h3>
                <a href="tel:655707412" className="mt-1 block text-lg font-black text-white transition hover:text-yellow-300">655 707 412</a>
                <p className="mt-1 text-xs text-blue-100/60">{t('contact.phoneHours')}</p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-300">
                  <Mail className="h-5 w-5" />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-blue-200/70">{t('contact.email')}</h3>
                <p className="mt-1 text-lg font-black text-white">rentairstreet@gmail.com</p>
                <p className="mt-1 text-xs text-blue-100/60">{t('contact.emailResponse')}</p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-blue-200/70">{t('contact.location')}</h3>
                <p className="mt-1 text-lg font-black text-white">{t('location.address')}</p>
                <p className="mt-1 text-xs text-blue-100/60">{t('location.city')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter
        tagline="Rent & Tours · Torremolinos"
        rights={t('footer.rights')}
        contactLabel={t('contact.title')}
      />

      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 pb-8 text-black">
        <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 text-center text-xs text-gray-700 sm:flex-row">
          <span>Web made by:</span>
          <a 
            href="https://carlosfr.es" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-400"
          >
            Carlosfr.es
          </a>
          <button
            id="admin-dashboard-trigger"
            className="ml-2 text-gray-500 transition-colors hover:text-gray-700"
            title="Admin"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </button>
        </div>
      </div>

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
                {t('tours.reserveActivity') || 'Acceder a Quad Aventura'}
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
