import { cargos, getCargoVolume, type Cargo } from '../data';
import type { CargoOut, CargoFeedOut } from './generated/cargoApi';

export type CargoView = Omit<Cargo, 'mass' | 'dimensions'> & {
  mass: number | null;
  volume: number | null;
  isCreator: boolean;
  isLiked: boolean;
  interest: number;
};

export function mediaUrl(url: string): string {
  if (!url) return '';
  // Адреса MinIO из текущей конфигурации бэкенда.
  const parsed = new URL(url, 'http://localhost');
  if (['localhost', '127.0.0.1'].includes(parsed.hostname)
    && ['9100', '9000'].includes(parsed.port)) {
    return `/s3${parsed.pathname}${parsed.search}`;
  }
  return url;
}

export function cargoView(c: CargoOut | CargoFeedOut): CargoView {
  return {
    id: c.cargo_id, name: c.cargo_name, category: '',
    description: c.cargo_description || '',
    mass: c.cargo_mass, volume: c.cargo_volume,
    image: mediaUrl(c.image_public_url),
    video: mediaUrl(c.video_public_url),
    isCreator: c.is_creator === 1,
    isLiked: 'is_liked' in c && c.is_liked === 1,
    interest: c.interest_marks,
  };
}

export const mockCargos: CargoView[] = cargos.map(c => ({
  ...c, volume: getCargoVolume(c), isCreator: false,
  isLiked: false, interest: 0,
}));
