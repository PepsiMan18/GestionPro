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
      (i.nombre && i.nombre.toLowerCase().trim() === recibo.inquilino.toLowerCase().trim()) ||
      (i.razonSocial && i.razonSocial.toLowerCase().trim() === recibo.inquilino.toLowerCase().trim())
    );
  }

  const inmuebleRelacionado = listaInmuebles.find(i => 
    Number(i.id) === Number(contratoRelacionado?.idInmueble)
  );

  // Determinar si es Persona Jurídica o si tiene Representante Legal
  const esJuridica = (inquilinoRelacionado?.tipoCliente === 'Jurídica' || inquilinoRelacionado?.tipoCliente === 'Persona Jurídica') || 
                     Boolean(inquilinoRelacionado?.razonSocial) || 
                     (recibo.nroDocumento && recibo.nroDocumento.length === 11 && recibo.nroDocumento.startsWith('20'));

  const razonSocialCliente = (inquilinoRelacionado?.razonSocial || inquilinoRelacionado?.nombre || recibo.inquilino || '---');
  const representanteLegal = (
    inquilinoRelacionado?.representanteLegal || 
    inquilinoRelacionado?.repLegal || 
    inquilinoRelacionado?.representante || 
    recibo.representanteLegal || 
    recibo.repLegal || 
    ''
  );

  let nombreCliente = recibo.inquilino || 'CLIENTE GENERAL';
  let documentoCliente = '---';
  let direccionCliente = '---';

  if (inquilinoRelacionado) {
    documentoCliente = inquilinoRelacionado.numeroDocumento || 
                       inquilinoRelacionado.nroDocumento || 
                       inquilinoRelacionado.Nro_Documento || 
                       inquilinoRelacionado.nro_documento || 
                       inquilinoRelacionado.dni || 
                       inquilinoRelacionado.ruc || 
                       '---';
                       
    direccionCliente = inquilinoRelacionado.direccion || '---';
    nombreCliente = inquilinoRelacionado.nombre || recibo.inquilino;
  } else {
    documentoCliente = recibo.numeroDocumento || recibo.nroDocumento || recibo.dni || recibo.ruc || '---';
    direccionCliente = recibo.direccion || '---';
  }

  // Limpiar y formatear Número de Contrato
  let nroContratoStr = '---';
  if (contratoRelacionado) {
    if (contratoRelacionado.nroContrato) nroContratoStr = contratoRelacionado.nroContrato;
    else if (contratoRelacionado.codigoContrato) nroContratoStr = contratoRelacionado.codigoContrato;
    else if (typeof contratoRelacionado.id === 'number' && contratoRelacionado.id < 10000) {
      nroContratoStr = `CON-${String(contratoRelacionado.id).padStart(4, '0')}`;
    } else {
      nroContratoStr = `CON-0001`;
    }
  } else if (recibo.idContrato) {
    const idC = String(recibo.idContrato);
    if (idC.length < 6) nroContratoStr = `CON-${idC.padStart(4, '0')}`;
    else nroContratoStr = `CON-0001`;
  }

  const esAlquiler = (recibo.tipo || '').toLowerCase().includes('alquiler') || 
                     (recibo.tipo || '').toLowerCase().includes('garantía') || 
                     (recibo.tipo || '').toLowerCase().includes('garantia');
  const codigoInmueble = recibo.inmueble || inmuebleRelacionado?.codigo || 'S-12';

  // Formateador de Fechas
  const formatFechaEmisionHora = (fStr) => {
    if (!fStr) return '---';
    if (fStr.includes(':')) return fStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(fStr)) {
      const [y, m, d] = fStr.split('-');
      return `${d}/${m}/${y} 12:00:00 p.m.`;
    }
    return fStr;
  };

  const formatFechaVcto = (fStr) => {
    if (!fStr) return '---';
    if (/^\d{4}-\d{2}-\d{2}$/.test(fStr)) {
      const [y, m, d] = fStr.split('-');
      return `${d}/${m}/${y}`;
    }
    return fStr;
  };

  // Impresión con nombre de archivo sugerido al guardar en PDF
  const handlePrint = () => {
    const originalTitle = document.title;
    
    // Extraer Mes (ej. Agosto)
    let mes = 'Agosto';
    const pStr = recibo.periodo || '';
    if (pStr.toLowerCase().includes('agosto')) mes = 'Agosto';
    else if (pStr.includes(' de ')) mes = pStr.split(' de ')[0].trim();
    else if (pStr.includes('/')) {
      const mesNum = parseInt(pStr.split('/')[0]);
      const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      mes = meses[mesNum - 1] || 'Mes';
    } else if (pStr) {
      mes = pStr.split(' ')[0];
    }
    
    mes = mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();

    // Extraer Local (ej. S-12 o S-25)
    let local = codigoInmueble || 'S-12';
    local = local.replace(/^LOCAL\s+/i, '').trim().replace(/\s+/g, '-');

    // Extraer Año
    let anio = '2026';
    if (recibo.periodo && recibo.periodo.includes('202')) {
      const match = recibo.periodo.match(/202\d/);
      if (match) anio = match[0];
    } else if (recibo.fechaEmision && recibo.fechaEmision.includes('202')) {
      const match = recibo.fechaEmision.match(/202\d/);
      if (match) anio = match[0];
    }

    // Nombre resultante: ej. Agosto-S-12-2026-Recibo
    const nombreArchivo = `${mes}-${local}-${anio}-Recibo`;
    document.title = nombreArchivo;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
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
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '6px 16px' }}>
                <div>
                  <strong>Fecha Emisión:</strong> {formatFechaEmisionHora(recibo.fechaEmision)}
                </div>
                <div>
                  <strong>Fecha Vcto.:</strong> {formatFechaVcto(recibo.fechaVencimiento)}
                </div>

                {esJuridica || representanteLegal ? (
                  <>
                    <div>
                      <strong>Razón Social:</strong> {razonSocialCliente}
                    </div>
                    <div>
                      <strong>Cond. de Pago:</strong> CRÉDITO 07 DÍAS
                    </div>

                    <div>
                      <strong>Representante Legal:</strong> {representanteLegal || 'NO REGISTRADO'}
                    </div>
                    <div>
                      <strong>Nro. Contrato:</strong> {nroContratoStr}
                    </div>

                    <div>
                      <strong>R.U.C.:</strong> {documentoCliente}
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}

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
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '80px' }}>ITEM</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '70px' }}>UND</th>
                  <th style={{ border: '1px solid #000', padding: '6px 12px', textAlign: 'left' }}>DESCRIPCIÓN DE SUMINISTRO / CONCEPTO</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '100px' }}>P. UNITARIO</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', width: '100px' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {esAlquiler ? (
                  (recibo.detalle && recibo.detalle.length > 0) ? (
                    recibo.detalle.map((item, idx) => {
                      const descUpper = (item.descripcion || '').toUpperCase();
                      const esGarantia = item.id === 'garantia' || descUpper.includes('GARANTÍA') || descUpper.includes('GARANTIA');
                      
                      let textoDesc = `ALQUILER ${codigoInmueble.toUpperCase()} - CORRESPONDIENTE AL MES DE ${(recibo.periodo || 'JUNIO').toUpperCase()}`;
                      if (esGarantia) {
                        textoDesc = `${descUpper} - LOCAL ${codigoInmueble.toUpperCase()}`;
                      }

                      return (
                        <tr key={idx}>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>MES</td>
                          <td style={{ border: '1px solid #000', padding: '8px' }}>
                            <strong>{textoDesc}</strong>
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                            {Number(item.importeCalculado || item.importe || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                            {Number(item.importeCalculado || item.importe || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>1</td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>MES</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>
                        {(recibo.tipo || '').toLowerCase().includes('garantía') || (recibo.tipo || '').toLowerCase().includes('garantia') ? (
                          <strong>GARANTÍA DE ALQUILER ({recibo.mesesGarantia || 1} MES(ES) DE GARANTÍA) - LOCAL {codigoInmueble.toUpperCase()}</strong>
                        ) : (
                          <strong>ALQUILER {codigoInmueble.toUpperCase()} - CORRESPONDIENTE AL MES DE {(recibo.periodo || 'JUNIO').toUpperCase()}</strong>
                        )}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                        {Number(recibo.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                        {Number(recibo.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )
                ) : (
                  // Recibo por Servicios (Un ítem por cada suministro usado: Luz, Agua, Gas, Vigilancia, Internet, Mantenimiento)
                  (recibo.detalle && recibo.detalle.length > 0) ? (
                    recibo.detalle.map((item, idx) => {
                      const descUpper = (item.descripcion || '').toUpperCase();
                      let unidadStr = (item.unidad || 'MES').toUpperCase();
                      if (descUpper.includes('AGUA') && (!item.unidad || item.unidad === 'MES')) unidadStr = 'M3';
                      if ((descUpper.includes('LUZ') || descUpper.includes('ENERG')) && (!item.unidad || item.unidad === 'MES')) unidadStr = 'KW';

                      const tieneLectura = (item.lecturaInicial !== null && item.lecturaInicial !== undefined) && 
                                           (item.lecturaFinal !== null && item.lecturaFinal !== undefined);
                      const consumoCalculado = tieneLectura ? Math.max(0, Number(item.lecturaFinal) - Number(item.lecturaInicial)) : null;

                      return (
                        <tr key={idx}>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{unidadStr}</td>
                          <td style={{ border: '1px solid #000', padding: '8px' }}>
                            <div><strong>CONSUMO DE {descUpper}</strong> - LOCAL {codigoInmueble.toUpperCase()} (PERÍODO DE {(recibo.periodo || '').toUpperCase()})</div>
                            {tieneLectura && (
                              <div style={{ fontSize: '0.78rem', color: '#333', marginTop: '2px' }}>
                                📊 Lectura Inic: <strong>{item.lecturaInicial}</strong> | Lectura Fin: <strong>{item.lecturaFinal}</strong> (Consumo Neto: <strong>{consumoCalculado} {unidadStr}</strong>)
                              </div>
                            )}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                            {Number(item.importeCalculado || item.importe || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                            {Number(item.importeCalculado || item.importe || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    // Fallback itemizado claro para recibos de consumo general (Luz, Agua, Vigilancia, Internet, Mantenimiento)
                    [
                      { itemNo: 1, und: 'KW', desc: `CONSUMO DE ENERGÍA ELÉCTRICA (LUZ) - LOCAL ${codigoInmueble.toUpperCase()}`, monto: Number(recibo.total || 0) * 0.40 },
                      { itemNo: 2, und: 'M3', desc: `CONSUMO DE AGUA POTABLE - LOCAL ${codigoInmueble.toUpperCase()}`, monto: Number(recibo.total || 0) * 0.25 },
                      { itemNo: 3, und: 'MES', desc: `SERVICIO DE VIGILANCIA Y SEGURIDAD - LOCAL ${codigoInmueble.toUpperCase()}`, monto: Number(recibo.total || 0) * 0.20 },
                      { itemNo: 4, und: 'MES', desc: `SERVICIO DE INTERNET Y MANTENIMIENTO ÁREAS COMUNES`, monto: Number(recibo.total || 0) * 0.15 }
                    ].map((row) => (
                      <tr key={row.itemNo}>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{row.itemNo}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{row.und}</td>
                        <td style={{ border: '1px solid #000', padding: '8px' }}>
                          <strong>{row.desc}</strong> - PERÍODO DE {(recibo.periodo || 'JUNIO').toUpperCase()}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                          {row.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                          {row.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
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

