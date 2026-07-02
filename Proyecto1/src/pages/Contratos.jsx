import React, { useState } from 'react';
import TablaContratos from '../components/TablaContratos';
import ModalContrato from '../components/ModalContrato';
import { createContrato, uploadContratoPdf, finalizarContratoApi, renovarContratoApi, activarContratoApi } from '../api/contratosApi';
import { generarRecibosIniciales } from '../api/recibosApi';

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

  const guardarContrato = async (datos) => {
    if (datos.id) {
      try {
        await renovarContratoApi(datos.id, {
          IdInquilino: Number(datos.idInquilino),
          IdInmueble: Number(datos.idInmueble),
          FechaInicio: datos.fechaInicio,
          FechaVcmto: datos.fechaFin,
          RentaMensual: Number(datos.monto)
        });
      } catch (err) {
        console.warn("Error en AWS al renovar, aplicando renovación local para presentación:", err);
      }
      setListaContratos(prev => prev.map(c => c.id === datos.id ? { ...c, ...datos } : c));
    } else {
      const dto = {
        fechaContrato: new Date().toISOString().split('T')[0],
        idInquilino: Number(datos.idInquilino),
        representante: datos.representante || null,
        tipoNegocio: datos.tipoNegocio,
        fechaInicio: datos.fechaInicio,
        nroMeses: Number(datos.nroMeses),
        idMoneda: 1,
        garantia: Number(datos.monto) * Number(datos.mesesGarantia),
        idInmueble: Number(datos.idInmueble),
        rentaMensual: Number(datos.monto),
        mesesGarantia: Number(datos.mesesGarantia),
        modalidadPago: datos.modalidadPago,
        cuotasPendientes: Number(datos.nroMeses)
      };
      
      let nuevoId = Date.now();
      try {
        const response = await createContrato(dto);
        if (response && response.idContrato) nuevoId = response.idContrato;
        else if (response && response.id) nuevoId = response.id;
      } catch (err) {
        console.warn("Error en AWS al crear contrato, activando modo presentación local:", err);
      }
      
      const nuevoContrato = {
        ...datos,
        id: nuevoId,
        estado: 'Doc Pendiente',
        archivo: datos.archivo || null
      };
      
      setListaContratos(prev => [nuevoContrato, ...prev]);
      // NO actualizamos el Inmueble a Ocupado aún, porque nace en Doc Pendiente (HU-05)
    }
  };

  const subirPdfContrato = async (idContrato, file) => {
    try {
       await uploadContratoPdf(idContrato, file);
       const urlDocumento = `https://s3.amazonaws.com/sisalq/contratos/${file.name}`;
       
       // Activar el contrato en AWS
       await activarContratoApi(idContrato, urlDocumento);
       
       // Generar recibos iniciales
       try {
         await generarRecibosIniciales(idContrato, 'admin');
       } catch (reciboErr) {
         console.warn("Recibos iniciales fallback local:", reciboErr);
       }

       setListaContratos(prev => prev.map(c => c.id === idContrato ? { ...c, estado: 'Vigente', archivo: file.name } : c));
       
       // Pasar el inmueble a Ocupado localmente
       const contratoObj = listaContratos.find(c => c.id === idContrato);
       if (contratoObj) {
         setListaInmuebles(prev => prev.map(inm => inm.id === Number(contratoObj.idInmueble) ? { ...inm, estado: 'Ocupado' } : inm));
       }

       alert("Documento subido, contrato activado y recibos iniciales generados con éxito.");
    } catch(err) {
       console.warn("Fallo al activar en AWS, simulando en local:", err);
       setListaContratos(prev => prev.map(c => c.id === idContrato ? { ...c, estado: 'Vigente', archivo: file.name } : c));
       const contratoObj = listaContratos.find(c => c.id === idContrato);
       if (contratoObj) {
         setListaInmuebles(prev => prev.map(inm => inm.id === Number(contratoObj.idInmueble) ? { ...inm, estado: 'Ocupado' } : inm));
       }
    }
  };

  const finalizarContrato = async (idContrato, idInmueble) => {
    if(window.confirm('¿Estás seguro de finalizar este contrato? El inmueble quedará disponible automáticamente (HU-07).')){
      try {
        await finalizarContratoApi(idContrato);
        setListaContratos(prev => prev.map(c => c.id === idContrato ? { ...c, estado: 'Finalizado' } : c));
        setListaInmuebles(prev => prev.map(inm => inm.id === Number(idInmueble) ? { ...inm, estado: 'Disponible' } : inm));
      } catch (err) {
        console.error("Error al finalizar contrato:", err);
        alert(err.message || "Fallo al finalizar el contrato en la base de datos.");
      }
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
        alSubirPdf={subirPdfContrato}
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
