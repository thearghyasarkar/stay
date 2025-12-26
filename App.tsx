import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, auth, User } from './firebase';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import RepositoryPage from './pages/RepositoryPage';
import ImportantDatesPage from './pages/ImportantDatesPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-paper-light dark:bg-paper-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 dark:border-stone-200"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        
        <Route path="/*" element={
          user ? (
            <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
              <Routes>
                <Route path="/" element={<HomePage user={user} />} />
                <Route path="/search" element={<SearchPage user={user} />} />
                <Route path="/repository" element={<RepositoryPage user={user} />} />
                <Route path="/important" element={<ImportantDatesPage user={user} />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;