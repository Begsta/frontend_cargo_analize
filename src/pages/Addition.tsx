import { Button, Form } from 'react-bootstrap';
import { cargos } from '../data';
import {
  DEFAULT_IMAGE,
  DEFAULT_VIDEO,
  Media,
} from '../components/Media';

export function Addition() {
  const cargo = cargos[0];

  return (
    <div className="stranica-s-vkladkami">
      <header className="shapka-chernovika">
        <span className="znak-wolff">WOLFF</span>
        <h1 className="zagolovok-stranicy">Добавление груза</h1>
      </header>
      <section className="blok-minio">
        <h2>Изображение</h2>
        <div className="prevyu-minio">
          <Media cargo={cargo} />
        </div>
        <Form.Control
          className="pole-fayla"
          type="file"
          accept="image/*"
          aria-label="Файл изображения"
          disabled
        />
      </section>
      <section className="blok-minio">
        <h2>Видео цикла</h2>
        <video
          className="prevyu-minio"
          src={cargo.video || DEFAULT_VIDEO}
          poster={cargo.image || DEFAULT_IMAGE}
          muted
          controls
        />
        <Form.Control
          className="pole-fayla"
          type="file"
          accept="video/*"
          aria-label="Файл видео"
          disabled
        />
      </section>
      <Form onSubmit={event => event.preventDefault()}>
        <Form.Label className="metka-polya" htmlFor="cargo_name">
          Наименование груза
        </Form.Label>
        <Form.Control
          className="pole-gruza"
          id="cargo_name"
          type="text"
          maxLength={256}
          disabled
        />
        <Button className="knopka-deystviya" type="submit" disabled>
          Далее
        </Button>
      </Form>
    </div>
  );
}
