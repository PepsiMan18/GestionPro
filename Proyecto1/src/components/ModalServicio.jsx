import React, { useState, useEffect } from 'react';

const ModalServicio = ({ isOpen, onClose, alGuardar, contratos, inmuebles }) => {
  // Solo queremos mostrar contratos vigentes
  const contratosVigentes = contratos.filter(c => c.estado === 'Vigente');

  const [formData, setFormData] = useState({
    idContrato: '',
    tipo: 'Agua',
    periodo: '',
    lecturaAnterior: '',
    lecturaActual: '',
    monto: ''
  });

  // Resetear el formulario cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        idContrato: contratosVigentes.length > 0 ? contratosVigentes[0].id : '',
        tipo: 'Agua',
        periodo: new Date().toISOString().slice(0, 7), // Formato YYYY-MM
        lecturaAnterior: '',
        lecturaActual: '',
        monto: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getConsumo = () => {
    const ant = parseFloat(formData.lecturaAnterior) || 0;
    const act = parseFloat(formData.lecturaActual) || 0;
    return act > ant ? act - ant : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.idContrato) {
      alert("Debe seleccionar un contrato vigente.");
      return;
    }
    
    const nuevoServicio = {
      ...formData,
      idContrato: parseInt(formData.idContrato),
      lecturaAnterior: parseFloat(formData.lecturaAnterior) || 0,
      lecturaActual: parseFloat(formData.lecturaActual) || 0,
      consumo: getConsumo(),
      monto: parseFloat(formData.monto) || 0,
      estado: 'Pendiente' // Por defecto nace pendiente de cobro
    };
    alGuardar(nuevoServicio);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{maxWidth: '500px'}}>
        <div className="modal-header">
          <h2 className="modal-title">Registrar Lectura de Servicio</h2>
          <button className="btn-close" onClick={onClose}>
            <i className="ph ph-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Local / Contrato Vigente</label>
            <select 
              className="form-control"
              name="idContrato"
              value={formData.idContrato}
              onChange={handleChange}
              required
            >
              {contratosVigentes.length === 0 && <option value="">No hay contratos vigentes</option>}
              {contratosVigentes.map(c => {
                const inm = inmuebles.find(i => i.id === c.idInmueble);
                return (
                  <option key={c.id} value={c.id}>
                    {inm ? `${inm.codigo} - ${inm.descripcion}` : `Contrato #${c.id}`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
            <div className="form-group">
              <label className="form-label">Tipo de Servicio</label>
              <select className="form-control" name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="Agua">Agua</option>
                <option value="Luz">Luz</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Periodo (Mes/Año)</label>
              <input 
                type="month" 
                className="form-control" 
                name="periodo"
                value={formData.periodo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
            <div className="form-group">
              <label className="form-label">Lectura Anterior</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                name="lecturaAnterior"
                placeholder="Ej. 120"
                value={formData.lecturaAnterior}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lectura Actual</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                name="lecturaActual"
                placeholder="Ej. 125"
                value={formData.lecturaActual}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <span style={{color: '#64748b', fontWeight: '500'}}>Consumo Calculado:</span>
              <span style={{fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)'}}>
                {getConsumo()} {formData.tipo === 'Agua' ? 'm³' : 'kWh'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Monto Total a Cobrar (S/)</label>
            <input 
              type="number" 
              step="0.01"
              className="form-control" 
              name="monto"
              placeholder="Ej. 15.00"
              value={formData.monto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              Guardar Lectura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalServicio;
