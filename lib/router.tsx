import React, { useState, useEffect, createContext, useContext, ReactNode, useLayoutEffect } from 'react';

// Type Definitions
interface RouteProps {
  path?: string;
  children?: ReactNode;
  component?: React.FC<any>;
}

interface RouterContextType {
  location: string;
  navigate: (to: string) => void;
}

// Path Matching Logic
const matchPath = (locationPath: string, routePath: string): { matches: boolean; params: Record<string, string> } => {
  const pathSegments = routePath.split('/').filter(Boolean);
  const locationSegments = locationPath.split('/').filter(Boolean);

  const isWildcard = routePath.endsWith('*');
  if (!isWildcard && pathSegments.length !== locationSegments.length) {
    return { matches: false, params: {} };
  }
  
  if (isWildcard && locationSegments.length < pathSegments.length - 1) {
    return { matches: false, params: {} };
  }
  
  const params: Record<string, string> = {};
  const segmentsToMatch = isWildcard ? pathSegments.slice(0, -1) : pathSegments;

  for (let i = 0; i < segmentsToMatch.length; i++) {
    const pathSegment = segmentsToMatch[i];
    const locationSegment = locationSegments[i];

    if (!locationSegment && pathSegment !== undefined) {
      return { matches: false, params: {} };
    }

    if (pathSegment.startsWith(':')) {
      params[pathSegment.substring(1)] = locationSegment;
    } else if (pathSegment !== locationSegment) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
};

// Context and Hook
const RouterContext = createContext<RouterContextType | null>(null);

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within a Router component');
  return context;
};

// Router Provider
export const Router: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use state for location, completely decoupled from browser URL.
  const [location, setLocation] = useState('/');

  const navigate = (to: string) => {
    const pathname = to.split('?')[0];
    setLocation(pathname);
  };

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

// Components
export const Route: React.FC<RouteProps> = ({ path, component: Component, children }) => {
  const { location } = useRouter();

  if (!path) {
    return Component ? <Component /> : <>{children}</>;
  }

  const { matches, params } = matchPath(location, path);

  if (!matches) return null;
  
  return Component ? <Component params={params} /> : <>{children}</>;
};

export const Switch: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { location } = useRouter();

  let match: React.ReactElement | null = null;
  let defaultRoute: React.ReactElement | null = null;

  React.Children.forEach(children, child => {
    if (match === null && React.isValidElement<RouteProps>(child)) {
      if (child.props.path) {
        if (matchPath(location, child.props.path).matches) {
          match = child;
        }
      } else if (defaultRoute === null) {
        defaultRoute = child;
      }
    }
  });

  return match || defaultRoute;
};

export const Link: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const { navigate } = useRouter();
  const child = React.Children.only(children);

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  if (!React.isValidElement(child)) {
    return (
      <span
        onClick={handleNavigate}
        onKeyDown={(e) => { if (e.key === 'Enter') handleNavigate(e as any); }}
        role="link"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </span>
    );
  }
  
  const childOnClick = (child.props as any).onClick;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (childOnClick) {
      childOnClick(e);
    }
    handleNavigate(e);
  };

  // Clone the child element, but without an `href` attribute.
  // Navigation is handled entirely by our `onClick` handler.
  return React.cloneElement(child as React.ReactElement<any>, {
    onClick: handleClick,
  });
};

export const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const { navigate } = useRouter();
  useLayoutEffect(() => {
    navigate(to);
  }, [to, navigate]);

  return null;
};

// Custom hooks to replace wouter's hooks
export const useLocation = (): [string, (to: string) => void] => {
    const { location, navigate } = useRouter();
    return [location, navigate];
}

export const useRoute = (path: string): [boolean, Record<string, string> | null] => {
  const { location } = useRouter();
  const { matches, params } = matchPath(location, path);
  return [matches, matches ? params : null];
};
