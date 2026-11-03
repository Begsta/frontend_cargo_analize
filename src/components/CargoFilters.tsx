import type { FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';

type CargoFiltersProps = {
  value: number;
  onChange: (mass: number) => void;
  onApply: () => void;
};

export function CargoFilters({
  value,
  onChange,
  onApply,
}: CargoFiltersProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply();
  }

  return (
    <Form className="forma-massy" onSubmit={handleSubmit}>
      <div className="shapka-polzunka">
        <Form.Label htmlFor="cargo_mass">Масса, т</Form.Label>
        <output className="znachenie-polzunka" htmlFor="cargo_mass">
          {value.toFixed(1)}
        </output>
      </div>
      <div className="obertka-polzunka">
        <Form.Range
          id="cargo_mass"
          min={0}
          max={10}
          step={0.1}
          list="metki-massy"
          value={value}
          onChange={event => onChange(Number(event.target.value))}
        />
      </div>
      <datalist id="metki-massy">
        {[0, 2, 4, 6, 8, 10].map(mass => (
          <option key={mass} value={mass} label={String(mass)} />
        ))}
      </datalist>
      <div className="metki-polzunka">
        <span>0</span>
        <span>10</span>
      </div>
      <Button type="submit" variant="light">Отобрать</Button>
    </Form>
  );
}
