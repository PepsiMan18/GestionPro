import React, { useState, useEffect } from 'react';
import './ModalInmueble.css';

const ModalInmueble = ({ abierto, alCerrar, datosInmueble, alGuardar }) => {
  const esEdicion = !!datosInmueble;

  const [formulario, setFormulario] = useState({
    id: null,
    codigo: '',
    descripcion: '',
    tipo: 'Local Comercial',
    sector: 'Mercado',
    alquiler: '',
    estado: 'Disponible',
    area: '',
    piso: '',
    incluyeServicios: 'N'
  });

  useEffect(() => {
    if (datosInmueble) {
      setFormulario({
        id: datosInmueble.id || null,
        codigo: datosInmueble.codigo || '',
        descripcion: datosInmueble.descripcion || '',
        tipo: datosInmueble.tipo || 'Local Comercial',
        sector: datosInmueble.sector || 'Mercado',
        alquiler: datosInmueble.alquiler ? datosInmueble.alquiler.replace('$', '').replace(',', '') : '',
        estado: datosInmueble.estado || 'Disponible',
        area: datosInmueble.area || '',
        piso: datosInmueble.piso || '',
        incluyeServicios: datosInmueble.incluyeServicios || 'N'
      });
    } else {
      setFormulario({
        id: null,
        codigo: '',
        descripcion: '',
        tipo: 'Local Comercial',
        sector: 'Mercado',
        alquiler: '',
        estado: 'Disponible',
        area: '',
        piso: '',
        incluyeServicios: 'N'
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
              
              <div className="form-group">
                <label className="form-label">Código del Inmueble</label>
                <input 
                  type="text" 
                  name="codigo" 
                  className="form-control" 
                  placeholder="Ej. A-15" 
                  value={formulario.codigo}
                  onChange={manejarCambio}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <input 
                  type="text" 
                  name="descripcion" 
                  className="form-control" 
                  placeholder="Ej. LOCAL A-15" 
                  value={formulario.descripcion}
                  onChange={manejarCambio}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sector / Zona</label>
                <select 
                  name="sector" 
                  className="form-control"
                  value={formulario.sector}
                  onChange={manejarCambio}
                >
                  <option value="Mercado">Mercado</option>
                  <option value="Galería">Galería</option>
                  <option value="Sección M">Sección M</option>
                  <option value="Sección R">Sección R</option>
                  <option value="Sección S">Sección S</option>
                  <option value="Tiendas Externas">Tiendas Externas</option>
                  <option value="Oficinas">Oficinas</option>
                  <option value="Módulos">Módulos</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Inmueble</label>
                <select 
                  name="tipo" 
                  className="form-control"
                  value={formulario.tipo}
                  onChange={manejarCambio}
                >
                  <option value="Local Comercial">Local Comercial</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Tienda Externa">Tienda Externa</option>
                  <option value="Puesto">Puesto</option>
                  <option value="Módulo">Módulo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Área (Metraje)</label>
                <input 
                  type="text" 
                  name="area" 
                  className="form-control" 
                  placeholder="Ej. 20 m2" 
                  value={formulario.area}
                  onChange={manejarCambio}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Piso</label>
                <input 
                  type="text" 
                  name="piso" 
                  className="form-control" 
                  placeholder="Ej. 1" 
                  value={formulario.piso}
                  onChange={manejarCambio}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Precio Alquiler Base ($)</label>
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
                  <option value="Disponible">Disponible</option>
                  <option value="Ocupado">Ocupado</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Reservado">Reservado</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">¿Incluye Servicios Básicos?</label>
                <select 
                  name="incluyeServicios" 
                  className="form-control"
                  value={formulario.incluyeServicios}
                  onChange={manejarCambio}
                >
                  <option value="S">Sí, incluye servicios</option>
                  <option value="N">No incluye servicios</option>
                </select>
              </div>

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
