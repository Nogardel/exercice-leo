import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { fetchTodos, addTodo, updateTodo, deleteTodo, fetchDoneTodos } from '../services/todoService';
import UserProfile from '../components/auth/UserProfile';
import Loader from '../components/Loader';
import { useNotification } from '../contexts/NotificationContext';
import './Pages.css';

const TodoPage = ({ user, onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDoneTasks, setShowDoneTasks] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { showSuccess, showError } = useNotification();// Récupération des todos au chargement du composant
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Si l'utilisateur est connecté, on récupère ses todos
        if (user) {
          const data = await fetchTodos(user.uid);
          setTodos(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des todos:", err);
        setError("Impossible de charger les tâches. Veuillez réessayer plus tard.");
        showError("Impossible de charger vos tâches", "Une erreur est survenue lors de la récupération de vos tâches.");
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [user, showError]);
  // Fonction pour charger les tâches terminées
  const loadDoneTodos = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await fetchDoneTodos(user.uid);
        setTodos(data || []);
        setShowDoneTasks(true);
        showSuccess("Affichage des tâches terminées", "Les tâches terminées sont maintenant affichées.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des tâches terminées:", err);
      setError("Impossible de charger les tâches terminées. Veuillez réessayer plus tard.");
      showError("Échec du chargement", "Impossible de charger les tâches terminées. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger toutes les tâches
  const loadAllTodos = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await fetchTodos(user.uid);
        setTodos(data);
        setShowDoneTasks(false);
        showSuccess("Affichage de toutes les tâches", "Toutes les tâches sont maintenant affichées.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des tâches:", err);
      setError("Impossible de charger les tâches. Veuillez réessayer plus tard.");
      showError("Échec du chargement", "Impossible de charger les tâches. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Si l'utilisateur n'est pas connecté, redirection vers la page d'authentification
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Ajout d'une nouvelle tâche
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      setLoading(true);
      // On ajoute l'ID utilisateur à la tâche
      const addedTodo = await addTodo(newTaskText, user.uid);
      setTodos([...todos, addedTodo]);
      setNewTaskText('');
      showSuccess("Tâche ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout d'une tâche:", err);
      setError("Impossible d'ajouter la tâche. Veuillez réessayer plus tard.");
      showError("Impossible d'ajouter la tâche. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };  // Modification de l'état d'une tâche (terminée ou non)
  const handleToggleComplete = async (id, done) => {
    try {
      setLoading(true);
      await updateTodo(id, { done: !done });
      
      // Animation lors du changement d'état
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done: !done, isAnimating: true };
        }
        return todo;
      });
      
      setTodos(updatedTodos);
      
      // Préparer le message de notification
      const actionText = !done ? 'terminée' : 'réactivée';
      showSuccess(`Tâche ${actionText} avec succès !`);
      
      // Planifier la suppression de l'animation
      removeAnimationAfterDelay(id);
    } catch (err) {
      console.error("Erreur lors de la mise à jour d'une tâche:", err);
      setError("Impossible de mettre à jour la tâche. Veuillez réessayer plus tard.");
      showError("Impossible de mettre à jour la tâche. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour supprimer l'animation après un délai
  const removeAnimationAfterDelay = (id) => {
    setTimeout(() => {
      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === id ? { ...todo, isAnimating: false } : todo
      ));
    }, 600);
  };  // Suppression d'une tâche avec animation
  const handleDeleteTask = async (id) => {
    // Ajouter une classe pour l'animation de suppression
    markTaskForDeletion(id);
    
    // Attendre la fin de l'animation avant de supprimer réellement
    setTimeout(() => {
      deleteTaskFromServer(id);
    }, 300);
  };
  
  // Fonction pour marquer une tâche pour la suppression (animation)
  const markTaskForDeletion = (id) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, removing: true } : todo
    ));
  };
  
  // Fonction pour effectuer la suppression réelle sur le serveur
  const deleteTaskFromServer = async (id) => {
    try {
      setLoading(true);
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      showSuccess("Tâche supprimée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression d'une tâche:", err);
      setError("Impossible de supprimer la tâche. Veuillez réessayer plus tard.");
      showError("Impossible de supprimer la tâche. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour la recherche par mot-clé
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };
  // Filtrer les todos en fonction de la recherche
  const filteredTodos = todos.filter(todo => 
    todo.text?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="todo-page">      <div className="header-container">
        <h1>Ma Liste de Tâches</h1>
        <div className="navigation-links header-nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/profile" className="nav-link">Mon profil</Link>
        </div>
        <UserProfile user={user} onLogout={onLogout} />
      </div>

      <div className="todos-container">
        {error && <div className="error-message">{error}</div>}

        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="task-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newTaskText.trim()}>
            Ajouter
          </button>
        </form>

        {/* Barre de recherche */}
        <div className="search-container">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearch}
            placeholder="Rechercher une tâche..."
            className="search-input"
          />
        </div>

        {/* Boutons de filtrage */}
        <div className="filter-buttons">
          <button 
            onClick={showDoneTasks ? loadAllTodos : loadDoneTodos}
            className={`filter-btn ${showDoneTasks ? 'active' : ''}`}
            disabled={loading}
          >
            {showDoneTasks ? 'Afficher toutes les tâches' : 'Afficher uniquement les tâches terminées'}
          </button>
        </div>

        {loading && todos.length === 0 ? (
          <Loader text="Chargement des tâches..." />
        ) : (
          <ul className="todo-list">
            {filteredTodos.length === 0 ? (
              <li className="no-todos">Aucune tâche pour le moment</li>
            ) : (              filteredTodos.map((todo) => (
                <li 
                  key={todo.id} 
                  className={`todo-item ${todo.done ? 'task-done' : ''} ${todo.isAnimating ? 'animating' : ''} ${todo.removing ? 'removing' : ''}`}
                >
                  <div 
                    className="todo-text"
                    onClick={() => handleToggleComplete(todo.id, todo.done)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleToggleComplete(todo.id, todo.done);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Tâche: ${todo.text}, cliquez pour ${todo.done ? 'annuler' : 'terminer'}`}
                  >
                    {todo.text}
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => handleToggleComplete(todo.id, todo.done)}
                      className={`toggle-btn ${todo.done ? 'completed' : ''}`}
                      title={todo.done ? "Marquer comme non terminée" : "Marquer comme terminée"}
                      aria-label={todo.done ? "Marquer comme non terminée" : "Marquer comme terminée"}
                    >
                      {todo.done ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(todo.id)}
                      className="delete-btn"
                      title="Supprimer cette tâche"
                      aria-label="Supprimer cette tâche"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <footer className="todo-footer">
        <Link to="/" className="back-link">Retour à l'accueil</Link>
      </footer>
    </div>
  );
};

TodoPage.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
    displayName: PropTypes.string
  }),
  onLogout: PropTypes.func
};

export default TodoPage;