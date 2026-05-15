import React, { useState } from 'react';
import TablaInmuebles from '../components/TablaInmuebles';
import ModalInmueble from '../components/ModalInmueble';
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

  const guardarInmueble = (datosFormulario) => {
    const alquilerFormateado = `$${Number(datosFormulario.alquiler).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    if (datosFormulario.id) {
      setListaInmuebles(prev => prev.map(inm => inm.id === datosFormulario.id ? { 
        ...inm, 
        ...datosFormulario, 
        alquiler: alquilerFormateado,
        proximosPagos: datosFormulario.estado === 'Con Deuda' ? inm.proximosPagos : 'Al Día'
      } : inm));
    } else {
      const nuevoInmueble = {
        ...datosFormulario,
        id: Date.now(),
        alquiler: alquilerFormateado,
        proximosPagos: datosFormulario.estado === 'Ocupado' ? 'Al Día' : '-',
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
