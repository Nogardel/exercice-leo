/**
 * Service pour gérer les opérations liées aux todos
 */

/**
 * Récupère tous les todos depuis l'API
 * @param {string} userId - L'ID de l'utilisateur dont on veut récupérer les todos
 * @returns {Promise} Une promesse qui se résout avec les données des todos
 */
export const fetchTodos = async (userId) => {
  try {
    console.log(
      `fetchTodos - Envoi de la requête GET /api/todos avec userId=${userId}`
    );
    const url = userId ? `/api/todos?userId=${userId}` : "/api/todos";
    const response = await fetch(url);
    console.log("fetchTodos - Statut de la réponse:", response.status);

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des todos: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`fetchTodos - ${data.length} todos récupérés`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des todos:", error);
    throw error;
  }
};

/**
 * Ajoute une nouvelle tâche via l'API
 * @param {string} text - Le texte de la nouvelle tâche
 * @param {string} userId - L'ID de l'utilisateur propriétaire de la tâche
 * @returns {Promise} Une promesse qui se résout avec la tâche créée
 */
export const addTodo = async (text, userId) => {
  try {
    console.log(
      `addTodo - Envoi de la requête POST /api/todos avec text="${text}" et userId=${userId}`
    );
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, userId }),
    });

    console.log("addTodo - Statut de la réponse:", response.status);

    if (!response.ok) {
      throw new Error(
        `Erreur lors de l'ajout d'une tâche: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("addTodo - Nouvelle tâche créée:", data);
    return data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une tâche:", error);
    throw error;
  }
};

/**
 * Supprime une tâche via l'API
 * @param {number} id - L'ID de la tâche à supprimer
 * @returns {Promise} Une promesse qui se résout quand la tâche est supprimée
 */
export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la tâche");
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    throw error;
  }
};

/**
 * Met à jour l'état d'une tâche via l'API
 * @param {number} id - L'ID de la tâche à mettre à jour
 * @param {object} updates - Les champs à mettre à jour (par exemple {done: true})
 * @returns {Promise} Une promesse qui se résout avec la tâche mise à jour
 */
export const updateTodo = async (id, updates) => {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de la tâche");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
    throw error;
  }
};

/**
 * Récupère le message de bienvenue depuis l'API
 * @returns {Promise} Une promesse qui se résout avec le message
 */
export const fetchWelcomeMessage = async () => {
  try {
    console.log("fetchWelcomeMessage - Envoi de la requête GET /api/message");
    const response = await fetch("/api/message");
    console.log("fetchWelcomeMessage - Statut de la réponse:", response.status);

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération du message: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("fetchWelcomeMessage - Message reçu:", data.message);
    return data.message;
  } catch (error) {
    console.error("Erreur lors de la récupération du message:", error);
    throw error;
  }
};

/**
 * Récupère uniquement les tâches terminées depuis l'API
 * @param {string} userId - L'ID de l'utilisateur dont on veut récupérer les todos terminés
 * @returns {Promise} Une promesse qui se résout avec les données des todos terminés
 */
export const fetchDoneTodos = async (userId) => {
  try {
    console.log(
      `fetchDoneTodos - Envoi de la requête GET /api/todos/done avec userId=${userId}`
    );
    const url = userId ? `/api/todos/done?userId=${userId}` : "/api/todos/done";
    const response = await fetch(url);
    console.log("fetchDoneTodos - Statut de la réponse:", response.status);

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des todos terminés: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`fetchDoneTodos - ${data.length} todos terminés récupérés`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des todos terminés:", error);
    throw error;
  }
};
