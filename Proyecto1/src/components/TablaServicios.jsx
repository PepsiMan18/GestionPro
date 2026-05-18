import React from 'react';

const TablaServicios = ({ servicios, contratos, inmuebles }) => {
  if (servicios.length === 0) {
    return (
      <div className="empty-state">
        <i className="ph ph-drop" style={{fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem'}}></i>
        <h3>No hay lecturas registradas</h3>
        <p>Registra las lecturas de agua o luz para empezar a cobrar a los inquilinos.</p>
      </div>
    );
  }

  // Helper para obtener datos del inmueble
  const getInmuebleInfo = (idContrato) => {
    const contrato = contratos.find(c => c.id === idContrato);
    if (!contrato) return 'Inmueble Desconocido';
    const inmueble = inmuebles.find(i => i.id === contrato.idInmueble);
    return inmueble ? `${inmueble.codigo} - ${inmueble.descripcion}` : 'Inmueble Desconocido';
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Historial de Lecturas y Consumos</h2>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Inmueble / Local</th>
              <th>Servicio</th>
              <th>Periodo</th>
              <th>Lectura Ant.</th>
              <th>Lectura Act.</th>
              <th>Consumo</th>
              <th>Monto a Cobrar</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s.id}>
                <td style={{color: '#64748b'}}>#{s.id.toString().padStart(3, '0')}</td>
                <td style={{fontWeight: '600'}}>{getInmuebleInfo(s.idContrato)}</td>
                <td>
                  {s.tipo === 'Agua' ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0284c7', fontWeight: '500'}}>
                      <i className="ph-fill ph-drop"></i> Agua
                    </div>
                  ) : (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308', fontWeight: '500'}}>
                      <i className="ph-fill ph-lightning"></i> Luz
                    </div>
                  )}
                </td>
                <td>{s.periodo}</td>
                <td>{s.lecturaAnterior} {s.tipo === 'Agua' ? 'm³' : 'kWh'}</td>
                <td>{s.lecturaActual} {s.tipo === 'Agua' ? 'm³' : 'kWh'}</td>
                <td style={{fontWeight: '600', color: '#475569'}}>{s.consumo} {s.tipo === 'Agua' ? 'm³' : 'kWh'}</td>
                <td className="price-text">S/ {parseFloat(s.monto).toFixed(2)}</td>
                <td>
                  <span className={`badge ${s.estado === 'Pendiente' ? 'badge-alert' : 'badge-occupied'}`}>
                    {s.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaServicios;
