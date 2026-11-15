import { Spinner } from 'react-bootstrap';
import { selectBusy, useAppSelector } from '../store/store';

export function RequestStatus() {
  const busy = useAppSelector(selectBusy);
  const error = useAppSelector(state => state.cargo.error);
  return <>
    {busy && <div className="request-overlay" role="status">
      <Spinner animation="border" />
      <span>Загрузка…</span>
    </div>}
    {error && <div className="request-error" role="alert">
      {error}
    </div>}
  </>;
}
