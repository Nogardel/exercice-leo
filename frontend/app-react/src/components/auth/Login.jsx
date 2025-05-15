import { useState } from 'react';
import { login } from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';
import './AuthForms.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation basique
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      const user = await login(email, password);
      console.log('Utilisateur connecté:', user);
      
      // Réinitialiser les champs et indiquer le succès
      setEmail('');
      setPassword('');
      
      // Appeler la fonction de callback pour indiquer la connexion réussie
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      showSuccess('Connexion réussie', 'Bienvenue !');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError(error.message || 'Échec de la connexion');
      showError(error.message || 'Échec de la connexion', 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Connexion</h2>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Votre mot de passe"
            required
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default Login;
