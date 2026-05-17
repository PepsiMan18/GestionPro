import React, { useState } from 'react';
import TablaContratos from '../components/TablaContratos';
import ModalContrato from '../components/ModalContrato';

const Contratos = ({ listaContratos, setListaContratos, listaInmuebles, setListaInmuebles, listaInquilinos }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  const abrirModal = (contrato = null) => {
    setContratoSeleccionado(contrato);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setContratoSeleccionado(null);
  };

  const guardarContrato = (datos) => {
    if (datos.id) {
      setListaContratos(prev => prev.map(c => c.id === datos.id ? { ...c, ...datos } : c));
    } else {
      setListaContratos(prev => [{ ...datos, id: Date.now(), estado: 'Vigente' }, ...prev]);
      setListaInmuebles(prev => prev.map(inm => inm.id === Number(datos.idInmueble) ? { ...inm, estado: 'Ocupado' } : inm));
    }
  };

  const finalizarContrato = (idContrato, idInmueble) => {
    if(window.confirm('¿Estás seguro de finalizar este contrato? El inmueble quedará disponible automáticamente (HU-07).')){
      setListaContratos(prev => prev.map(c => c.id === idContrato ? { ...c, estado: 'Finalizado' } : c));
      setListaInmuebles(prev => prev.map(inm => inm.id === Number(idInmueble) ? { ...inm, estado: 'Disponible' } : inm));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Contratos</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
            Gestiona los contratos vigentes, por vencer y terminados.
          </p>
        </div>
        <button className="btn-primary" onClick={() => abrirModal()}>
          <i className="ph ph-plus"></i>
          Nuevo Contrato
        </button>
      </div>
      
      <TablaContratos 
        listaContratos={listaContratos} 
        listaInmuebles={listaInmuebles} 
        listaInquilinos={listaInquilinos} 
        alEditar={abrirModal}
        alFinalizar={finalizarContrato}
      />

      <ModalContrato
        abierto={modalAbierto}
        alCerrar={cerrarModal}
        datosContrato={contratoSeleccionado}
        alGuardar={guardarContrato}
        listaInmuebles={listaInmuebles}
        listaInquilinos={listaInquilinos}
      />
    </div>
  );
};

export default Contratos;
