# 🏢 Proyecto: GestiónPro (Sistema de Gestión Inmobiliaria)

¡Bienvenido al proyecto! Este es un sistema de administración moderno de nivel empresarial construido con **React** y **Vite**. Está diseñado para gestionar un catálogo de inmuebles (locales comerciales, tiendas, oficinas), la cartera de clientes (inquilinos) y el ciclo de vida de los contratos de alquiler.

## 🚀 Cómo ejecutar este proyecto

Si acabas de clonar este repositorio, sigue estos pasos exactos:

### Requisitos Previos
Debes tener instalado **Node.js** (Versión 18+ recomendada). Descárgalo de [nodejs.org](https://nodejs.org/).

### Pasos de Instalación

1. **Abre la terminal** y asegúrate de estar dentro de la carpeta raíz del proyecto (la carpeta que contiene el archivo `package.json`).
   ```bash
   cd Proyecto1
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo local**:
   ```bash
   npm run dev
   ```

4. **Abre el proyecto en el navegador**:
   El terminal te mostrará un enlace (usualmente `http://localhost:5173/`).

---

## 📦 Módulos Implementados

El sistema está dividido en los siguientes submódulos funcionales:

*   📊 **Dashboard**: Métricas en tiempo real sobre la ocupación del portafolio.
*   🏢 **Inmuebles (HU-001)**: Mantenimiento del catálogo de propiedades, tipos de local y control de estados (Disponible, Ocupado, Mantenimiento).
*   👥 **Inquilinos (HU-002)**: Directorio de clientes con clasificación para Personas Naturales y Jurídicas, junto a su historial de contacto.
*   📝 **Contratos (HU-05 a HU-09)**: Motor lógico que vincula inmuebles con inquilinos. Permite la generación, cálculo dinámico de vigencia, renovaciones y finalización de contratos.

---

## 🏗️ Stack Tecnológico

*   **Frontend**: React 18
*   **Build Tool**: Vite
*   **Enrutamiento**: React Router DOM v6
*   **UI/UX**: Custom Vanilla CSS (Sistema escalable por CSS Variables) y Phosphor Icons.
*   **Arquitectura**: Single Page Application (SPA) modularizada.
