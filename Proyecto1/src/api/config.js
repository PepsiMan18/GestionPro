export const API_BASE_URL = 'https://si-8d2b91972c694c15850c6454045d57cd.ecs.us-east-2.on.aws';

export function authHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function apiFetch(path, options = {}) {
  const mergedHeaders = { ...authHeaders(), ...options?.headers };
  if (mergedHeaders['Content-Type'] === null) {
    delete mergedHeaders['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: mergedHeaders,
  });

  if (response.status === 401) {
    // Token expirado o inválido — limpiar y recargar para forzar login
    sessionStorage.clear();
    window.location.reload();
    return;
  }

  return response;
}
