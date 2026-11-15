import { useState, type FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { http, errorMessage } from '../api/http';
import type { AuthenticationOut } from '../api/generated/cargoApi';
import {
  authStarted, authFinished, authFailed, selectBusy,
  useAppDispatch, useAppSelector,
} from '../store/store';

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const busy = useAppSelector(selectBusy);
  const user = useAppSelector(state => state.cargo.user);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    dispatch(authStarted());
    try {
      // Авторизация: Axios напрямую, без thunk и кодогенерации.
      const { data } = await http.post<AuthenticationOut>(
        '/api/authentication',
        { user_login: login, user_password: password },
      );
      dispatch(authFinished(data.user));
      setPassword('');
      navigate('/catalog');
    } catch (error) {
      dispatch(authFailed(errorMessage(error)));
    }
  }
  return <div className="stranica-s-vkladkami">
    <header className="shapka-chernovika">
      <span className="znak-wolff">WOLFF</span>
      <h1 className="zagolovok-stranicy">Вход</h1>
    </header>
    {user ? <p>Вы вошли как {user.user_name}.</p> : (
      <Form onSubmit={submit}>
        <fieldset disabled={busy}>
          <Form.Label htmlFor="login">Логин</Form.Label>
          <Form.Control id="login" autoComplete="username"
            value={login} required maxLength={64}
            onChange={e => setLogin(e.target.value)} />
          <Form.Label htmlFor="password">Пароль</Form.Label>
          <Form.Control id="password" type="password"
            autoComplete="current-password" value={password}
            required onChange={e => setPassword(e.target.value)} />
          <Button className="knopka-deystviya" type="submit">
            Войти
          </Button>
        </fieldset>
      </Form>
    )}
  </div>;
}
