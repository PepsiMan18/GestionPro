import React, { useState } from 'react';
import TablaInmuebles from '../components/TablaInmuebles';
import ModalInmueble from '../components/ModalInmueble';
import { createInmueble, updateInmueble } from '../api/inmueblesApi';
import './PanelControl.css';

const Inmuebles = ({ listaInmuebles, setListaInmuebles }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

  const abrirModal = (inmueble = null) => {
    setInmuebleSeleccionado(inmueble);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setInmuebleSeleccionado(null);
  };

  const guardarInmueble = async (datosFormulario) => {
    const alquilerFormateado = `$${Number(datosFormulario.alquiler).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    if (datosFormulario.id) {
      try {
        // 1. Intentar actualizar en AWS
        await updateInmueble(datosFormulario.id, datosFormulario);
      } catch (err) {
        console.warn("Fallo al actualizar en AWS, guardando solo en local:", err);
      }
      
      // 2. Actualizar estado local (Éxito o Fallback)
      setListaInmuebles(prev => prev.map(inm => inm.id === datosFormulario.id ? { 
        ...inm, 
        ...datosFormulario, 
        alquiler: alquilerFormateado
      } : inm));
      
    } else {
      let nuevoId = Date.now();
      try {
        // 1. Intentar crear en AWS
        const response = await createInmueble(datosFormulario);
        if(response && response.id) nuevoId = response.id;
      } catch (err) {
        console.warn("Fallo al crear en AWS, guardando solo en local:", err);
      }

      // 2. Actualizar estado local (Éxito o Fallback)
      const nuevoInmueble = {
        ...datosFormulario,
        id: nuevoId,
        alquiler: alquilerFormateado,
        imagen: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200&h=150'
      };
      setListaInmuebles(prev => [nuevoInmueble, ...prev]);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Mis Inmuebles</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Gestiona todo tu catálogo de propiedades, departamentos y casas.</p>
        </div>
        <button className="btn-primary" onClick={() => abrirModal()}>
          <i className="ph ph-plus"></i>
          Agregar Inmueble
        </button>
      </div>

      <TablaInmuebles listaInmuebles={listaInmuebles} alEditarInmueble={abrirModal} />
      
      <ModalInmueble 
        abierto={modalAbierto} 
        alCerrar={cerrarModal} 
        datosInmueble={inmuebleSeleccionado} 
        alGuardar={guardarInmueble}
      />
    </div>
  );
};

export default Inmuebles;
