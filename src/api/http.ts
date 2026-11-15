import axios from 'axios';

export const http = axios.create({
  baseURL: '/',
  withCredentials: true,
  timeout: 10000,
});

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map(item => item.msg).join('; ');
    }
    return error.response
      ? `Ошибка запроса: ${error.response.status}`
      : 'Сервис недоступен. Проверьте подключение.';
  }
  return error instanceof Error ? error.message : 'Ошибка запроса';
}

export function serviceUnavailable(error: unknown): boolean {
  return axios.isAxiosError(error) && (
    !error.response || error.response.status >= 500
  ) && error.code !== 'ERR_CANCELED';
}
