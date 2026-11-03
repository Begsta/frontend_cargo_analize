import { useEffect, useState } from 'react';
import type { Cargo } from '../data';

export const DEFAULT_IMAGE = '/media/default-cargo.jpg';
export const DEFAULT_VIDEO = '/media/default.mp4';

type MediaProps = {
  cargo: Cargo;
};

export function Media({ cargo }: MediaProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [cargo.id, cargo.image]);

  function handleError() {
    if (!failed) {
      setFailed(true);
    }
  }

  const image = failed ? DEFAULT_IMAGE : cargo.image || DEFAULT_IMAGE;

  return (
    <img src={image} onError={handleError} alt={cargo.name} />
  );
}
