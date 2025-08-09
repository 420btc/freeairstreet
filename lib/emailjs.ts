import emailjs from '@emailjs/browser'

// Configuración de EmailJS
const EMAILJS_SERVICE_ID = 'service_dm2yr47'
const EMAILJS_TEMPLATE_CLIENT = 'template_3towopy' // Template para el cliente
const EMAILJS_TEMPLATE_ADMIN = 'template_uamywnq' // Template para rentairstreet@gmail.com
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

// Inicializar EmailJS
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY)
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject?: string
  message: string
}

export interface ReservationFormData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  duration?: string
  participants: string
  pickupLocation?: string
  comments: string
  itemName?: string
  itemPrice?: string
  type: 'rental' | 'tour'
}

export interface AdvertisingFormData {
  businessName: string
  contactPerson: string
  email: string
  phone: string
  advertisingType: string
  message: string
}

// Función para enviar formulario de contacto
export const sendContactEmail = async (formData: ContactFormData) => {
  // Validar configuración antes de enviar
  if (!EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS Public Key no está configurada. Verifica tu archivo .env.local')
  }

  try {
    // Enviar email al administrador
    const adminResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ADMIN,
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'Consulta desde la web',
        message: formData.message,
        to_email: 'rentairstreet@gmail.com',
        form_type: 'Contacto'
      },
      EMAILJS_PUBLIC_KEY
    )

    // Enviar email de confirmación al cliente
    const clientResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_CLIENT,
      {
        to_name: formData.name,
        to_email: formData.email,
        subject: 'Confirmación de contacto - Free Air Street',
        message: `Hola ${formData.name},\n\nHemos recibido tu mensaje y te responderemos en las próximas 24 horas.\n\nGracias por contactarnos.\n\nSaludos,\nEquipo Free Air Street`
      },
      EMAILJS_PUBLIC_KEY
    )

    return { success: true, adminResponse, clientResponse }
  } catch (error) {
    console.error('Error sending contact email:', error)
    
    // Proporcionar más información sobre el error
    let errorMessage = 'Error desconocido'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details: error 
    }
  }
}

// Función para enviar formulario de reserva
export const sendReservationEmail = async (formData: ReservationFormData) => {
  // Validar configuración antes de enviar
  if (!EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS Public Key no está configurada. Verifica tu archivo .env.local')
  }

  try {
    const isRental = formData.type === 'rental'
    const serviceType = isRental ? 'Alquiler' : 'Tour/Excursión'
    
    // Preparar datos para el email del administrador
    const adminEmailData = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      service_type: serviceType,
      item_name: formData.itemName || 'No especificado',
      item_price: formData.itemPrice || 'No especificado',
      date: formData.date,
      time: formData.time,
      duration: formData.duration || 'No especificado',
      participants: formData.participants,
      pickup_location: formData.pickupLocation || 'No especificado',
      comments: formData.comments || 'Sin comentarios adicionales',
      to_email: 'rentairstreet@gmail.com',
      form_type: 'Reserva'
    }

    // Enviar email al administrador
    const adminResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ADMIN,
      adminEmailData,
      EMAILJS_PUBLIC_KEY
    )

    // Preparar mensaje de confirmación para el cliente
    const confirmationMessage = `Hola ${formData.name},\n\nHemos recibido tu solicitud de ${serviceType.toLowerCase()}:\n\n` +
      `• Servicio: ${formData.itemName}\n` +
      `• Fecha: ${formData.date}\n` +
      `• Hora: ${formData.time}\n` +
      `• Participantes: ${formData.participants}\n` +
      (formData.pickupLocation ? `• Lugar de recogida: ${formData.pickupLocation}\n` : '') +
      `\nTe contactaremos pronto para confirmar los detalles.\n\nGracias por elegirnos.\n\nSaludos,\nEquipo Free Air Street`

    // Enviar email de confirmación al cliente
    const clientResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_CLIENT,
      {
        to_name: formData.name,
        to_email: formData.email,
        subject: `Confirmación de ${serviceType} - Free Air Street`,
        message: confirmationMessage
      },
      EMAILJS_PUBLIC_KEY
    )

    return { success: true, adminResponse, clientResponse }
  } catch (error) {
    console.error('Error sending reservation email:', error)
    
    // Proporcionar más información sobre el error
    let errorMessage = 'Error desconocido'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details: error 
    }
  }
}

// Función para enviar formulario de publicidad
export const sendAdvertisingEmail = async (formData: AdvertisingFormData) => {
  // Validar configuración antes de enviar
  if (!EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS Public Key no está configurada. Verifica tu archivo .env.local')
  }

  try {
    // Enviar email al administrador
    const adminResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ADMIN,
      {
        from_name: formData.contactPerson,
        from_email: formData.email,
        phone: formData.phone || 'No proporcionado',
        subject: `Solicitud de Publicidad - ${formData.businessName}`,
        message: `Negocio: ${formData.businessName}\nContacto: ${formData.contactPerson}\nTipo de publicidad: ${formData.advertisingType}\nMensaje: ${formData.message}`,
        to_email: 'rentairstreet@gmail.com',
        form_type: 'Solicitud de Publicidad'
      },
      EMAILJS_PUBLIC_KEY
    )

    // Enviar email de confirmación al cliente
    const clientResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_CLIENT,
      {
        to_name: formData.contactPerson,
        to_email: formData.email,
        subject: 'Confirmación de solicitud de publicidad - Free Air Street',
        message: `Hola ${formData.contactPerson},\n\nHemos recibido tu solicitud de publicidad para ${formData.businessName}.\n\nTe contactaremos pronto para discutir las opciones disponibles.\n\nGracias por tu interés.\n\nSaludos,\nEquipo Free Air Street`
      },
      EMAILJS_PUBLIC_KEY
    )

    return { success: true, adminResponse, clientResponse }
  } catch (error) {
    console.error('Error sending advertising email:', error)
    
    // Proporcionar más información sobre el error
    let errorMessage = 'Error desconocido'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details: error 
    }
  }
}

// Función para validar la configuración de EmailJS
export const validateEmailJSConfig = () => {
  if (!EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS Public Key not found. Please add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to your environment variables.')
    return false
  }
  return true
}