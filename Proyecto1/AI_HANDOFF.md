# 🤖 AI Handoff Document: Proyecto GestiónPro

> **Instrucción para la Inteligencia Artificial:**
> Eres un asistente experto en programación (IA). El usuario te ha compartido este proyecto de React. Tu misión es actuar como el desarrollador principal, manteniendo la consistencia del código, respetando el sistema de diseño actual (CSS puro con variables) y continuando con el desarrollo de las Historias de Usuario (HU) restantes.
> 
> A continuación, tienes todo el contexto necesario del proyecto. Lee atentamente antes de sugerir cambios.

---

## 1. Contexto de Negocio y Tecnologías
*   **Negocio:** Sistema de gestión inmobiliaria, que administra locales, puestos y oficinas. Controla inquilinos, contratos, servicios de agua/luz y facturación/cobranzas.
*   **Stack:** React 18, Vite, React Router DOM v6.
*   **Estilos:** Vanilla CSS modular. Sin Tailwind, Bootstrap ni librerías de UI externas. Diseño moderno corporativo.
*   **Estado:** Actualmente no hay backend. Usamos el estado global de React (`useState` en `App.jsx`) para simular la base de datos temporalmente e inyectar arrays de datos a las vistas mediante props.

---

## 2. Esquema de Base de Datos (Relacional)
El código Front-End está estrictamente acoplado a este modelo de base de datos relacional:
*   `INMUEBLES`: IdInmueble, IdTipoInmueble, Descripcion_Inmueble, IdSector, Area_Inmueble, Piso_Inmueble, Moneda, Precio_Alquiler, IdEstadoInmueble, Observaciones, IncluyeServicios.
*   `CLIENTE` (Inquilino): IdCliente, IdTipoCliente, IdTDocumento, Nro_Documento, RazonSocial_NApellidos, Celular_Telefono, Direccion, Correo, Referencia, Vigente.
*   `CONTRATOS`: IdContrato, IdInmueble, IdCliente, F_Inicio, F_Fin, Monto, ArchivoPDF, Vigente.
*   *(Otras tablas a desarrollar en el futuro)*: `SERVICIOS`, `PAGOS`, `CATÁLOGOS`.

---

## 3. Estado Actual del Desarrollo
Se han completado y testeado los siguientes módulos (puedes verificar en `App.jsx` y `src/pages`):

✅ **HU-001 (Inmuebles):** Mantenimiento de locales. Formulario con manejo de áreas, sectores y cambio de estados (Disponible/Ocupado).
✅ **HU-002 (Inquilinos):** Directorio de personas naturales/jurídicas. Incluye campo para sustento de ingresos y referencias.
✅ **HU-05 a HU-09 (Contratos):** Módulo central de unión Inmueble-Inquilino.
  * Selector dinámico que filtra solo Inmuebles "Disponibles".
  * Cálculo dinámico de Vigencia de Contrato (Vigente, Por Vencer, Vencido).
  * Función de "Renovar" (HU-06) para actualizar fecha fin de contrato.
  * Función de "Finalizar" (HU-07) que cierra el contrato y libera automáticamente el inmueble (vuelve a 'Disponible').
  * Espacio en UI para adjuntar contrato PDF (HU-08).

---

## 4. Próximos Pasos (Lo que debes programar)
Al continuar el proyecto, pregunta al usuario por cuál de estos bloques desea continuar:

1.  **Servicios Fijos y Variables (HU-10 a HU-13):**
    *   Módulo para registrar recibos de Agua/Luz por local.
    *   Lógica para registrar lectura de medidor inicial/final o montos fijos.
2.  **Pagos y Facturación (HU-14 a HU-18):**
    *   Módulo para generar cobros mensuales masivos o individuales.
    *   Opción para emitir recibos y anular pagos por error.
3.  **Dashboard Analítico (HU-20 a HU-22):**
    *   Actualizar `PanelControl.jsx` para cruzar la información de todos los módulos: total de ingresos, contratos por vencer y deudores.

## 5. Reglas Estrictas para la IA
1.  **Prioriza la Estética:** Respeta y re-usa las clases globales de botones (`btn-primary`, `btn-outline`), modales (`modal-overlay`) y tablas de la hoja de estilos actual.
2.  **Componentes Pequeños:** Si vas a crear una tabla o un formulario, hazlo en la carpeta `components` (`ModalNuevo.jsx`, `TablaNueva.jsx`).
3.  **Arquitectura Temporal:** Hasta que no se implemente Node.js, sigue creando las listas mockeadas iniciales en `App.jsx` y pásalas como Props (Lifted State). No uses Redux ni Context API por ahora a menos que el usuario lo pida.
