import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../components/Media';
import {
  useAppDispatch, useAppSelector, loadCargoFeed,
  setCargoInterest, deleteCargo, nextCargo, selectBusy,
} from '../store/store';

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
  const dispatch = useAppDispatch();
  const { feed: cargo, user } = useAppSelector(s => s.cargo);
  const busy = useAppSelector(selectBusy);
  const rawId = params.get('cargo') || id;
  const selectedId = rawId ? Number(rawId) : undefined;
  useEffect(() => {
    if (selectedId !== undefined
      && (!Number.isInteger(selectedId) || selectedId <= 0)) return;
    void dispatch(loadCargoFeed(selectedId));
  }, [dispatch, selectedId, user]);

  async function showNextCargo() {
    if (!cargo || busy) return;
    // Thunk сам выбирает API или гостевой mock при недоступном API.
    const result = await dispatch(nextCargo(cargo.id));
    if (nextCargo.fulfilled.match(result) && result.payload.data) {
      setParams({ cargo: String(result.payload.data.id) });
    }
  }
  async function remove() {
    if (!cargo) return;
    const result = await dispatch(deleteCargo(cargo.id));
    if (deleteCargo.fulfilled.match(result)) {
      setParams({});
      void dispatch(loadCargoFeed(undefined));
    }
  }
  if (!cargo) return <div className="stranica-s-vkladkami">
    {!busy && <p>Груз не найден.</p>}
  </div>;
  const volume = cargo.volume?.toFixed(2) ?? '—';

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
              <dd>{cargo.mass ?? '—'} т</dd>
            </div>
            <div>
              <dt>Объём</dt>
              <dd>{volume} м³</dd>
            </div>
          </dl>
          <div className="ikonki-sprava">
            <button className="otmetka-interesa"
              disabled={!user || busy}
              aria-label={cargo.isLiked && user ? 'Снять лайк' : 'Лайк'}
              aria-pressed={!!user && cargo.isLiked}
              onClick={() => dispatch(setCargoInterest({
                id: cargo.id, interest: cargo.isLiked ? 0 : 1,
              }))}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={HEART_PATH} />
              </svg>
              <span className="kolichestvo-otmetok">
                {cargo.interest}
              </span>
            </button>
            <Button
              className="ikonka-sleduyushchiy"
              variant="link"
              onClick={showNextCargo}
              disabled={busy}
              aria-label="Следующий груз"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Далее</span>
            </Button>
            {user && cargo.isCreator && <Button
              className="delete-btn" onClick={remove}
              disabled={busy}>Удалить</Button>}
          </div>
        </aside>
      </div>
    </section>
  );
}
