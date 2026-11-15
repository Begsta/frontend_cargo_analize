import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './App';
import { cargoReducer, authFinished } from './store/store';
import { mockCargos } from './api/cargo';

function render(user: boolean) {
  const initial = cargoReducer(undefined, { type: 'init' });
  const state = user ? cargoReducer(initial, authFinished({
    user_id: 1, user_login: 'test', user_name: 'Студент',
  })) : initial;
  // API может прислать is_creator по cookie после F5.
  const preloaded = { ...state,
    catalog: [{ ...mockCargos[0], isCreator: true }] };
  const store = configureStore({ reducer: { cargo: cargoReducer },
    preloadedState: { cargo: preloaded } });
  return renderToString(<Provider store={store}>
    <MemoryRouter initialEntries={['/catalog']}><App /></MemoryRouter>
  </Provider>);
}
describe('Интерфейс гостя и пользователя', () => {
  it('гость видит вход, без удаления даже с is_creator от API', () => {
    const html = render(false);
    expect(html).toContain('Вход');
    expect(html).not.toContain('Удалить');
    expect(html).not.toContain('Выход');
  });
  it('пользователь видит выход, добавление и удаление своего груза', () => {
    const html = render(true);
    expect(html).toContain('Выход');
    expect(html).toContain('Удалить');
    expect(html).toContain('href="/cargo_addition"');
  });
});
