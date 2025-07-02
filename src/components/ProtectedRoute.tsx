
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requireProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requireProfile = false 
}) => {
  const { user, profile, loading, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute check:', { user: !!user, profile: !!profile, requiredRole });
      
      if (!user) {
        console.log('No user, redirecting to auth');
        navigate('/auth', { state: { from: location.pathname } });
        return;
      }

      // Check if user needs to complete profile setup
      if (requireProfile && !profile && location.pathname !== '/createprofile') {
        console.log('Profile required but not found, redirecting to profile setup');
        navigate('/createprofile');
        return;
      }

      // Show onboarding for new users without profiles (except on profile creation pages)
      if (!profile && !location.pathname.includes('/createprofile') && !location.pathname.includes('/onboarding')) {
        console.log('New user without profile, showing onboarding');
        navigate('/onboarding');
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        console.log(`User lacks required role: ${requiredRole}, redirecting to home`);
        navigate('/');
        return;
      }
    }
  }, [user, profile, loading, requiredRole, hasRole, navigate, location.pathname, requireProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <span className="text-gray-600">Loading...</span>
        </div>
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
