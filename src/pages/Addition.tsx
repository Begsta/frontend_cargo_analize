import { useEffect, useState, type FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  useAppDispatch, useAppSelector, loadCargoDraft,
  createCargoDraft, publishCargo, selectBusy,
} from '../store/store';
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../components/Media';

export function Addition() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, draft } = useAppSelector(s => s.cargo);
  const busy = useAppSelector(selectBusy);
  const [name, setName] = useState('');
  const [image, setImage] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [description, setDescription] = useState('');
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('');
  useEffect(() => {
    if (user) void dispatch(loadCargoDraft());
  }, [dispatch, user]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || !user) return;
    if (!draft) {
      if (image && video) {
        await dispatch(createCargoDraft({
          cargo_name: name, image, video,
        }));
      }
    } else {
      const result = await dispatch(publishCargo({
        id: draft.id,
        body: {
          cargo_description: description || null,
          cargo_mass: mass === '' ? null : Number(mass),
          cargo_volume: volume === '' ? null : Number(volume),
        },
      }));
      if (publishCargo.fulfilled.match(result)) navigate('/catalog');
    }
  }
  return <div className="stranica-s-vkladkami">
    <header className="shapka-chernovika">
      <span className="znak-wolff">WOLFF</span>
      <h1 className="zagolovok-stranicy">Добавление груза</h1>
    </header>
    {!user ? <p>Для добавления груза <Link to="/login">
      войдите в систему</Link>.</p> : (
      <Form onSubmit={submit}>
        <fieldset disabled={busy}>
          <section className="blok-minio">
            <h2>Изображение</h2>
            <img className="prevyu-minio" alt="Изображение груза"
              src={draft?.image || DEFAULT_IMAGE} />
            {!draft && <Form.Control type="file" required
              className="pole-fayla" aria-label="Файл изображения"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={e => setImage(
                (e.target as HTMLInputElement).files?.[0],
              )} />}
          </section>
          <section className="blok-minio">
            <h2>Видео цикла</h2>
            <video className="prevyu-minio" controls muted
              src={draft?.video || DEFAULT_VIDEO} />
            {!draft && <Form.Control type="file" required
              className="pole-fayla" aria-label="Файл видео"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={e => setVideo(
                (e.target as HTMLInputElement).files?.[0],
              )} />}
          </section>
          <Form.Label htmlFor="cargo_name">
            Наименование груза
          </Form.Label>
          <Form.Control id="cargo_name" className="pole-gruza"
            required maxLength={256} disabled={!!draft}
            value={draft?.name ?? name}
            onChange={e => setName(e.target.value)} />
          {draft && <>
            <Form.Label htmlFor="description">Описание</Form.Label>
            <Form.Control as="textarea" id="description"
              value={description}
              onChange={e => setDescription(e.target.value)} />
            <Form.Label htmlFor="mass">Масса, т</Form.Label>
            <Form.Control id="mass" type="number" min={0}
              step="any" value={mass}
              onChange={e => setMass(e.target.value)} />
            <Form.Label htmlFor="volume">Объём, м³</Form.Label>
            <Form.Control id="volume" type="number" min={0}
              step="any" value={volume}
              onChange={e => setVolume(e.target.value)} />
          </>}
          <Button type="submit" className="knopka-deystviya">
            {draft ? 'Опубликовать' : 'Далее'}
          </Button>
        </fieldset>
      </Form>
    )}
  </div>;
}
