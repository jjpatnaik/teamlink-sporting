import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  // Route-specific breadcrumb mappings
  const routeMap: Record<string, string> = {
    'search': 'Search',
    'teams': 'Teams',
    'tournaments': 'Tournaments',
    'players': 'Players',
    'sponsors': 'Sponsors',
    'auth': 'Authentication',
    'login': 'Sign In',
    'signup': 'Sign Up',
    'createprofile': 'Create Profile',
    'edit-profile': 'Edit Profile',
    'organiser': 'Organizer',
    'tournament': 'Tournament',
    'player': 'Player Profile',
    'team': 'Team Details',
    'sponsor': 'Sponsor Profile',
    'connections': 'Connections',
    'how-it-works': 'How It Works'
  };

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Handle special cases
    if (segment === 'organiser' && segments[index + 1] === 'tournament') {
      breadcrumbs.push({ label: 'Organizer Panel', path: currentPath });
      return;
    }
    
    if (segments[index - 1] === 'organiser' && segment === 'tournament') {
      return; // Skip as it's handled above
    }

    // Handle dynamic routes (UUIDs)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
    
    if (isUUID) {
      // For UUID segments, use context from previous segment
      const previousSegment = segments[index - 1];
      if (previousSegment === 'player') {
        breadcrumbs.push({ label: 'Profile Details' });
      } else if (previousSegment === 'team') {
        breadcrumbs.push({ label: 'Team Details' });
      } else if (previousSegment === 'tournament') {
        breadcrumbs.push({ label: 'Tournament Details' });
      } else {
        breadcrumbs.push({ label: 'Details' });
      }
    } else {
      const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Don't add link for the last segment (current page)
      if (index === segments.length - 1) {
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, path: currentPath });
      }
    }
  });

  return breadcrumbs;
};

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.path ? (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.path}
                        className="flex items-center hover:text-primary transition-colors duration-200"
                      >
                        {index === 0 && <Home className="mr-1 h-4 w-4" />}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="flex items-center font-medium text-foreground">
                      {index === 0 && <Home className="mr-1 h-4 w-4" />}
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbNavigation;