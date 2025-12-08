import React, { useState, useEffect, createContext, useContext } from 'react';
// import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Replacing broken dependency
import Layout from './components/Layout';
import Home from './pages/Home';
import ApiGuide from './pages/ApiGuide';
import Tutorial from './pages/Tutorial';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// --- ROUTER SHIM START ---
// Implementing a lightweight HashRouter to fix missing module errors
export const RouterContext = createContext<{ path: string; params: Record<string, string> }>({ path: '/', params: {} });

export function useLocation() {
  const ctx = useContext(RouterContext);
  return { pathname: ctx.path };
}

export function useParams<T extends Record<string, string> = any>() {
  const ctx = useContext(RouterContext);
  return ctx.params as T;
}

export function Navigate({ to }: { to: string; replace?: boolean }) {
  useEffect(() => {
    // Ensure hash path starts with /
    const target = to.startsWith('/') ? to : '/' + to;
    window.location.hash = target;
  }, [to]);
  return null;
}

export function Link({ to, children, className, onClick }: any) {
  return (
    <a 
      href={`#${to}`} 
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
    >
      {children}
    </a>
  );
}

export function HashRouter({ children }: { children?: React.ReactNode }) {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
        let p = window.location.hash.slice(1);
        if(!p) p = '/';
        setPath(p);
    };
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) window.location.hash = '/';
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <RouterContext.Provider value={{ path, params: {} }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Route({ element }: { path?: string; element: React.ReactNode; index?: boolean }) {
    return <>{element}</>;
}

export function Routes({ children }: { children?: React.ReactNode }) {
  const { pathname } = useLocation();
  let element = null;
  let computedParams = {};

  React.Children.forEach(children, child => {
    if (element) return;
    if (!React.isValidElement(child)) return;

    // @ts-ignore
    const { path } = child.props;
    
    // Exact match or wildcard
    if (path === '*' || path === pathname) {
        element = child;
        return;
    }

    // Param match for patterns like /api/:id
    if (path && path.includes('/:')) {
        const parts = path.split('/');
        const currentParts = pathname.split('/');
        
        if (parts.length === currentParts.length) {
            let match = true;
            const tempParams: any = {};
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].startsWith(':')) {
                    tempParams[parts[i].slice(1)] = currentParts[i];
                } else if (parts[i] !== currentParts[i]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                element = child;
                computedParams = tempParams;
            }
        }
    }
  });

  if (element) {
      return (
          <RouterContext.Provider value={{ path: pathname, params: computedParams }}>
              {element}
          </RouterContext.Provider>
      );
  }
  return null;
}
// --- ROUTER SHIM END ---

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/api/:id" element={<ApiGuide />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;