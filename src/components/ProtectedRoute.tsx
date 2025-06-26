
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
      if (!user) {
        navigate('/auth');
        return;
      }

      // Only redirect to create profile if we're on a route that specifically requires a profile
      // and the user doesn't have one. Let other routes handle their own profile checks.
      if (!profile && window.location.pathname.startsWith('/createprofile')) {
        // User is already on the create profile page, let them stay
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        // If user doesn't have required role, redirect to home instead of create profile
        navigate('/');
        return;
      }
    }
  }, [user, profile, loading, requiredRole, hasRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
