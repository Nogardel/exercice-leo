import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthForms.css';

const AuthContainer = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [activeForm, setActiveForm] = useState('login'); // 'login' ou 'register'

  const toggleForm = () => {
    setActiveForm(activeForm === 'login' ? 'register' : 'login');
  };

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button 
          className={`auth-tab ${activeForm === 'login' ? 'active' : ''}`}
          onClick={() => setActiveForm('login')}
        >
          Connexion
        </button>
        <button 
          className={`auth-tab ${activeForm === 'register' ? 'active' : ''}`}
          onClick={() => setActiveForm('register')}
        >
          Inscription
        </button>
      </div>
      
      <div className="auth-content">
        {activeForm === 'login' ? (
          <Login onLoginSuccess={onLoginSuccess} />
        ) : (
          <Register onRegisterSuccess={onRegisterSuccess} />
        )}
      </div>
      
      <div className="auth-footer">
        {activeForm === 'login' ? (
          <p>
            Pas encore de compte ?{' '}
            <button className="auth-text-button" onClick={toggleForm}>
              S'inscrire
            </button>
          </p>
        ) : (
          <p>
            Déjà un compte ?{' '}
            <button className="auth-text-button" onClick={toggleForm}>
              Se connecter
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
