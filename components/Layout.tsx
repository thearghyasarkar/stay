import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Icon } from './UI';
import { auth, signOut } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: 'book', label: 'Journal' },
    { path: '/repository', icon: 'archive', label: 'Repository' },
    { path: '/search', icon: 'search', label: 'Search' },
    { path: '/important', icon: 'star', label: 'Important' },
  ];

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row max-w-7xl mx-auto overflow-hidden bg-paper-light dark:bg-paper-dark">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex-none flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-paper-light/95 dark:bg-paper-dark/95 backdrop-blur z-50">
         <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center text-white dark:text-black font-serif font-bold italic">
              s.
            </div>
            <h1 className="text-large font-serif font-bold tracking-tight">stay.</h1>
         </div>
         <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full active:bg-stone-100 dark:active:bg-stone-800 text-stone-500 transition-colors"
            >
              {darkMode ? <Icon name="sun" size={15} /> : <Icon name="moon" size={15} />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full active:bg-stone-100 dark:active:bg-stone-800 text-stone-500 transition-colors"
            >
              <Icon name="log-out" size={15} />
            </button>
         </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full border-r border-stone-200 dark:border-stone-800 p-6 bg-paper-light dark:bg-paper-dark z-50">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center text-white dark:text-black font-serif font-bold italic">
            s.
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">stay.</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${location.pathname === item.path 
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium' 
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50'}
              `}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 mt-auto pt-6 border-t border-stone-200 dark:border-stone-800">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
          >
            {darkMode ? <Icon name="sun" size={20} /> : <Icon name="moon" size={20} />}
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors ml-auto"
          >
            <Icon name="log-out" size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar" id="main-scroll">
        <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-full flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Fixed */}
      <nav className="md:hidden flex-none bg-white/90 dark:bg-stone-900/90 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 pb-safe">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px]
                ${location.pathname === item.path 
                  ? 'text-stone-900 dark:text-stone-100' 
                  : 'text-stone-400 dark:text-stone-600'}
              `}
            >
              <Icon name={item.icon} size={22} className={location.pathname === item.path ? "fill-current opacity-20" : ""} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;