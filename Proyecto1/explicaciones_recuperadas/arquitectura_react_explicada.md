# 📘 Guía de Arquitectura del Proyecto React

¡Qué excelente iniciativa! La mejor forma de aprender React es entendiendo exactamente cómo encajan las piezas en un proyecto real. React se basa en un concepto de **"Componentes"** (como piezas de Lego) que se unen para formar vistas más grandes.

Aquí tienes la explicación detallada de cada archivo y carpeta que hemos creado en tu proyecto.

---

## 1. El Arranque de la Aplicación

Estos archivos son el motor de tu aplicación, los primeros que se ejecutan cuando abres la página.

*   📄 **`index.html`** *(Raíz del proyecto)*
    Es el archivo HTML tradicional. Si lo abres, verás que está casi vacío, pero tiene un `<div id="root"></div>`. React usa este *div* vacío como un "lienzo" donde dibuja toda la aplicación. Aquí también pusimos las fuentes (Inter) y los iconos (Phosphor).
*   📄 **`src/main.jsx`**
    Es el punto de entrada de React. Toma el `<App />` (tu aplicación completa) y lo "inyecta" dentro del `<div id="root"></div>` del HTML. Además, envuelve toda la app en un `<BrowserRouter>`, lo cual le da el "superpoder" de tener URLs y navegación sin recargar la página.
*   📄 **`src/App.jsx`**
    Es el **corazón de tu aplicación**. 
    1. Define el esqueleto (Layout) de la página: Pone el `Sidebar` a la izquierda, el `Header` arriba y deja un hueco en el centro (`<main>`).
    2. En ese hueco central, usa `<Routes>` para decir: *"Si el usuario está en `/`, muestra el Dashboard. Si está en `/inmuebles`, muestra Properties"*.
    3. Guarda la **Base de Datos local (Estado Global)** usando `useState(initialProperties)`. Así la lista de inmuebles vive aquí y se la pasa a las demás pantallas.

---

## 2. La Carpeta `components/` (Las Piezas de Lego)

Un componente en React es un archivo que devuelve un pedazo de Interfaz de Usuario (HTML) combinado con lógica (JavaScript). Esta carpeta guarda las piezas que son **reutilizables**.

*   🧩 **`Header.jsx`**
    La barra superior. Contiene la barra de búsqueda visual y el perfil del usuario (Carlos G.). Por ahora es visual, pero más adelante aquí agregarías la lógica de cerrar sesión.
*   🧩 **`Sidebar.jsx`**
    La barra lateral de navegación izquierda. Usa un componente especial llamado `<NavLink>` de React Router. Su función es que, cuando haces clic, cambia la URL (ej. a `/inmuebles`) sin recargar la página web, pintando de azul el botón activo.
*   🧩 **`SummaryCard.jsx`**
    ¿Recuerdas las tarjetas del Dashboard (Total, Ocupados, Desocupados)? Este es un componente dinámico. No creamos 4 archivos distintos para las 4 tarjetas, sino que creamos **uno solo** que recibe "propiedades" (*props*: título, valor, ícono, color) y se dibuja a sí mismo según lo que le pases.
*   🧩 **`PropertyTable.jsx`**
    La tabla que lista los inmuebles. Recibe la lista de propiedades y usa la función `.map()` de JavaScript para dibujar una fila (`<tr>`) por cada inmueble que exista. También tiene el botón de "Gestionar".
*   🧩 **`PropertyFormModal.jsx`**
    La ventana emergente para crear o editar un inmueble. Este archivo es muy inteligente: tiene su propio estado (memoria) para ir guardando lo que escribes en los *inputs*. Si le pasas datos (`propertyData`), sabe que tiene que rellenar los campos para "Editar". Si no le pasas nada, se pone en blanco para "Crear".

---

## 3. La Carpeta `pages/` (Las Pantallas)

A diferencia de los componentes, las "páginas" o "vistas" son archivos que **agrupan varias piezas de Lego** para construir una pantalla completa.

*   🖥️ **`Dashboard.jsx`**
    La página de inicio. Importa cuatro `SummaryCard` y los alimenta con cálculos matemáticos. Revisa la lista de inmuebles y cuenta cuántos dicen "Ocupado" o "Desocupado" para mostrar los totales.
*   🖥️ **`Properties.jsx` (Mis Inmuebles)**
    Esta página es el puente de mando de los inmuebles. 
    1. Importa la `PropertyTable` para mostrar la lista.
    2. Importa el `PropertyFormModal` y lo mantiene oculto hasta que haces clic en "Agregar" o "Gestionar".
    3. Contiene la lógica matemática `handleSaveProperty` que le avisa a `App.jsx` que debe guardar un inmueble nuevo o modificar uno existente.
*   🖥️ **`Tenants.jsx`, `Services.jsx`, `Billing.jsx`, `Reports.jsx`**
    Son las otras pantallas a las que accedes desde el menú lateral. Por ahora son maquetas (diseños visuales) preparadas para cuando quieras inyectarles lógica de verdad.

---

## 4. Los Estilos (`.css`)

Hemos usado CSS tradicional y puro (Vanilla CSS), pero organizado de manera moderna:

*   🎨 **`index.css`**
    Es el sistema de diseño. Aquí definimos `:root` con variables (ej. `--primary: #4f46e5`). Si un día quieres que tu app en lugar de azul sea morada, cambias el color aquí y toda la app cambia mágicamente porque todo el proyecto lee estas variables.
*   🎨 **`App.css`**
    Define la maquetación gigante: Le da el ancho exacto al `Sidebar`, le dice al `Header` que se quede pegado arriba (*sticky*), y le da al contenido central la capacidad de tener una barra de desplazamiento (*scroll*).
*   🎨 **`Dashboard.css` / `PropertyFormModal.css`**
    Tienen los estilos específicos (botones, animaciones de la ventana emergente, diseño de la tabla) para que esos componentes se vean espectaculares.
