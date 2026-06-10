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

export async function finalizarContratoApi(id) {
  const response = await apiFetch(`/api/contratos/${id}/finalizar`, {
    method: 'PUT'
  });
  if (!response) return null;
  if (!response.ok) throw new Error('Error al finalizar contrato');
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
  // El endpoint de AWS devuelve 404 actualmente, simularemos la carga para la exposición
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "PDF simulado con éxito" });
    }, 800);
  });
  
  /* CÓDIGO REAL (Descomentar cuando el backend suba la ruta /documento)
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiFetch(`/api/contratos/${id}/documento`, {
    method: 'POST',
    headers: {
      'Content-Type': null 
    },
    body: formData,
  });
  
  if (!response) return null;
  if (!response.ok) throw new Error('Error al subir el documento PDF');
  return response.json();
  */
}
