# 🎫 NFT Ticketing System - Frontend

Una aplicación descentralizada (DApp) moderna para la gestión de tickets de eventos como NFTs en la blockchain de Ethereum. Este frontend permite a los usuarios descubrir eventos, comprar tickets como NFTs únicos, y gestionar su colección de entradas digitales.

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)

## ✨ Características Principales

- **🎨 Interfaz Moderna**: Diseño responsivo y elegante con Tailwind CSS
- **🔗 Integración Blockchain**: Conexión completa con contratos inteligentes usando Ethers.js
- **🎫 Gestión de Tickets NFT**: Compra, visualización y transferencia de tickets como NFTs
- **📱 Códigos QR**: Generación y escaneo de QR para validación de tickets
- **👛 Conexión de Billetera**: Soporte completo para MetaMask y otras billeteras Web3
- **🔒 Sistema de Whitelist**: Funcionalidades especiales para creadores autorizados
- **⚡ Optimizado**: Server-Side Rendering con Next.js para máximo rendimiento

## 🚀 Demo en Vivo

[Video Demostración](https://www.youtube.com/watch?v=l9D-t03Eo5o)

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # App Router de Next.js 13+
│   ├── event/[id]/        # Páginas de detalle de eventos
│   ├── my-tickets/        # Gestión de tickets del usuario
│   ├── create-event/      # Creación de nuevos eventos
│   ├── scan/              # Escáner de códigos QR
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── EventList.tsx      # Lista de eventos disponibles
│   ├── EventDetail.tsx    # Detalles y compra de tickets
│   ├── Ticket.tsx         # Visualización de tickets NFT
│   └── ...
├── lib/                   # Configuraciones y utilidades
│   ├── contracts.ts       # Configuración de contratos
│   └── utils.ts           # Funciones auxiliares
└── types/                 # Definiciones de TypeScript
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.4.5 (App Router)
- **UI Library**: React 19.1.0
- **Lenguaje**: TypeScript 5.x
- **Estilos**: Tailwind CSS 4.x
- **Blockchain**: Ethers.js 6.15.0
- **QR Codes**: qrcode.react 4.2.0
- **Linting**: ESLint con configuración Next.js

## 📋 Requisitos Previos

- Node.js v18.x o superior
- npm o yarn
- MetaMask u otra billetera Web3
- Conexión a red Ethereum (testnet recomendada para desarrollo)

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Tiago0507/dapp-tickets-frontend.git
cd dapp-tickets-frontend
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración de la red blockchain
NEXT_PUBLIC_ETHEREUM_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/tu-api-key

# Direcciones de contratos (actualizar después del despliegue)
NEXT_PUBLIC_EVENT_MANAGER_ADDRESS=0x...
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Construcción para Producción

```bash
npm run build
npm start
# o
yarn build
yarn start
```

## 🔧 Configuración de Contratos

Para conectar con tus contratos desplegados, actualiza las direcciones en `src/lib/contracts.ts`:

```typescript
// Direcciones de contratos desplegados
export const CONTRACT_ADDRESSES = {
  EVENT_MANAGER: process.env.NEXT_PUBLIC_EVENT_MANAGER_ADDRESS,
  // Agregar otras direcciones según sea necesario
};
```

## 🎯 Funcionalidades por Rol

### 👥 Usuarios Generales
- Explorar eventos disponibles
- Conectar billetera Web3
- Comprar tickets como NFTs
- Ver colección personal de tickets
- Transferir tickets a otras direcciones
- Generar códigos QR para tickets

### 🏛️ Creadores Autorizados (Whitelist)
- Todas las funcionalidades de usuarios generales
- Crear nuevos eventos
- Configurar parámetros de tickets (precio, cantidad)
- Escanear códigos QR para validar entradas
- Redimir tickets en eventos

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Seguir las convenciones de TypeScript y ESLint
- Escribir componentes reutilizables y documentados
- Mantener responsividad en todos los dispositivos
- Probar en múltiples billeteras Web3

## 🔗 Enlaces Relacionados

- [Smart Contracts Backend](https://github.com/Juanmadiaz45/dapp-tickets-backend)
- [Documentación de la API](./docs/api.md)
- [Guía de Despliegue](./docs/deployment.md)

## 👥 Equipo

* [Esteban Gaviria Zambrano](https://github.com/EstebanGZam) - A00396019
* Juan Manuel Díaz Moreno - A00394477
* Santiago Valencia García - A00395902 

---

**¿Te gusta este proyecto?** ⭐ ¡Dale una estrella en GitHub!