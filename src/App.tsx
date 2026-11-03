import { useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { BottomNavigation } from './components/BottomNavigation';
import { Addition } from './pages/Addition';
import { Catalog } from './pages/Catalog';
import { Feed } from './pages/Feed';

export function App() {
  useEffect(() => {
    document.title = 'WOLFF • Каталог грузов';
  }, []);

  return (
    <div className="rama-telefona">
      <main>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cargo/:id" element={<Feed />} />
          <Route path="/cargo_addition" element={<Addition />} />
          <Route
            path="*"
            element={(
              <>
                <h1>Страница не найдена</h1>
                <Link to="/">На главную</Link>
              </>
            )}
          />
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
}
