import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Notification from '../components/Notification';

// Créer le contexte de notification
const NotificationContext = createContext();

// Hook personnalisé pour utiliser les notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
};

// Provider pour les notifications
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Ajouter une notification
  const addNotification = (notification) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, ...notification }]);
    return id;
  };

  // Fonctions pour chaque type de notification
  const showSuccess = (message, title = 'Succès', duration = 3000) => {
    return addNotification({ type: 'success', message, title, duration });
  };

  const showError = (message, title = 'Erreur', duration = 5000) => {
    return addNotification({ type: 'error', message, title, duration });
  };

  const showInfo = (message, title = 'Information', duration = 3000) => {
    return addNotification({ type: 'info', message, title, duration });
  };

  const showWarning = (message, title = 'Attention', duration = 4000) => {
    return addNotification({ type: 'warning', message, title, duration });
  };

  // Supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeNotification
      }}
    >
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default NotificationContext;
