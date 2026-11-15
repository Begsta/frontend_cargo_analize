import { useEffect } from 'react';
import { CargoCard } from '../components/CargoCard';
import { CargoFilters } from '../components/CargoFilters';
import {
  useAppDispatch, useAppSelector, massChanged,
  filterApplied, loadCargos, selectBusy,
} from '../store/store';

export function Catalog() {
  const dispatch = useAppDispatch();
  const { filters, catalog, user } = useAppSelector(s => s.cargo);
  const busy = useAppSelector(selectBusy);
  useEffect(() => {
    void dispatch(loadCargos());
  }, [dispatch, filters.appliedMass, user]);
  return <div className="stranica-s-vkladkami">
    <header className="shapka-chernovika">
      <span className="znak-wolff">WOLFF</span>
      <h1 className="zagolovok-stranicy">Каталог грузов</h1>
    </header>
    <p className="podskazka-filtra">
      Фильтр по массе груза, т. Значение 0 — все опубликованные.
    </p>
    <fieldset disabled={busy}>
      <CargoFilters value={filters.mass}
        onChange={value => dispatch(massChanged(value))}
        onApply={() => {
          dispatch(filterApplied());
          if (filters.mass === filters.appliedMass) {
            void dispatch(loadCargos());
          }
        }} />
    </fieldset>
    <div className="setka-gruzov">
      {catalog.map(cargo => <CargoCard key={cargo.id} cargo={cargo} />)}
    </div>
    {!busy && !catalog.length && <p className="empty">
      Грузы не найдены.
    </p>}
  </div>;
}
