import React, { useState } from 'react';
import TablaInquilinos from '../components/TablaInquilinos';
import ModalInquilino from '../components/ModalInquilino';
import { createInquilino, updateInquilino, deleteInquilino } from '../api/inquilinosApi';
import './PanelControl.css';

const Inquilinos = ({ listaInquilinos, setListaInquilinos, listaContratos = [] }) => {
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

  const guardarInquilino = async (datos) => {
    if (datos.id) {
      try {
        await updateInquilino(datos.id, datos);
      } catch (err) {
        console.warn("Fallo al actualizar en AWS, guardando solo en local:", err);
      }
      setListaInquilinos(prev => prev.map(inq => inq.id === datos.id ? { ...inq, ...datos } : inq));
    } else {
      let nuevoId = Date.now();
      try {
        const response = await createInquilino(datos);
        if (response && response.idInquilino) nuevoId = response.idInquilino;
        else if (response && response.id) nuevoId = response.id;
        
        // Solo agregar a la tabla si AWS responde bien
        setListaInquilinos(prev => [{ ...datos, id: nuevoId, estado: 'Activo' }, ...prev]);
      } catch (err) {
        console.error("Error en AWS:", err);
        alert(err.message || "Fallo al crear en la base de datos de AWS.");
        // No agregamos a local state para evitar fantasmas
      }
    }
  };

  const eliminarInquilino = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este inquilino?')) {
      try {
        await deleteInquilino(id);
        setListaInquilinos(prev => prev.filter(inq => inq.id !== id));
      } catch (err) {
        console.warn("Fallo al eliminar en AWS:", err);
        alert('No se pudo eliminar el inquilino. Es posible que tenga contratos asociados en la base de datos.');
      }
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

      <TablaInquilinos 
        listaInquilinos={listaInquilinos}
        listaContratos={listaContratos}
        alEditarInquilino={abrirModal} 
        alEliminarInquilino={eliminarInquilino} 
      />
      
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
