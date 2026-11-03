import { Button } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../components/Media';
import { cargos, getCargoVolume } from '../data';

const HEART_PATH = [
  'M12 21s-6.5-4.2-9.2-8.1',
  'C.6 10 1.1 6.6 4 5.2',
  '6.2 4.1 8.6 5 12 8.1',
  '15.4 5 17.8 4.1 20 5.2',
  'c2.9 1.4 3.4 4.8 1.2 7.7',
  'C18.5 16.8 12 21 12 21z',
].join(' ');

export function Feed() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('cargo') || id;
  const selectedIndex = cargos.findIndex(cargo => (
    String(cargo.id) === selectedId
  ));
  const index = Math.max(0, selectedIndex);
  const cargo = cargos[index];
  const volume = getCargoVolume(cargo).toFixed(2);

  function showNextCargo() {
    const nextIndex = (index + 1) % cargos.length;
    setParams({ cargo: String(cargos[nextIndex].id) });
  }

  return (
    <section className="ekran-lenty">
      <video
        key={cargo.id}
        className="video-cikla"
        autoPlay
        muted
        loop
        playsInline
        poster={cargo.image || DEFAULT_IMAGE}
        src={cargo.video || DEFAULT_VIDEO}
      />
      <div className="gradient-niz" />
      <div className="sloi-dannyh">
        <div className="kolonka-teksta">
          <span className="znak-wolff">WOLFF</span>
          <h1 className="naimenovanie-gruza">{cargo.name}</h1>
          <details key={cargo.id} className="opisanie-podyoma">
            <summary>Описание груза</summary>
            <p className="tekst-opisaniya">{cargo.description}</p>
          </details>
        </div>
        <aside
          className="kolonka-sprava"
          aria-label="Параметры и действия"
        >
          <dl className="polya-podyoma">
            <div>
              <dt>Масса</dt>
              <dd>{cargo.mass} т</dd>
            </div>
            <div>
              <dt>Объём</dt>
              <dd>{volume} м³</dd>
            </div>
          </dl>
          <div className="ikonki-sprava">
            <div className="otmetka-interesa">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={HEART_PATH} />
              </svg>
              <span className="kolichestvo-otmetok">0</span>
            </div>
            <Button
              className="ikonka-sleduyushchiy"
              variant="link"
              onClick={showNextCargo}
              aria-label="Следующий груз"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Далее</span>
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
