import { apiFetch } from './config';

export async function getContratos() {
  const response = await fetch('http://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/contratos', {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Error al obtener contratos');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function createContrato(data) {
  const response = await fetch('http://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/contratos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Error al crear contrato');
  }
  return response.json();
}

export async function uploadContratoPdf(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`http://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws/api/contratos/${id}/documento`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
    body: formData,
  });
  
  if (!response.ok) throw new Error('Error al subir el documento PDF');
  return response.json();
}
