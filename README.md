# P2P File Transfer Dashboard

Aplicación web construida con **Next.js 15**, **TypeScript**, **Tailwind CSS** y **WebRTC** para enviar archivos directamente entre navegadores usando un servidor de señalización con **Socket.IO**.  
Los archivos nunca se almacenan en el servidor; solo se usa para intercambiar la señalización necesaria para crear el canal P2P.[web:330][web:331][web:333]

---

## Características

- Interfaz tipo dashboard con sidebar, métricas y tarjetas de estado.
- Transferencia de archivos punto a punto mediante WebRTC DataChannels.[web:332][web:341]
- Servidor de señalización separado (Node.js + Socket.IO).
- Indicadores de progreso de envío y recepción.
- Historial de archivos recibidos en la sesión actual.
- Registro de eventos en tiempo real (conexiones, ofertas, respuestas, progreso, etc.).
- Fuente principal **Poppins** y diseño responsive.

---

## Requisitos

- Node.js 18 o superior.
- npm o pnpm.
- Servidor de señalización WebRTC desplegado (por ejemplo en Render) con Socket.IO.

---

## Instalación

Clonar el repositorio
git clone https://github.com/GoatCrazy9/p2pfile.git
cd p2pfile

Instalar dependencias
npm install


Configura la URL del servidor de señalización en tu hook `useP2PFileTransfer`:



