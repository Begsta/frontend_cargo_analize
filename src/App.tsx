import { useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { BottomNavigation } from './components/BottomNavigation';
import { Addition } from './pages/Addition';
import { Catalog } from './pages/Catalog';
import { Feed } from './pages/Feed';
import { Login } from './pages/Login';
import { RequestStatus } from './components/RequestStatus';

export function App() {
  useEffect(() => {
    document.title = 'WOLFF • Каталог грузов';
  }, []);

  return (
    <div className="rama-telefona">
      <RequestStatus />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
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
