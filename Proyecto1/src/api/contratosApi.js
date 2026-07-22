import { apiFetch } from './config';

const mapFromDTO = (dto) => ({
  id: dto.idContrato || dto.id || Date.now(),
  idInmueble: dto.idInmueble || dto.inmuebleId,
  idInquilino: dto.idInquilino || dto.inquilinoId,
  codigoInmueble: dto.codigoInmueble,
  nombreInquilino: dto.nombreInquilino,
  fechaInicio: dto.fechaInicio,
  fechaFin: dto.fechaVcmto || dto.fechaFin,
  monto: dto.rentaMensual || dto.monto,
  estado: dto.estado || (dto.etiqueta === 'VENCIDO' ? 'Por Vencer' : (dto.estadoContrato === 'Finalizado' ? 'Finalizado' : 'Vigente'))
});

export async function getContratos() {
  const response = await apiFetch('/api/contratos');
  if (!response) return [];
  if (!response.ok) throw new Error('Error al obtener contratos');
  const data = await response.json();
  return Array.isArray(data) ? data.map(mapFromDTO) : [];
}

export async function createContrato(data) {
  const response = await apiFetch('/api/contratos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response) return null;
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Error al crear contrato');
  }
  return response.json();
}

export async function finalizarContratoApi(id) {
  const response = await apiFetch(`/api/contratos/${id}/finalizar`, {
    method: 'PUT'
  });
  if (!response) return null;
  if (!response.ok) throw new Error('Error al finalizar contrato');
  return response.json();
}

export async function activarContratoApi(id, urlDocumento) {
  const response = await apiFetch(`/api/contratos/${id}/activar`, {
    method: 'PUT',
    body: JSON.stringify({ urlDocumento }),
  });
  if (!response) return null;
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Error al activar contrato');
  }
  return response.json();
}

export async function renovarContratoApi(id, data) {
  const response = await apiFetch(`/api/contratos/${id}/renovar`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response) return null;
  if (!response.ok) throw new Error('Error al renovar contrato');
  return response.json();
}

export async function uploadContratoPdf(id, file) {
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "PDF simulado con éxito" });
    }, 800);
  });
  
  
}
