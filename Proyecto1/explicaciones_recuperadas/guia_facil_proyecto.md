# 🏠 Guía Fácil del Proyecto: Explicado con Manzanas

Entendido hermano. Olvidémonos de términos técnicos complicados de programadores. Vamos a imaginar que construir esta página web es exactamente igual que **construir y decorar una casa**.

En React (el lenguaje que usamos), en lugar de construir toda la casa junta, construimos **bloques separados** y luego los armamos.

---

### 🧩 1. Las Piezas y los Muebles (Carpeta `components`)
Imagina que la carpeta `components` (componentes) es una tienda de muebles. Aquí fabricamos piezas pequeñas que podemos poner en cualquier habitación de la casa.

*   👉 **`Header.jsx` (La barra de arriba):**
    Es el "techo" decorativo. Si entras a este archivo, verás que es solo texto. Si quieres que en lugar de "Carlos G." diga tu nombre real, abres este archivo, buscas "Carlos G." y lo cambias. Así de simple.
*   👉 **`Sidebar.jsx` (El menú izquierdo):**
    Es el pasillo con las puertas a las otras habitaciones. Aquí están los enlaces. Si quieres cambiar el texto que dice "Reportes" por "Mis Gráficos", entras aquí, borras la palabra y escribes la nueva.
*   👉 **`TarjetaResumen.jsx`:**
    Son las cajitas blancas con números que ves en la pantalla de inicio. Es una "plantilla" de caja.
*   👉 **`TablaInmuebles.jsx`:**
    Como su nombre indica, es solo la estructura de la tabla. Sus columnas son "Dirección", "Tipo", "Estado". Si un día quieres que la columna "Alquiler Mensual" se llame "Costo Mes", abres este archivo y cambias el texto.
*   👉 **`ModalInmueble.jsx` (La ventana flotante):**
    Es la ventana que aparece de la nada cuando haces clic en "Agregar". Si el día de mañana necesitas preguntar por el "Número de Baños", tendrás que entrar a este archivo y agregar una cajita de texto ahí.

---

### 🛏️ 2. Las Habitaciones Completas (Carpeta `pages`)
Si los `components` eran los muebles, la carpeta `pages` (páginas) son las **Habitaciones completas**. Aquí metemos los muebles para que el cuarto tenga sentido.

*   👉 **`PanelControl.jsx` (El Inicio):**
    Es la sala de estar de tu casa. Aquí trajimos 4 muebles de tipo `TarjetaResumen` para mostrar los totales.
*   👉 **`Inmuebles.jsx`:**
    Es la oficina. Esta pantalla es importante porque junta varias cosas: Trajimos el botón de "Agregar", trajimos el mueble de la `TablaInmuebles` y también ocultamos aquí el `ModalInmueble` para que solo salga cuando aprietes el botón.
*   👉 **`Inquilinos.jsx`, `Facturacion.jsx`, `Reportes.jsx`:**
    Son otras habitaciones de la casa (el comedor, el baño). Por ahora están vacías o con muebles de plástico, esperando a que las decoremos en el futuro.

---

### 🗺️ 3. El Plano de la Casa (El Archivo `App.jsx`)
Este archivo es **El Jefe**. Es el mapa principal de la casa.

Si abres **`App.jsx`**, verás que hace dos cosas fundamentales:
1. **Pone el orden:** Dice "El menú (`Sidebar`) va a la izquierda. La barra de arriba (`Header`) va arriba. Y en el medio, pon las Habitaciones".
2. **Controla las puertas (`Routes`):** Aquí están las "Rutas". Básicamente son reglas que dicen: *"Si el usuario hace clic en Inquilinos, ábrele la puerta de la habitación `Inquilinos.jsx`"*.
3. **La Memoria Principal:** Fíjate que al inicio de este archivo hay una lista escrita a mano de los 3 inmuebles de prueba. Todo está guardado aquí. Este archivo le "presta" esa lista a las demás habitaciones para que la puedan leer.

---

### 🎨 4. La Pintura (Los Archivos `.css`)
CSS es maquillaje puro. No tiene lógica ni inteligencia, solo colores y tamaños.

*   👉 **`index.css`:**
    Es tu paleta de colores. Si te aburres del color azul de los botones y lo quieres rojo, abres este archivo, buscas la palabra `--primary: #4f46e5;` y cambias ese código por el de un rojo. Toda tu aplicación cambiará mágicamente.
*   👉 **`App.css` y `PanelControl.css`:**
    Son reglas de tamaño. Cosas como "Quiero que el menú de la izquierda mida exactamente 260 píxeles de ancho" o "Quiero que la tabla tenga sombra".

---

### 💡 Resumen para editar tú mismo:
*   Si quieres **cambiar un texto visible** -> Ve a los archivos que terminan en `.jsx` (como `Header.jsx` o `Sidebar.jsx`) y simplemente reemplaza el texto.
*   Si quieres **cambiar un color o tamaño** -> Ve a los archivos que terminan en `.css`.
*   Si quieres **crear una nueva pantalla** -> Creas el archivo en la carpeta `pages` y luego vas a `App.jsx` para "abrirle la puerta" (crear su Ruta).
