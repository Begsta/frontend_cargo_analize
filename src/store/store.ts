import {
  configureStore, createAsyncThunk, createSlice,
  isPending, isRejected, isFulfilled,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as api from '../api/generated/cargoApi';
import { cargoView, mockCargos, type CargoView } from '../api/cargo';
import { errorMessage, serviceUnavailable } from '../api/http';

type Failure = { message: string; unauthorized: boolean };
type Result<T> = { data: T; source: 'api' | 'mock' };
export type InterfaceState = {
  user: api.UserOut | null;
  authPending: boolean;
  error: string | null;
  filters: { mass: number; appliedMass: number };
  catalog: CargoView[];
  feed: CargoView | null;
  draft: CargoView | null;
  requests: Record<string, string>;
};
const initialState: InterfaceState = {
  user: null, authPending: false, error: null,
  filters: { mass: 0, appliedMass: 0 },
  catalog: [], feed: null, draft: null, requests: {},
};
type Config = {
  state: { cargo: InterfaceState };
  rejectValue: Failure;
};
function failure(error: unknown): Failure {
  return {
    message: errorMessage(error),
    unauthorized: axios.isAxiosError(error)
      && error.response?.status === 401,
  };
}

export const loadCargos = createAsyncThunk<
  Result<CargoView[]>, void, Config
>('cargo/loadCargos', async (_, { getState, rejectWithValue }) => {
  const { user, filters } = getState().cargo;
  try {
    const data = await api.getCargos({
      cargo_mass: filters.appliedMass,
    });
    return { data: data.map(cargoView), source: 'api' };
  } catch (error) {
    if (!user && serviceUnavailable(error)) {
      return {
        data: mockCargos.filter(c =>
          (c.mass ?? 0) >= filters.appliedMass),
        source: 'mock',
      };
    }
    return rejectWithValue(failure(error));
  }
});
export const loadCargoFeed = createAsyncThunk<
  Result<CargoView | null>, number | undefined, Config
>('cargo/loadCargoFeed', async (id, { getState, rejectWithValue }) => {
  try {
    return {
      data: cargoView(await api.getCargoFeed({ cargo_id: id })),
      source: 'api',
    };
  } catch (error) {
    if (!getState().cargo.user && serviceUnavailable(error)) {
      return {
        data: id === undefined ? mockCargos[0]
          : mockCargos.find(c => c.id === id) ?? null,
        source: 'mock',
      };
    }
    return rejectWithValue(failure(error));
  }
});
export const nextCargo = createAsyncThunk<
  Result<CargoView | null>, number, Config
>('cargo/nextCargo', async (id, { getState, rejectWithValue }) => {
  try {
    return {
      data: cargoView(await api.getCargoFeed({
        cargo_id: id, next: true,
      })), source: 'api',
    };
  } catch (error) {
    if (!getState().cargo.user && serviceUnavailable(error)) {
      const index = mockCargos.findIndex(c => c.id === id);
      return {
        data: mockCargos[(index + 1) % mockCargos.length],
        source: 'mock',
      };
    }
    return rejectWithValue(failure(error));
  }
});
export const loadCargoDraft = createAsyncThunk<
  CargoView | null, void, Config
>('cargo/loadCargoDraft', async (_, { rejectWithValue }) => {
  try {
    return cargoView(await api.getCargoDraft());
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    return rejectWithValue(failure(error));
  }
});
export const createCargoDraft = createAsyncThunk<
  CargoView, { cargo_name: string; image: File; video: File }, Config
>('cargo/createCargoDraft', async (body, { rejectWithValue }) => {
  try {
    return cargoView(await api.createCargoDraft(body));
  } catch (error) { return rejectWithValue(failure(error)); }
});
export const publishCargo = createAsyncThunk<
  CargoView, { id: number; body: api.CargoPublishIn }, Config
>('cargo/publishCargo', async ({ id, body }, thunk) => {
  try {
    return cargoView(await api.publishCargo(id, body));
  } catch (error) { return thunk.rejectWithValue(failure(error)); }
});
export const deleteCargo = createAsyncThunk<number, number, Config>(
  'cargo/deleteCargo', async (id, { rejectWithValue }) => {
    try { await api.deleteCargo(id); return id; }
    catch (error) { return rejectWithValue(failure(error)); }
  },
);
export const setCargoInterest = createAsyncThunk<
  api.LikeOut, { id: number; interest: 0 | 1 }, Config
>('cargo/setCargoInterest', async ({ id, interest }, thunk) => {
  try { return await api.setCargoInterest(id, { interest }); }
  catch (error) { return thunk.rejectWithValue(failure(error)); }
});
const operations = [
  loadCargos, loadCargoFeed, nextCargo, loadCargoDraft,
  createCargoDraft,
  publishCargo, deleteCargo, setCargoInterest,
] as const;
function slot(type: string): string {
  return type.split('/')[1];
}
const cargoSlice = createSlice({
  name: 'cargo', initialState,
  reducers: {
    massChanged(state, action: PayloadAction<number>) {
      state.filters.mass = action.payload;
    },
    filterApplied(state) {
      state.filters.appliedMass = state.filters.mass;
    },
    authStarted(state) {
      state.authPending = true; state.error = null;
    },
    authFinished(state, action: PayloadAction<api.UserOut | null>) {
      state.user = action.payload;
      state.authPending = false; state.error = null;
      state.catalog = []; state.feed = null; state.draft = null;
      state.requests = {};
      if (!action.payload) state.filters = { mass: 0, appliedMass: 0 };
    },
    authFailed(state, action: PayloadAction<string>) {
      state.authPending = false; state.error = action.payload;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCargos.fulfilled, (s, a) => {
        if (s.requests.loadCargos === a.meta.requestId) {
          s.catalog = a.payload.data;
        }
      })
      .addCase(loadCargoFeed.fulfilled, (s, a) => {
        if (s.requests.loadCargoFeed === a.meta.requestId) {
          s.feed = a.payload.data;
        }
      })
      .addCase(nextCargo.fulfilled, (s, a) => {
        if (s.requests.nextCargo === a.meta.requestId) {
          s.feed = a.payload.data;
        }
      })
      .addCase(loadCargoDraft.fulfilled, (s, a) => {
        if (s.requests.loadCargoDraft === a.meta.requestId) {
          s.draft = a.payload;
        }
      })
      .addCase(createCargoDraft.fulfilled, (s, a) => {
        if (s.requests.createCargoDraft === a.meta.requestId) {
          s.draft = a.payload;
        }
      })
      .addCase(publishCargo.fulfilled, (s, a) => {
        if (s.requests.publishCargo === a.meta.requestId) {
          s.draft = null;
        }
      })
      .addCase(deleteCargo.fulfilled, (s, a) => {
        if (s.requests.deleteCargo !== a.meta.requestId) return;
        s.catalog = s.catalog.filter(c => c.id !== a.payload);
        if (s.feed?.id === a.payload) s.feed = null;
        if (s.draft?.id === a.payload) s.draft = null;
      })
      .addCase(setCargoInterest.fulfilled, (s, a) => {
        if (s.requests.setCargoInterest !== a.meta.requestId) return;
        const { cargo_id, interest, interest_marks } = a.payload;
        for (const c of [...s.catalog, s.feed]) {
          if (c?.id === cargo_id) {
            c.isLiked = interest === 1; c.interest = interest_marks;
          }
        }
      })
      .addMatcher(isPending(...operations), (s, a) => {
        s.requests[slot(a.type)] = a.meta.requestId;
        s.error = null;
      })
      .addMatcher(isRejected(...operations), (s, a) => {
        if (s.requests[slot(a.type)] !== a.meta.requestId) return;
        delete s.requests[slot(a.type)];
        s.error = a.payload?.message || 'Ошибка запроса';
        if (a.payload?.unauthorized) {
          s.user = null; s.draft = null; s.catalog = [];
          s.feed = null; s.requests = {};
          s.filters = { mass: 0, appliedMass: 0 };
        }
      })
      .addMatcher(isFulfilled(...operations), (s, a) => {
        if (s.requests[slot(a.type)] === a.meta.requestId) {
          delete s.requests[slot(a.type)];
        }
      });
  },
});
export const {
  massChanged, filterApplied, authStarted, authFinished,
  authFailed, clearError,
} = cargoSlice.actions;
export const cargoReducer = cargoSlice.reducer;
export const store = configureStore({
  reducer: { cargo: cargoReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const selectBusy = (state: RootState) => (
  state.cargo.authPending
    || Object.keys(state.cargo.requests).length > 0
);
