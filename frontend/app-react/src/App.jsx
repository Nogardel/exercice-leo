import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import { logout } from './services/authService';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';
import Loader from './components/Loader';
import { NotificationProvider } from './contexts/NotificationContext';

console.log('App.jsx chargé');

function App() {
  const { currentUser, loading } = useAuth();
  const [theme, setTheme] = useState('light');

  // Effet pour récupérer le thème depuis localStorage au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Fonction pour changer de thème
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  // Afficher le loader pendant le chargement de l'authentification
  if (loading) {
    return <Loader text="Initialisation de l'application..." />;
  }

  return (
    <NotificationProvider>
      <div className="app-container">
        <div className="theme-toggle-container">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            title={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <Routes>
          <Route path="/" element={
            currentUser ? <HomePage user={currentUser} onLogout={handleLogout} /> : <Navigate to="/auth" />
          } />
          <Route path="/auth" element={
            currentUser ? <Navigate to="/" /> : <AuthPage />
          } />
          <Route path="/todos" element={
            <TodoPage user={currentUser} onLogout={handleLogout} />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </NotificationProvider>
  );
}

export default App;