import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './loader';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

export default AdminGuard;
