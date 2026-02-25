import React, { useEffect, useState } from 'react';
import { HashRouter  as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import KatunHome from './pages/KatunHome';
import Documents from './pages/Documents';
import DimensionDetail from './pages/DimensionDetail';
import KatunCalendar from './pages/KatunCalendar';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import Loader from './components/loader';

function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simula un pequeño retardo para mostrar el loader (ajusta según tus necesidades)
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <div style={{ display: loading ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
}

function App() {
  return (
      <Router>
        <LoaderWrapper>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopBar />
            <Header />
            <main className="flex-1 pt-16">
              <Routes>
                <Route path="/" element={<KatunHome />} />
                <Route path="/documentos" element={<Documents />} />
                <Route path="/dimension/:dimensionCode" element={<DimensionDetail />} />
                <Route path="/calendario" element={<KatunCalendar />} />
                <Route path="/privacidad" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </LoaderWrapper>
      </Router>
  );
}

export default App;