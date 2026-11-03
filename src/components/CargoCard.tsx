import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCargoVolume, type Cargo } from '../data';
import { Media } from './Media';

type CargoCardProps = {
  cargo: Cargo;
};

export function CargoCard({ cargo }: CargoCardProps) {
  const volume = getCargoVolume(cargo).toFixed(2);

  return (
    <Card as="article" className="kartochka-gruza">
      <Link className="ssylka-kartochki" to={`/?cargo=${cargo.id}`}>
        <div className="foto-kartochki">
          <Media cargo={cargo} />
        </div>
        <Card.Body className="telo-kartochki">
          <h2>{cargo.name}</h2>
          <div className="niz-kartochki">
            <span>Интерес <strong>0</strong></span>
            <span>
              Масса <strong>{cargo.mass} т</strong>
              {' · Объём '}
              <strong>{volume} м³</strong>
            </span>
          </div>
        </Card.Body>
      </Link>
    </Card>
  );
}
