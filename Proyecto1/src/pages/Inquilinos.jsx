import React, { useState } from 'react';
import TablaInquilinos from '../components/TablaInquilinos';
import ModalInquilino from '../components/ModalInquilino';
import './PanelControl.css';

const Inquilinos = ({ listaInquilinos, setListaInquilinos }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [inquilinoSeleccionado, setInquilinoSeleccionado] = useState(null);

  const abrirModal = (inquilino = null) => {
    setInquilinoSeleccionado(inquilino);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setInquilinoSeleccionado(null);
  };

  const guardarInquilino = (datos) => {
    if (datos.id) {
      setListaInquilinos(prev => prev.map(inq => inq.id === datos.id ? { ...inq, ...datos } : inq));
    } else {
      setListaInquilinos(prev => [{ ...datos, id: Date.now(), estado: 'Activo' }, ...prev]);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Directorio de Inquilinos</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Administra la información de contacto y estado de tus inquilinos.</p>
        </div>
        <button className="btn-primary" onClick={() => abrirModal()}>
          <i className="ph ph-user-plus"></i>
          Nuevo Inquilino
        </button>
      </div>

      <TablaInquilinos listaInquilinos={listaInquilinos} alEditarInquilino={abrirModal} />
      
      <ModalInquilino 
        abierto={modalAbierto} 
        alCerrar={cerrarModal} 
        datosInquilino={inquilinoSeleccionado}
        alGuardar={guardarInquilino}
      />
    </div>
  );
};

export default Inquilinos;
