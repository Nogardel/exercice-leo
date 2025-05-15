import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { updateProfile } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useNotification } from '../contexts/NotificationContext';
import UserProfile from '../components/auth/UserProfile';
import './Pages.css';

const ProfilePage = ({ user, onLogout }) => {
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Mettre à jour l'état du prénom lorsque l'utilisateur change
  useEffect(() => {
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page d'authentification
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDisplayName(user.displayName || '');
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      showError('Le nom d\'utilisateur ne peut pas être vide', 'Erreur');
      return;
    }

    setIsLoading(true);
    try {
      // Mettre à jour le profil utilisateur
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      showSuccess('Profil mis à jour avec succès', 'Succès');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      showError('Erreur lors de la mise à jour du profil', 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="header-container">
        <h1>Mon Profil</h1>
      </div>

      <div className="profile-container">
        <div className="profile-header">
          <div className="user-avatar large">{user.displayName ? user.displayName[0].toUpperCase() : '?'}</div>
          <h2>{user.displayName || 'Utilisateur'}</h2>
        </div>

        <div className="profile-details">
          {isEditing ? (
            <div className="edit-profile-form">
              <div className="form-group">
                <label htmlFor="displayName">Nom d'utilisateur</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Votre nom d'utilisateur"
                  required
                />
              </div>
              
              <div className="profile-email">
                <label>Email</label>
                <p>{user.email}</p>
                <small>L'email ne peut pas être modifié</small>
              </div>

              <div className="profile-actions">
                <button 
                  className="profile-button cancel" 
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button 
                  className="profile-button save" 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-info">
                <div className="profile-item">
                  <label>Nom d'utilisateur</label>
                  <p>{user.displayName || 'Non défini'}</p>
                </div>
                
                <div className="profile-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>

                <div className="profile-item">
                  <label>ID Utilisateur</label>
                  <p className="uid">{user.uid}</p>
                </div>

                <div className="profile-item">
                  <label>Compte créé le</label>
                  <p>{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Information non disponible'}</p>
                </div>

                <div className="profile-item">
                  <label>Dernière connexion</label>
                  <p>{user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Information non disponible'}</p>
                </div>
              </div>

              <div className="profile-actions">
                <button className="profile-button edit" onClick={handleEditProfile}>
                  Modifier le profil
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="navigation-links">
        <a href="/" className="nav-link">Retour à l'accueil</a>
        <a href="/todos" className="nav-link">Mes tâches</a>
        <button className="nav-link logout" onClick={onLogout}>Déconnexion</button>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func
};

export default ProfilePage;
