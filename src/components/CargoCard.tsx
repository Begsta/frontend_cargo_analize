import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { CargoView } from '../api/cargo';
import {
  useAppDispatch, useAppSelector, deleteCargo,
  loadCargos, selectBusy,
} from '../store/store';
import { Media } from './Media';

export function CargoCard({ cargo }: { cargo: CargoView }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.cargo.user);
  const busy = useAppSelector(selectBusy);
  async function remove() {
    const result = await dispatch(deleteCargo(cargo.id));
    if (deleteCargo.fulfilled.match(result)) {
      void dispatch(loadCargos());
    }
  }
  return <Card as="article" className="kartochka-gruza">
    <Link className="ssylka-kartochki" to={`/?cargo=${cargo.id}`}>
      <div className="foto-kartochki"><Media cargo={cargo} /></div>
      <Card.Body className="telo-kartochki">
        <h2>{cargo.name}</h2>
        <div className="niz-kartochki">
          <span>Интерес <strong>{cargo.interest}</strong></span>
          <span>Масса <strong>{cargo.mass ?? '—'} т</strong>
            {' · Объём '}
            <strong>{cargo.volume?.toFixed(2) ?? '—'} м³</strong>
          </span>
        </div>
      </Card.Body>
    </Link>
    {user && cargo.isCreator && (
      <div className="deystviya-kartochki">
        <Button className="delete-btn" disabled={busy}
          onClick={remove}>Удалить</Button>
      </div>
    )}
  </Card>;
}
