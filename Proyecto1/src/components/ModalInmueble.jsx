import React, { useState, useEffect } from 'react';
import './ModalInmueble.css';

const ModalInmueble = ({ abierto, alCerrar, datosInmueble, alGuardar }) => {
  const esEdicion = !!datosInmueble;

  const [formulario, setFormulario] = useState({
    id: null,
    direccion: '',
    ciudad: '',
    tipo: 'Departamento',
    alquiler: '',
    estado: 'Desocupado',
    inquilino: '',
    diaCobro: ''
  });

  useEffect(() => {
    if (datosInmueble) {
      setFormulario({
        id: datosInmueble.id || null,
        direccion: datosInmueble.direccion || '',
        ciudad: datosInmueble.ciudad || '',
        tipo: datosInmueble.tipo || 'Departamento',
        alquiler: datosInmueble.alquiler ? datosInmueble.alquiler.replace('$', '').replace(',', '') : '',
        estado: datosInmueble.estado === 'Con Deuda' ? 'Ocupado' : (datosInmueble.estado || 'Desocupado'),
        inquilino: datosInmueble.inquilino || '',
        diaCobro: datosInmueble.diaCobro || ''
      });
    } else {
      setFormulario({
        id: null,
        direccion: '',
        ciudad: '',
        tipo: 'Departamento',
        alquiler: '',
        estado: 'Desocupado',
        inquilino: '',
        diaCobro: ''
      });
    }
  }, [datosInmueble, abierto]);

  if (!abierto) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
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
            {esEdicion ? 'Editar Inmueble' : 'Agregar Nuevo Inmueble'}
          </h2>
          <button className="close-btn" onClick={alCerrar} type="button">
            <i className="ph ph-x"></i>
          </button>
        </div>
        <form onSubmit={procesarGuardado}>
          <div className="modal-body">
            <div className="form-grid">
              
              <div className="form-group full-width">
                <label className="form-label">Dirección (Avenida / Calle)</label>
                <input 
                  type="text" 
                  name="direccion" 
                  className="form-control" 
                  placeholder="Ej. Av. Las Gardenias 456" 
                  value={formulario.direccion}
                  onChange={manejarCambio}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input 
                  type="text" 
                  name="ciudad" 
                  className="form-control" 
                  placeholder="Ej. Lima" 
                  value={formulario.ciudad}
                  onChange={manejarCambio}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Inmueble</label>
                <select 
                  name="tipo" 
                  className="form-control"
                  value={formulario.tipo}
                  onChange={manejarCambio}
                >
                  <option value="Departamento">Departamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Local Comercial">Local Comercial</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Alquiler Mensual ($)</label>
                <input 
                  type="number" 
                  name="alquiler" 
                  className="form-control" 
                  placeholder="Ej. 1000" 
                  value={formulario.alquiler}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select 
                  name="estado" 
                  className="form-control"
                  value={formulario.estado}
                  onChange={manejarCambio}
                >
                  <option value="Desocupado">Desocupado (Disponible)</option>
                  <option value="Ocupado">Ocupado (Alquilado)</option>
                  <option value="En Mantenimiento">En Mantenimiento</option>
                </select>
              </div>

              {formulario.estado === 'Ocupado' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Inquilino Asignado</label>
                    <input 
                      type="text" 
                      name="inquilino" 
                      className="form-control" 
                      placeholder="Nombre del inquilino" 
                      value={formulario.inquilino}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Día de Cobro (1-31)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="31" 
                      name="diaCobro" 
                      className="form-control" 
                      placeholder="Ej. 15" 
                      value={formulario.diaCobro}
                      onChange={manejarCambio}
                    />
                  </div>
                </>
              )}

            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={alCerrar}>Cancelar</button>
            <button type="submit" className="btn-primary">
              <i className="ph ph-floppy-disk"></i>
              {esEdicion ? 'Guardar Cambios' : 'Registrar Inmueble'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInmueble;
