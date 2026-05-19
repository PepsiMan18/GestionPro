# 📁 Guía de Arquitectura del Proyecto (GestiónPro)

Esta guía documenta de forma clara y directa cómo está estructurado el código de nuestro sistema. El proyecto está construido bajo la arquitectura de React como una SPA (Single Page Application).

---

## 📂 1. Módulos y Páginas (`src/pages`)
En esta carpeta se encuentran las pantallas principales de la aplicación. Cada archivo representa un módulo completo al que el usuario accede mediante el menú lateral de navegación.

*   **`PanelControl.jsx` (Dashboard):** Es la pantalla inicial. Su responsabilidad principal es calcular y mostrar las métricas resumidas (Total de inmuebles, Ocupados, Disponibles) leyendo el estado global.
*   **`Inmuebles.jsx`:** El módulo de Gestión de Propiedades. Renderiza la tabla general y controla la apertura del formulario (`ModalInmueble`) para crear o editar registros.
*   **`Inquilinos.jsx`:** El módulo de Directorio de Clientes. Renderiza la lista de inquilinos (`TablaInquilinos`) y gestiona el registro mediante su propio formulario (`ModalInquilino`).
*   **`Contratos.jsx`:** El módulo central que une un "Inmueble" con un "Inquilino". Controla las fechas de vencimiento, gestiona renovaciones y finalizaciones de alquiler.
*   **`Facturacion.jsx`, `Servicios.jsx`, `Reportes.jsx`, `Configuracion.jsx`:** Módulos que servirán para la gestión financiera, reportes de morosidad y catálogos paramétricos del sistema.

---

## 🧩 2. Componentes Reutilizables (`src/components`)
Esta carpeta contiene fragmentos de interfaz (UI) aislados. Al separar estas piezas, mantenemos el código de las páginas limpio y evitamos repetir código.

*   **Estructura Base:**
    *   `Sidebar.jsx`: Contiene la navegación principal usando el componente `NavLink` de React Router.
    *   `Header.jsx`: La barra superior de la interfaz, que muestra información del perfil logueado.
*   **Tablas de Datos (`Tabla... .jsx`):**
    *   `TablaInmuebles.jsx`, `TablaInquilinos.jsx`, `TablaContratos.jsx`: Se encargan exclusivamente de iterar sobre arrays de datos y mostrarlas en formato tabular. No manejan lógica de guardado, solo renderizado visual y cálculo de estados de presentación (como colores de badges).
*   **Formularios / Modales (`Modal... .jsx`):**
    *   `ModalInmueble.jsx`, `ModalInquilino.jsx`, `ModalContrato.jsx`: Son ventanas emergentes que agrupan toda la lógica de los formularios. Reciben la función `alGuardar` por Props desde su página contenedora y devuelven el objeto con los datos procesados.

---

## ⚙️ 3. El Archivo Principal (`src/App.jsx`)
Es el corazón técnico del proyecto. Funciona como el orquestador principal:

1.  **Estado Global Centralizado:** Aquí viven temporalmente las listas maestras (`listaInmuebles`, `listaInquilinos`, `listaContratos`) mediante el hook `useState`. Al estar definidas aquí arriba en el árbol de componentes, pueden ser inyectadas como Props a cualquier módulo que las necesite.
2.  **Enrutamiento (Routing):** Define qué componente de la carpeta `pages` se debe montar en el DOM dependiendo de la URL activa (ej. la ruta `/contratos` renderiza el componente `<Contratos />`).
3.  **Layout General:** Mantiene el `Sidebar` y el `Header` siempre estáticos en pantalla, cambiando únicamente el área de contenido dinámico.

---

## 🎨 4. Estilos y Sistema de Diseño (`.css`)
El proyecto no utiliza frameworks de CSS (como Tailwind o Bootstrap); todo el sistema de diseño está construido de cero de manera escalable usando CSS moderno.

*   **`index.css`:** Contiene las "CSS Variables" globales. Si se requiere cambiar un color corporativo primario, el radio de los bordes o la familia tipográfica, se modifica en un solo lugar dentro de la etiqueta `:root`.
*   **`App.css`:** Define la estructura base mediante CSS Grid y Flexbox, encargándose del layout (el tamaño del menú lateral vs el contenido central).
*   **Estilos Locales:** Archivos como `PanelControl.css` o `ModalInmueble.css` contienen reglas específicas que solo afectan a sus respectivos componentes, previniendo conflictos de nombres de clases.
