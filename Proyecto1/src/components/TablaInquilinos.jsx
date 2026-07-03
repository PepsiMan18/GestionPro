import React from 'react';

const TablaInquilinos = ({ listaInquilinos = [], listaContratos = [], alEditarInquilino, alEliminarInquilino }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Lista de Inquilinos</h2>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre / Razón Social</th>
              <th>Documento</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaInquilinos.map((item) => {
              const tieneContrato = listaContratos.some(c => {
                const matchId = Number(c.idInquilino) === Number(item.id);
                const matchNombre = c.nombreInquilino && item.nombre && c.nombreInquilino.toLowerCase().trim() === item.nombre.toLowerCase().trim();
                
                if (!matchId && !matchNombre) return false;
                
                if (c.estado === 'Vigente' || c.estado === 'Doc Pendiente' || c.estado === 'Por Vencer' || c.estadoContrato === 'Renovado' || c.estadoContrato === 'Vigente') return true;
                if (c.estado === 'Finalizado' || c.estado === 'Anulado') return false;
                
                if (c.fechaFin) {
                  const hoy = new Date();
                  const fin = new Date(c.fechaFin);
                  const diffDays = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
                  return diffDays >= 0;
                }
                
                return false;
              });
              const estadoBadge = tieneContrato ? 'Con Contrato' : 'Sin Contrato';
              const badgeClass = tieneContrato ? 'badge-occupied' : 'badge-vacant';

              return (
              <tr key={item.id}>
                <td style={{fontWeight: '600'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', 
                      backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                    }}>
                      {item.nombre.charAt(0)}
                    </div>
                    <div>
                      <div>{item.nombre}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{item.tipoCliente}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{item.tipoDocumento}</div>
                  <div style={{color: 'var(--text-muted)'}}>{item.numeroDocumento}</div>
                </td>
                <td>
                  <div style={{fontSize: '0.875rem'}}>+51 {item.celular}</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{item.correo}</div>
                </td>
                <td>
                  <span className={`badge ${badgeClass}`}>
                    {estadoBadge}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-outline" 
                      style={{ fontSize: '0.875rem' }}
                      onClick={() => alEditarInquilino && alEditarInquilino(item)}
                    >
                      <i className="ph ph-pencil-simple"></i>
                      Editar
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ fontSize: '0.875rem', borderColor: 'var(--status-debt)', color: 'var(--status-debt)' }}
                      onClick={() => alEliminarInquilino && alEliminarInquilino(item.id)}
                    >
                      <i className="ph ph-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaInquilinos;
