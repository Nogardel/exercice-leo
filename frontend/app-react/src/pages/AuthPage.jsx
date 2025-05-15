import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/auth/AuthContainer';
import './Pages.css';

const AuthPage = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = (user) => {
    console.log('Authentification réussie:', user);
    // Rediriger vers la page d'accueil
    navigate('/');
  };

  return (
    <div className="auth-page">
      <AuthContainer 
        onLoginSuccess={handleAuthSuccess} 
        onRegisterSuccess={handleAuthSuccess} 
      />
    </div>
  );
};

export default AuthPage;
