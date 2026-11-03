import { useState } from 'react';
import { CargoCard } from '../components/CargoCard';
import { CargoFilters } from '../components/CargoFilters';
import { cargos } from '../data';

export function Catalog() {
  const [mass, setMass] = useState(0);
  const [appliedMass, setAppliedMass] = useState(0);
  const items = cargos.filter(cargo => cargo.mass >= appliedMass);

  function applyFilter() {
    setAppliedMass(mass);
  }

  return (
    <div className="stranica-s-vkladkami">
      <header className="shapka-chernovika">
        <span className="znak-wolff">WOLFF</span>
        <h1 className="zagolovok-stranicy">Каталог грузов</h1>
      </header>
      <p className="podskazka-filtra">
        Фильтр по массе груза, т. Значение 0 — все опубликованные.
        Число справа обновится после «Отобрать».
      </p>
      <CargoFilters
        value={mass}
        onChange={setMass}
        onApply={applyFilter}
      />
      <div className="setka-gruzov">
        {items.map(cargo => (
          <CargoCard key={cargo.id} cargo={cargo} />
        ))}
      </div>
      {!items.length && (
        <p className="empty">
          Грузы не найдены. Уменьшите массу и нажмите «Отобрать».
        </p>
      )}
    </div>
  );
}
