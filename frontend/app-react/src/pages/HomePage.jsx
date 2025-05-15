import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import UserProfile from '../components/auth/UserProfile';
import './Pages.css';

const HomePage = ({ user, onLogout }) => {
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page d'authentification
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="home-page">
      <h1>Bienvenue sur la Todo List</h1>
      <UserProfile user={user} onLogout={onLogout} />      <p>Vous êtes connecté et pouvez maintenant gérer vos tâches.</p>
      <div className="action-buttons">
        <a href="/todos" className="home-button">
          Voir mes tâches
        </a>
        <a href="/profile" className="home-button">
          Mon profil
        </a>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func
};

export default HomePage;
