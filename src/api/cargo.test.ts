import { describe, expect, it } from 'vitest';
import { mediaUrl } from './cargo';
import { http } from './http';
import * as api from './generated/cargoApi';

describe('Axios-кодогенерация и proxy', () => {
  it('сохраняет маршруты API, параметры и файлы multipart', async () => {
    const original = http.defaults.adapter;
    const requests: Array<{ url?: string; data?: unknown;
      params?: unknown }> = [];
    http.defaults.adapter = async config => {
      requests.push(config);
      return { data: [], status: 200, statusText: 'OK',
        headers: {}, config };
    };
    try {
      await api.getCargos({ cargo_mass: 3 });
      await api.createCargoDraft({ cargo_name: 'Панель',
        image: new Blob(['image']) as File,
        video: new Blob(['video']) as File });
      expect(requests[0].url).toBe('/api/cargos');
      expect(requests[0].params).toEqual({ cargo_mass: 3 });
      const data = requests[1].data as FormData;
      expect(data.get('cargo_name')).toBe('Панель');
      expect(data.get('image')).toBeInstanceOf(Blob);
      expect(data.get('video')).toBeInstanceOf(Blob);
    } finally { http.defaults.adapter = original; }
  });
  it('перенаправляет MinIO через второй маршрут proxy', () => {
    expect(mediaUrl('http://127.0.0.1:9100/cargo-media/photo.jpg'))
      .toBe('/s3/cargo-media/photo.jpg');
    expect(mediaUrl('/media/default-cargo.jpg'))
      .toBe('/media/default-cargo.jpg');
  });
});
