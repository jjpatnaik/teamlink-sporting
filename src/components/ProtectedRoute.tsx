
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute check:', { user: !!user, profile: !!profile, requiredRole });
      
      if (!user) {
        console.log('No user, redirecting to auth');
        navigate('/auth');
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        console.log(`User lacks required role: ${requiredRole}, redirecting to home`);
        navigate('/');
        return;
      }
    }
  }, [user, profile, loading, requiredRole, hasRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
