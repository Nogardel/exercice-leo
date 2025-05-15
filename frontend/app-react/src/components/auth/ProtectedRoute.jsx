import { Navigate } from 'react-router-dom';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion
 */
const ProtectedRoute = ({ children, user, redirectPath = '/auth' }) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
