// Generated from openapi.json. Run npm run api:generate.
import { http } from '../http';

export type AuthenticationIn = {
  user_login: string;
  user_password: string;
};

export type AuthenticationOut = {
  user: UserOut;
  expires_in: number;
};

export type Body_create_cargo_api_cargos_post = {
  cargo_name: string;
  image: File;
  video: File;
};

export type CargoFeedOut = {
  cargo_id: number;
  cargo_name: string;
  cargo_description: string | null;
  publication_status: string;
  image_url: string;
  video_url: string;
  image_public_url: string;
  video_public_url: string;
  cargo_mass: number | null;
  cargo_volume: number | null;
  created_at: string;
  formed_at: string;
  creator_user_id: number;
  is_creator: 0 | 1;
  interest_marks: number;
  is_liked: 0 | 1;
};

export type CargoOut = {
  cargo_id: number;
  cargo_name: string;
  cargo_description: string | null;
  publication_status: string;
  image_url: string;
  video_url: string;
  image_public_url: string;
  video_public_url: string;
  cargo_mass: number | null;
  cargo_volume: number | null;
  created_at: string;
  formed_at: string;
  creator_user_id: number;
  is_creator: 0 | 1;
  interest_marks: number;
};

export type CargoPublishIn = {
  cargo_description?: string | null;
  cargo_mass?: number | null;
  cargo_volume?: number | null;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type LikeIn = {
  interest: 0 | 1;
};

export type LikeOut = {
  cargo_id: number;
  interest: 0 | 1;
  interest_marks: number;
};

export type UserOut = {
  user_id: number;
  user_login: string;
  user_name: string;
};

export type UserRegisterIn = {
  user_login: string;
  user_name: string;
  user_password: string;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
  input?: unknown;
  ctx?: {

};
};

export async function getCargos(params: { cargo_mass?: number | null } = {}) {
  const response = await http.request<Array<CargoOut>>({
    method: 'GET', url: `/api/cargos`,
    params,
  });
  return response.data;
}

export async function getCargoFeed(params: { cargo_id?: number | null; next?: boolean } = {}) {
  const response = await http.request<CargoFeedOut>({
    method: 'GET', url: `/api/cargos/feed`,
    params,
  });
  return response.data;
}

export async function getCargoDraft() {
  const response = await http.request<CargoOut>({
    method: 'GET', url: `/api/cargos/draft`,
  });
  return response.data;
}

export async function createCargoDraft(body: Body_create_cargo_api_cargos_post) {
  const data = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    data.append(key, value);
  });
  const response = await http.request<CargoOut>({
    method: 'POST', url: `/api/cargos`,
    data: data,
  });
  return response.data;
}

export async function publishCargo(cargo_id: number, body?: CargoPublishIn | null) {
  const response = await http.request<CargoOut>({
    method: 'PUT', url: `/api/cargos/${cargo_id}`,
    data: body,
  });
  return response.data;
}

export async function deleteCargo(cargo_id: number) {
  const response = await http.request<void>({
    method: 'DELETE', url: `/api/cargos/${cargo_id}`,
  });
  return response.data;
}

export async function setCargoInterest(cargo_id: number, body: LikeIn) {
  const response = await http.request<LikeOut>({
    method: 'POST', url: `/api/cargos/${cargo_id}/likes`,
    data: body,
  });
  return response.data;
}

