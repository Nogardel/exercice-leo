import PropTypes from 'prop-types';
import { logout } from '../../services/authService';
import './AuthForms.css';

const UserProfile = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await logout();
      // Appeler la fonction de callback pour indiquer la déconnexion
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Gérer l'erreur si nécessaire
    }
  };

  // Fonction pour obtenir les initiales de l'utilisateur pour l'avatar
  const getInitials = () => {
    if (!user || !user.displayName) return '?';
    
    const names = user.displayName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  if (!user) return null;

  return (    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">{getInitials()}</div>
        <div className="user-details">
          <div className="user-name">{user.displayName || 'Utilisateur'}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>
      <div className="user-actions">
        <a href="/profile" className="profile-link" title="Voir mon profil">
          Mon profil
        </a>
        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    uid: PropTypes.string
  }),
  onLogout: PropTypes.func
};

export default UserProfile;
