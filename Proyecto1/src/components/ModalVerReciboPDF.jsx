import React, { useRef } from 'react';
import { numeroALetras } from '../utils/numeroALetras';

const ModalVerReciboPDF = ({ 
  recibo, 
  onClose, 
  listaContratos = [], 
  listaInquilinos = [], 
  listaInmuebles = [] 
}) => {
  const reciboRef = useRef(null);

  if (!recibo) return null;

  // Buscar información ampliada del contrato e inquilino si está disponible
  const contratoRelacionado = listaContratos.find(c => Number(c.id) === Number(recibo.idContrato));
  
  let inquilinoRelacionado = null;
  if (contratoRelacionado) {
    inquilinoRelacionado = listaInquilinos.find(i => Number(i.id) === Number(contratoRelacionado.idInquilino));
  } else if (recibo.inquilino) {
    inquilinoRelacionado = listaInquilinos.find(i => 
      (i.nombre && i.nombre.toLowerCase().includes(recibo.inquilino.toLowerCase())) ||
      (i.razonSocial && i.razonSocial.toLowerCase().includes(recibo.inquilino.toLowerCase()))
    );
  }

  const inmuebleRelacionado = listaInmuebles.find(i => 
    Number(i.id) === Number(contratoRelacionado?.idInmueble)
  );

  // Formatear nombre del cliente (Razón social + Representante legal si aplica)
  let nombreCliente = recibo.inquilino || 'CLIENTE GENERAL';
  let documentoCliente = '---';
  let direccionCliente = '---';

  if (inquilinoRelacionado) {
    if (inquilinoRelacionado.tipoCliente === 'Persona Jurídica' || inquilinoRelacionado.razonSocial) {
      nombreCliente = inquilinoRelacionado.razonSocial || inquilinoRelacionado.nombre;
      if (inquilinoRelacionado.representanteLegal || inquilinoRelacionado.repLegal) {
        nombreCliente += ` - REP. LEGAL: ${inquilinoRelacionado.representanteLegal || inquilinoRelacionado.repLegal}`;
      }
    } else {
      nombreCliente = inquilinoRelacionado.nombre || recibo.inquilino;
    }
    
    documentoCliente = inquilinoRelacionado.nroDocumento || inquilinoRelacionado.dni || inquilinoRelacionado.ruc || '09061959';
    direccionCliente = inquilinoRelacionado.direccion || 'Av. San Carlos Mz.B, Lte.6 San Gregorio-Ate Vitarte';
  } else {
    documentoCliente = recibo.nroDocumento || '09061959';
    direccionCliente = recibo.direccion || 'Av. San Carlos Mz.B, Lte.6 San Gregorio-Ate Vitarte';
  }

  const nroContratoStr = contratoRelacionado 
    ? (contratoRelacionado.codigoContrato || `CON-000${contratoRelacionado.id}`)
    : (recibo.idContrato ? `CON-000${recibo.idContrato}` : '---');

  const esAlquiler = (recibo.tipo || '').toLowerCase().includes('alquiler');
  const codigoInmueble = recibo.inmueble || inmuebleRelacionado?.codigo || 'PUESTO A-12';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #recibo-pdf-content, #recibo-pdf-content * {
            visibility: visible;
          }
          #recibo-pdf-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 10px;
            margin: 0;
            border: none !important;
            box-shadow: none !important;
          }
          .modal-header, .pdf-actions-bar, .modal-overlay {
            background: transparent !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="modal-content" style={{ maxWidth: '850px', width: '95%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        
        {/* Barra superior modal */}
        <div className="modal-header no-print" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Vista Previa Recibo de Ingreso (PDF)</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <i className="ph ph-printer"></i> Imprimir / Guardar PDF
            </button>
            <button className="btn-icon" onClick={onClose} title="Cerrar">
              <i className="ph ph-x"></i>
            </button>
          </div>
        </div>

        {/* Contenido imprimible del recibo */}
        <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1, backgroundColor: '#f8fafc' }}>
          <div 
            id="recibo-pdf-content" 
            ref={reciboRef} 
            style={{ 
              backgroundColor: '#ffffff', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              color: '#000000',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: '13px',
              maxWidth: '780px',
              margin: '0 auto'
            }}
          >
            {/* Header: Empresa (Izquierda sin logo) + RUC/Recibo (Derecha) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              
              {/* Info Empresa (Sin Logo) */}
              <div style={{ textAlign: 'center', flex: 1, paddingRight: '1rem' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 'bold', color: '#000', letterSpacing: '0.5px' }}>
                  MAEL S.R.L
                </h2>
                <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#111' }}>
                  Av. La Estrella No. 250, Santa Clara
                </p>
                <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#111' }}>
                  Ate - Lima
                </p>
                <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#111' }}>
                  Tel. (01) 356-0263
                </p>
                <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#111' }}>
                  E-mail : multicentrosantaclara@gmail.com
                </p>
              </div>

              {/* RUC y Recibo de Ingreso Box */}
              <div style={{ 
                border: '2px solid #000000', 
                borderRadius: '12px', 
                padding: '1rem 1.5rem', 
                textAlign: 'center', 
                minWidth: '260px' 
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  R.U.C. N° 20140943186
                </h3>
                <h2 style={{ margin: '8px 0', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                  RECIBO DE INGRESO
                </h2>
                <h3 style={{ margin: '8px 0 0 0', fontSize: '1.15rem', fontWeight: 'bold' }}>
                  N° {recibo.nroRi || `000${recibo.id}`}
                </h3>
              </div>
            </div>

            {/* Cabecera de Datos Cliente y Contrato */}
            <div style={{ 
              border: '1.5px solid #000000', 
              borderRadius: '10px', 
              padding: '10px 14px', 
              marginBottom: '1.2rem' 
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '8px 16px' }}>
                <div>
                  <strong>Fecha Emisión:</strong> {recibo.fechaEmision ? `${recibo.fechaEmision} 12:00:00a.m.` : '10/07/2023 12:00:00a.m.'}
                </div>
                <div>
                  <strong>Fecha Vcto.:</strong> {recibo.fechaVencimiento || '17/07/2023'}
                </div>

                <div>
                  <strong>Nombre Cliente:</strong> {nombreCliente}
                </div>
                <div>
                  <strong>Cond. de Pago:</strong> CRÉDITO 07 DÍAS
                </div>

                <div>
                  <strong>DNI / RUC:</strong> {documentoCliente}
                </div>
                <div>
                  <strong>Nro. Contrato:</strong> {nroContratoStr}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Dirección:</strong> {direccionCliente}
                </div>
              </div>
            </div>

            {/* Tabla de Detalle */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              border: '1.5px solid #000000',
              marginBottom: '1rem' 
            }}>
              <thead>
                <tr style={{ backgroundColor: '#666666', color: '#ffffff', textAlign: 'center', fontSize: '0.85rem' }}>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '80px' }}>CANTIDAD</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '70px' }}>UND</th>
                  <th style={{ border: '1px solid #000', padding: '6px 12px', textAlign: 'left' }}>DESCRIPCIÓN</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '100px' }}>P. UNITARIO</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '100px' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {esAlquiler ? (
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>1</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>MES</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>
                      ALQUILER {codigoInmueble.toUpperCase()} - CORRESPONDIENTE AL MES DE {(recibo.periodo || 'JUNIO').toUpperCase()}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(recibo.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(recibo.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ) : (
                  // Recibo por Servicios
                  (recibo.detalle && recibo.detalle.length > 0) ? (
                    recibo.detalle.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>1</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.unidad || 'MES'}</td>
                        <td style={{ border: '1px solid #000', padding: '8px' }}>
                          {item.descripcion.toUpperCase()} - {codigoInmueble.toUpperCase()} PERIODO DE {(recibo.periodo || '').toUpperCase()}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                          {Number(item.importeCalculado || item.importe || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                          {Number(item.importeCalculado || item.importe || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>1</td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>MES</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>
                        SERVICIOS DE AGUA, LUZ Y MANTENIMIENTO {codigoInmueble.toUpperCase()} - CORRESPONDIENTE AL MES DE {(recibo.periodo || 'JUNIO').toUpperCase()}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                        {Number(recibo.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                        {Number(recibo.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {/* Monto en letras y Cuadro Total a Pagar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>
                SON: &nbsp; {numeroALetras(recibo.total)}
              </div>
              <div style={{ 
                border: '1.5px solid #000000', 
                borderRadius: '8px', 
                padding: '6px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px' 
              }}>
                <strong style={{ fontSize: '0.9rem' }}>TOTAL A PAGAR</strong>
                <span style={{ fontSize: '0.9rem' }}>S/</span>
                <strong style={{ fontSize: '1.1rem' }}>
                  {Number(recibo.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            </div>

            {/* Cuentas Corrientes Enmascaradas */}
            <div style={{ 
              border: '1.5px solid #000000', 
              borderRadius: '8px', 
              padding: '8px 12px', 
              maxWidth: '480px' 
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase' }}>
                CUENTAS CORRIENTES EN SOLES:
              </div>
              <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #000', paddingTop: '4px', fontSize: '0.85rem' }}>
                <div><strong>BCP:</strong> XXXXXXXX</div>
                <div style={{ borderLeft: '1px solid #000', paddingLeft: '20px' }}><strong>MIBANCO:</strong> XXXXXXXX</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ModalVerReciboPDF;
