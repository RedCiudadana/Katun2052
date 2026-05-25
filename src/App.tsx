import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import KatunHome from './pages/KatunHome';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import DimensionDetail from './pages/DimensionDetail';
import DimensionArticles from './pages/DimensionArticles';
import KatunCalendar from './pages/KatunCalendar';
import Survey from './pages/Survey';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import Loader from './components/loader';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminComments from './pages/admin/AdminComments';
import AdminSurvey from './pages/admin/AdminSurvey';
import AdminPress from './pages/admin/AdminPress';
import SalaDePrensaPage from './pages/SalaDePrensaPage';
import PressPostDetail from './pages/PressPostDetail';
import AdminGuard from './components/AdminGuard';
import { AuthProvider } from './context/AuthContext';

function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <Header />
      <SocialSidebar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin routes — no public layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="documentos" element={<AdminDocuments />} />
            <Route path="comentarios" element={<AdminComments />} />
            <Route path="encuesta" element={<AdminSurvey />} />
            <Route path="prensa" element={<AdminPress />} />
          </Route>

          {/* Public routes */}
          <Route
            path="/*"
            element={
              <LoaderWrapper>
                <PublicLayout>
                  <Routes>
                    <Route path="/" element={<KatunHome />} />
                    <Route path="/documentos" element={<Documents />} />
                    <Route path="/documento/:id" element={<DocumentDetail />} />
                    <Route path="/dimension/:dimensionCode" element={<DimensionDetail />} />
                    <Route path="/dimension-articulos/:slug" element={<DimensionArticles />} />
                    <Route path="/calendario" element={<KatunCalendar />} />
                    <Route path="/encuesta" element={<Survey />} />
                    <Route path="/sala-de-prensa" element={<SalaDePrensaPage />} />
                    <Route path="/sala-de-prensa/:slug" element={<PressPostDetail />} />
                    <Route path="/privacidad" element={<PrivacyPolicy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PublicLayout>
              </LoaderWrapper>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
