import { apiFetch } from './config';

export async function getContratos() {
  const response = await apiFetch('/api/contratos');
  if (!response) return [];
  if (!response.ok) throw new Error('Error al obtener contratos');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
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

export async function uploadContratoPdf(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  
  // Notice we must override headers to let the browser set the boundary for multipart/form-data
  const response = await apiFetch(`/api/contratos/${id}/documento`, {
    method: 'POST',
    headers: {
      'Content-Type': null // Trigger removal of default json content-type
    },
    body: formData,
  });
  
  if (!response) return null;
  if (!response.ok) throw new Error('Error al subir el documento PDF');
  return response.json();
}
