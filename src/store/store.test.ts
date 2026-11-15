import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import * as api from '../api/generated/cargoApi';
import {
  cargoReducer, authFinished, massChanged, filterApplied,
  loadCargos, loadCargoFeed, loadCargoDraft, nextCargo,
  createCargoDraft, publishCargo, deleteCargo, setCargoInterest,
} from './store';

const makeStore = () => configureStore({
  reducer: { cargo: cargoReducer },
});
const cargo: api.CargoFeedOut = {
  cargo_id: 1, cargo_name: 'Панель', cargo_description: null,
  cargo_mass: 4, cargo_volume: 2, publication_status: 'published',
  image_url: 'image.jpg', video_url: 'video.mp4',
  image_public_url: 'http://localhost:9100/cargo-media/image.jpg',
  video_public_url: 'http://localhost:9100/cargo-media/video.mp4',
  created_at: '', formed_at: '', creator_user_id: 3,
  is_creator: 1, is_liked: 0, interest_marks: 0,
};
const user = { user_id: 3, user_login: 'test', user_name: 'Тест' };
function httpError(status: number) {
  return new AxiosError('error', 'ERR_BAD_RESPONSE', undefined,
    undefined, {
      status, statusText: '', data: { detail: 'Ошибка' },
      headers: {}, config: {} as InternalAxiosRequestConfig,
    });
}
afterEach(() => vi.restoreAllMocks());

describe('Redux грузов', () => {
  it('передаёт применённый фильтр в API и преобразует медиа', async () => {
    const request = vi.spyOn(api, 'getCargos')
      .mockResolvedValue([cargo]);
    const s = makeStore();
    s.dispatch(massChanged(4));
    expect(s.getState().cargo.filters.appliedMass).toBe(0);
    s.dispatch(filterApplied());
    await s.dispatch(loadCargos());
    expect(request).toHaveBeenCalledWith({ cargo_mass: 4 });
    expect(s.getState().cargo.catalog[0].image)
      .toBe('/s3/cargo-media/image.jpg');
    expect(s.getState().cargo.requests).toEqual({});
  });
  it('даёт гостевой mock при сетевой ошибке с прежним фильтром', async () => {
    vi.spyOn(api, 'getCargos').mockRejectedValue(
      new AxiosError('network', 'ERR_NETWORK'),
    );
    const s = makeStore();
    await s.dispatch(loadCargos());
    expect(s.getState().cargo.catalog).toHaveLength(9);
    s.dispatch(massChanged(2)); s.dispatch(filterApplied());
    await s.dispatch(loadCargos());
    expect(s.getState().cargo.catalog).toHaveLength(6);
    s.dispatch(massChanged(10)); s.dispatch(filterApplied());
    await s.dispatch(loadCargos());
    expect(s.getState().cargo.catalog).toHaveLength(0);
  });
  it('не подменяет ошибки 4xx и данные пользователя mock', async () => {
    const request = vi.spyOn(api, 'getCargos')
      .mockRejectedValue(httpError(422));
    const s = makeStore();
    await s.dispatch(loadCargos());
    expect(s.getState().cargo.catalog).toEqual([]);
    expect(s.getState().cargo.error).toBe('Ошибка');
    s.dispatch(authFinished(user));
    request.mockRejectedValue(new AxiosError('network'));
    await s.dispatch(loadCargos());
    expect(s.getState().cargo.catalog).toEqual([]);
    expect(s.getState().cargo.user).toEqual(user);
  });
  it('сбрасывает фильтр на выходе и не восстанавливает вход', () => {
    const s = makeStore();
    s.dispatch(authFinished(user));
    s.dispatch(massChanged(5)); s.dispatch(filterApplied());
    expect(makeStore().getState().cargo.user).toBeNull();
    s.dispatch(authFinished(null));
    expect(s.getState().cargo.filters)
      .toEqual({ mass: 0, appliedMass: 0 });
  });
  it('не принимает ответ прежнего запроса после выхода', async () => {
    let resolve!: (data: api.CargoOut[]) => void;
    vi.spyOn(api, 'getCargos').mockImplementation(() =>
      new Promise(r => { resolve = r; }));
    const s = makeStore();
    s.dispatch(authFinished(user));
    const pending = s.dispatch(loadCargos());
    expect(Object.keys(s.getState().cargo.requests)).toHaveLength(1);
    s.dispatch(authFinished(null));
    resolve([cargo]); await pending;
    expect(s.getState().cargo.catalog).toEqual([]);
  });
  it('читает черновик, создаёт, публикует, ставит лайк и удаляет', async () => {
    vi.spyOn(api, 'getCargoDraft').mockRejectedValue(httpError(404));
    vi.spyOn(api, 'createCargoDraft').mockResolvedValue(cargo);
    vi.spyOn(api, 'publishCargo').mockResolvedValue(cargo);
    vi.spyOn(api, 'getCargoFeed').mockResolvedValue(cargo);
    vi.spyOn(api, 'setCargoInterest').mockResolvedValue({
      cargo_id: 1, interest: 1, interest_marks: 1,
    });
    vi.spyOn(api, 'deleteCargo').mockResolvedValue(undefined);
    const s = makeStore(); s.dispatch(authFinished(user));
    await s.dispatch(loadCargoDraft());
    expect(s.getState().cargo.draft).toBeNull();
    await s.dispatch(createCargoDraft({
      cargo_name: 'Панель', image: {} as File, video: {} as File,
    }));
    expect(s.getState().cargo.draft?.id).toBe(1);
    await s.dispatch(publishCargo({ id: 1, body: {} }));
    expect(s.getState().cargo.draft).toBeNull();
    await s.dispatch(loadCargoFeed(1));
    await s.dispatch(setCargoInterest({ id: 1, interest: 1 }));
    expect(s.getState().cargo.feed?.isLiked).toBe(true);
    await s.dispatch(deleteCargo(1));
    expect(s.getState().cargo.feed).toBeNull();
  });
  it('401 защищённого запроса сбрасывает вход и ожидание', async () => {
    vi.spyOn(api, 'getCargoDraft').mockRejectedValue(httpError(401));
    const s = makeStore(); s.dispatch(authFinished(user));
    await s.dispatch(loadCargoDraft());
    expect(s.getState().cargo.user).toBeNull();
    expect(s.getState().cargo.requests).toEqual({});
  });
  it('переключает гостевую ленту циклически без сервиса', async () => {
    vi.spyOn(api, 'getCargoFeed').mockRejectedValue(
      new AxiosError('network'),
    );
    const s = makeStore();
    await s.dispatch(nextCargo(9));
    expect(s.getState().cargo.feed?.id).toBe(1);
  });
});
