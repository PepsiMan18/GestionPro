import React, { useState, useEffect } from 'react';
import './ModalInmueble.css';

const ModalContrato = ({ abierto, alCerrar, datosContrato, alGuardar, listaInmuebles, listaInquilinos }) => {
  const esEdicion = !!datosContrato;

  const [formulario, setFormulario] = useState({
    id: null,
    idInmueble: '',
    idInquilino: '',
    fechaInicio: '',
    fechaFin: '',
    monto: '',
    archivo: null
  });

  useEffect(() => {
    if (datosContrato) {
      setFormulario({ ...datosContrato });
    } else {
      setFormulario({
        id: null,
        idInmueble: '',
        idInquilino: '',
        fechaInicio: '',
        fechaFin: '',
        monto: '',
        archivo: null
      });
    }
  }, [datosContrato, abierto]);

  if (!abierto) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const procesarGuardado = (e) => {
    e.preventDefault();
    alGuardar(formulario);
    alCerrar();
  };

  const inmueblesDisponibles = esEdicion 
    ? listaInmuebles 
    : listaInmuebles.filter(i => i.estado === 'Disponible' || i.estado === 'Desocupado');

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{esEdicion ? 'Renovar Contrato (HU-06)' : 'Generar Nuevo Contrato (HU-05)'}</h2>
          <button type="button" className="close-btn" onClick={alCerrar}><i className="ph ph-x"></i></button>
        </div>
        <form onSubmit={procesarGuardado}>
          <div className="modal-body">
            <div className="form-grid">
              
              <div className="form-group full-width">
                <label className="form-label">Inmueble (Solo Disponibles)</label>
                <select name="idInmueble" className="form-control" value={formulario.idInmueble} onChange={manejarCambio} required disabled={esEdicion}>
                  <option value="">-- Selecciona un inmueble libre --</option>
                  {inmueblesDisponibles.map(inm => (
                    <option key={inm.id} value={inm.id}>{inm.codigo} - {inm.descripcion} ({inm.alquiler})</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Inquilino</label>
                <select name="idInquilino" className="form-control" value={formulario.idInquilino} onChange={manejarCambio} required disabled={esEdicion}>
                  <option value="">-- Selecciona un inquilino registrado --</option>
                  {listaInquilinos.map(inq => (
                    <option key={inq.id} value={inq.id}>{inq.nombre} ({inq.numeroDocumento})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Inicio</label>
                <input type="date" name="fechaInicio" className="form-control" value={formulario.fechaInicio} onChange={manejarCambio} required disabled={esEdicion}/>
              </div>

              <div className="form-group">
                <label className="form-label">Nueva Fecha de Vencimiento</label>
                <input type="date" name="fechaFin" className="form-control" value={formulario.fechaFin} onChange={manejarCambio} required />
              </div>

              <div className="form-group">
                <label className="form-label">Monto de Alquiler Base Acordado ($)</label>
                <input type="number" name="monto" className="form-control" value={formulario.monto} onChange={manejarCambio} required disabled={esEdicion} />
              </div>


            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={alCerrar}>Cancelar</button>
            <button type="submit" className="btn-primary">
              <i className="ph ph-floppy-disk"></i> {esEdicion ? 'Guardar Renovación' : 'Generar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ModalContrato;
