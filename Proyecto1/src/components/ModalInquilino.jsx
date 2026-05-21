import React, { useState, useEffect } from 'react';
import './ModalInmueble.css';

const ModalInquilino = ({ abierto, alCerrar, datosInquilino, alGuardar }) => {
  const esEdicion = !!datosInquilino;

  const [formulario, setFormulario] = useState({
    id: null,
    tipoCliente: 'Natural',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombre: '',
    celular: '',
    correo: '',
    direccion: '',
    sustentoIngresos: '',
    referencias: ''
  });

  useEffect(() => {
    if (datosInquilino) {
      setFormulario({ ...datosInquilino });
    } else {
      setFormulario({
        id: null,
        tipoCliente: 'Natural',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        nombre: '',
        celular: '',
        correo: '',
        direccion: '',
        sustentoIngresos: '',
        referencias: ''
      });
    }
  }, [datosInquilino, abierto]);

  if (!abierto) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'numeroDocumento' && (formulario.tipoDocumento === 'DNI' || formulario.tipoDocumento === 'RUC')) {
      newValue = value.replace(/\D/g, ''); // Solo números
    }
    
    setFormulario(prev => ({ ...prev, [name]: newValue }));
  };

  const procesarGuardado = (e) => {
    e.preventDefault();
    alGuardar && alGuardar(formulario);
    alCerrar();
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {esEdicion ? 'Editar Inquilino' : 'Registrar Nuevo Inquilino'}
          </h2>
          <button className="close-btn" onClick={alCerrar} type="button">
            <i className="ph ph-x"></i>
          </button>
        </div>
        <form onSubmit={procesarGuardado}>
          <div className="modal-body">
            <div className="form-grid">
              
              <div className="form-group">
                <label className="form-label">Tipo de Cliente</label>
                <select name="tipoCliente" className="form-control" value={formulario.tipoCliente} onChange={manejarCambio}>
                  <option value="Natural">Persona Natural</option>
                  <option value="Jurídica">Persona Jurídica</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Documento</label>
                <select name="tipoDocumento" className="form-control" value={formulario.tipoDocumento} onChange={manejarCambio}>
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">Carnet de Extranjería</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Número de Documento</label>
                <input 
                  type="text" 
                  name="numeroDocumento" 
                  className="form-control" 
                  value={formulario.numeroDocumento} 
                  onChange={manejarCambio} 
                  maxLength={formulario.tipoDocumento === 'DNI' ? 8 : formulario.tipoDocumento === 'RUC' ? 11 : 12}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{formulario.tipoCliente === 'Jurídica' ? 'Razón Social' : 'Nombres y Apellidos'}</label>
                <input type="text" name="nombre" className="form-control" value={formulario.nombre} onChange={manejarCambio} required />
              </div>

              <div className="form-group">
                <label className="form-label">Celular / Teléfono</label>
                <input type="text" name="celular" className="form-control" value={formulario.celular} onChange={manejarCambio} required />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input type="email" name="correo" className="form-control" value={formulario.correo} onChange={manejarCambio} />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Dirección Actual</label>
                <input type="text" name="direccion" className="form-control" value={formulario.direccion} onChange={manejarCambio} />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Sustento de Ingresos</label>
                <input type="text" name="sustentoIngresos" className="form-control" placeholder="Ej. Boletas de pago, Recibos por honorarios" value={formulario.sustentoIngresos} onChange={manejarCambio} />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Referencias y Comentarios</label>
                <textarea name="referencias" className="form-control" rows="2" value={formulario.referencias} onChange={manejarCambio} placeholder="Contacto de emergencia o referencia personal..."></textarea>
              </div>

            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={alCerrar}>Cancelar</button>
            <button type="submit" className="btn-primary">
              <i className="ph ph-floppy-disk"></i>
              {esEdicion ? 'Guardar Cambios' : 'Registrar Inquilino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInquilino;
