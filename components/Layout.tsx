import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APIS } from '../constants';
import { Menu, X, BookOpen, Layers, ShieldCheck } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Layers className="text-blue-400" />
            API Master
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 h-[calc(100vh-64px)] scrollbar-thin scrollbar-thumb-slate-700">
          <Link 
            to="/" 
            className={`block px-4 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/tutorial" 
            className={`block px-4 py-2 rounded-md transition-colors ${location.pathname === '/tutorial' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
            onClick={() => setSidebarOpen(false)}
          >
            First Integration (Guide)
          </Link>

          <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            API Directory
          </div>
          
          {APIS.map(api => (
            <Link
              key={api.id}
              to={`/api/${api.id}`}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors ${location.pathname === `/api/${api.id}` ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <span className="truncate">{api.name}</span>
              {api.authRequired && <ShieldCheck size={12} className="text-amber-500" />}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-30 flex items-center p-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-semibold text-lg">API Masterclass</span>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;