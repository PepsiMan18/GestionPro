import React from 'react';

const TablaInquilinos = ({ listaInquilinos = [], alEditarInquilino }) => {
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
            {listaInquilinos.map((item) => (
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
                  <span className={`badge ${item.estado === 'Activo' ? 'badge-occupied' : 'badge-vacant'}`}>
                    {item.estado}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-outline" 
                    style={{ fontSize: '0.875rem' }}
                    onClick={() => alEditarInquilino && alEditarInquilino(item)}
                  >
                    <i className="ph ph-pencil-simple"></i>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaInquilinos;
