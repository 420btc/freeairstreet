# Configuración de EmailJS

## 1. Configuración de Variables de Entorno

1. Ve a [EmailJS](https://www.emailjs.com/)
2. Inicia sesión en tu cuenta
3. Ve a "Account" > "API Keys"
4. Copia tu Public Key
5. En el archivo `.env.local`, reemplaza `your_emailjs_public_key_here` con tu clave real

## 2. Configuración de Templates

Ya tienes configurados los siguientes IDs:
- **Service ID**: `service_dm2yr47`
- **Template Cliente**: `template_3towopy`
- **Template Administrador**: `template_uamywnq`

### Template para Cliente (`template_3towopy`)

Este template se envía al cliente como confirmación. Variables disponibles:

```
{{to_name}} - Nombre del cliente
{{to_email}} - Email del cliente
{{subject}} - Asunto del email
{{message}} - Mensaje de confirmación personalizado
```

**Ejemplo de contenido sugerido:**
```
Hola {{to_name}},

{{message}}

Saludos,
Equipo Free Air Street
Tel: 655 707 412
Email: info@freeairstreet-rentbike.com
Ubicación: Calle de la Playa, 22 - 29620 Torremolinos
```

### Template para Administrador (`template_uamywnq`)

Este template se envía a `rentairstreet@gmail.com` con los datos del formulario. Variables disponibles:

#### Para Formulario de Contacto:
```
{{from_name}} - Nombre del cliente
{{from_email}} - Email del cliente
{{phone}} - Teléfono del cliente
{{subject}} - Asunto del mensaje
{{message}} - Mensaje del cliente
{{form_type}} - Tipo de formulario ("Contacto")
```

#### Para Formulario de Reserva:
```
{{from_name}} - Nombre del cliente
{{from_email}} - Email del cliente
{{phone}} - Teléfono del cliente
{{service_type}} - Tipo de servicio ("Alquiler" o "Tour/Excursión")
{{item_name}} - Nombre del producto/servicio
{{item_price}} - Precio del producto/servicio
{{date}} - Fecha de la reserva
{{time}} - Hora de la reserva
{{duration}} - Duración del servicio
{{participants}} - Número de participantes
{{pickup_location}} - Lugar de recogida
{{comments}} - Comentarios adicionales
{{form_type}} - Tipo de formulario ("Reserva")
```

**Ejemplo de contenido sugerido para el template de administrador:**
```
Nuevo {{form_type}} desde la web

--- DATOS DEL CLIENTE ---
Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}

{{#service_type}}
--- DETALLES DE LA RESERVA ---
Tipo de Servicio: {{service_type}}
Producto/Servicio: {{item_name}}
Precio: {{item_price}}
Fecha: {{date}}
Hora: {{time}}
Duración: {{duration}}
Participantes: {{participants}}
Lugar de Recogida: {{pickup_location}}
Comentarios: {{comments}}
{{/service_type}}

{{#subject}}
--- CONSULTA ---
Asunto: {{subject}}
Mensaje: {{message}}
{{/subject}}

--- SERVICIOS DISPONIBLES ---

🚲 ALQUILERES:
• Bicicletas eléctricas
• Patinetes eléctricos
• Bicicletas tradicionales
• Accesorios y equipamiento

🗺️ TOURS Y EXCURSIONES:
• Tour por el centro histórico
• Ruta costera en bicicleta
• Excursión a pueblos cercanos
• Tours personalizados

🛍️ TIENDA:
• Venta de bicicletas
• Accesorios y repuestos
• Equipamiento deportivo
• Productos de mantenimiento

📞 CONTACTO:
• Teléfono: 655 707 412
• Email: info@freeairstreet-rentbike.com
• Ubicación: Calle de la Playa, 22 - 29620 Torremolinos
• Horario: Lunes a Domingo 9:00-22:00, Festivos 10:00-19:00
```

## 3. Configuración en EmailJS Dashboard

### IMPORTANTE: Configuración de Direcciones de Email

**Para el Template de Administrador (`template_uamywnq`):**
1. Ve a tu dashboard de EmailJS
2. Selecciona tu servicio (`service_dm2yr47`)
3. Edita el template `template_uamywnq`
4. **CRÍTICO**: En la configuración del template, establece:
   - **To Email**: `rentairstreet@gmail.com` (dirección fija)
   - **From Email**: `{{from_email}}` (email del cliente)
   - **From Name**: `{{from_name}}` (nombre del cliente)
5. Copia el contenido sugerido arriba en el cuerpo del email

**Para el Template de Cliente (`template_3towopy`):**
1. Edita el template `template_3towopy`
2. **CRÍTICO**: En la configuración del template, establece:
   - **To Email**: `{{to_email}}` (email del cliente)
   - **From Email**: `rentairstreet@gmail.com` (tu dirección)
   - **From Name**: `Free Air Street`
3. Copia el contenido sugerido arriba en el cuerpo del email

### Pasos Detallados:
1. Ve a tu dashboard de EmailJS
2. Selecciona tu servicio (`service_dm2yr47`)
3. Para cada template, haz clic en "Edit"
4. En la pestaña "Settings", configura las direcciones como se indica arriba
5. En la pestaña "Content", pega el contenido sugerido
6. Guarda los cambios
7. Prueba los templates enviando emails de prueba

## 4. Funcionalidades Implementadas

### Formulario de Contacto (`/contacto`)
- Envía email al administrador con los datos del formulario
- Envía email de confirmación al cliente
- Manejo de errores y estados de carga
- Validación de campos requeridos

### Modal de Reservas (Alquileres y Tours)
- Envía email al administrador con todos los detalles de la reserva
- Envía email de confirmación personalizado al cliente
- Diferencia entre alquileres y tours
- Incluye información del producto/servicio seleccionado
- Manejo de errores y estados de carga

## 5. Próximos Pasos

1. Configurar tu Public Key en `.env.local`
2. Personalizar los templates en EmailJS con el contenido sugerido
3. Probar los formularios en desarrollo
4. Ajustar los templates según tus necesidades específicas