import { Navbar } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { http, errorMessage } from '../api/http';
import {
  authStarted, authFinished, authFailed, selectBusy,
  useAppDispatch, useAppSelector,
} from '../store/store';

type TabIconProps = {
  kind: 'feed' | 'add' | 'grid' | 'login';
};

function TabIcon({ kind }: TabIconProps) {
  const shapes = {
    feed: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <path d="M10 9l6 3-6 3V9z" />
      </>
    ),
    add: <path d="M12 5v14M5 12h14" />,
    grid: (
      <>
        <rect x="3" y="3" width="8" height="8" />
        <rect x="13" y="3" width="8" height="8" />
        <rect x="3" y="13" width="8" height="8" />
        <rect x="13" y="13" width="8" height="8" />
      </>
    ),
    login: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {shapes[kind]}
    </svg>
  );
}

export function BottomNavigation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.cargo.user);
  const busy = useAppSelector(selectBusy);
  async function logout() {
    if (busy) return;
    dispatch(authStarted());
    try {
      await http.post('/api/deauthentication');
      dispatch(authFinished(null));
      navigate('/catalog');
    } catch (error) {
      dispatch(authFailed(errorMessage(error)));
    }
  }
  return (
    <Navbar className="panel-vkladok-podyoma">
      <NavLink className="vkladka-podyoma" to="/" end>
        <TabIcon kind="feed" />
        <span>Лента</span>
      </NavLink>
      {user ? (
        <NavLink className="vkladka-podyoma" to="/cargo_addition">
          <TabIcon kind="add" /><span>Добавление</span>
        </NavLink>
      ) : (
        <button className="vkladka-podyoma" disabled>
          <TabIcon kind="add" /><span>Добавление</span>
        </button>
      )}
      <NavLink className="vkladka-podyoma" to="/catalog">
        <TabIcon kind="grid" />
        <span>Плитка</span>
      </NavLink>
      {user ? (
        <button className="vkladka-podyoma" onClick={logout}
          disabled={busy}>
          <TabIcon kind="login" /><span>Выход</span>
        </button>
      ) : (
        <NavLink className="vkladka-podyoma" to="/login">
          <TabIcon kind="login" /><span>Вход</span>
        </NavLink>
      )}
    </Navbar>
  );
}
