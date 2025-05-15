// Importation du SDK Firebase Admin
const db = require("./firebaseAdmin");

/**
 * Récupère toutes les tâches depuis Firebase
 * @param {string} userId - ID de l'utilisateur (optionnel)
 * @returns {Promise<Array>} - Promesse qui se résout avec un tableau de tâches
 */
const getAllTasks = async (userId = null) => {
  const snapshot = await db.ref("todos").once("value");
  const data = snapshot.val() || {};

  // Convertir les données en tableau d'objets avec ID
  const tasks = Object.entries(data).map(([id, task]) => ({ id, ...task }));

  // Filtrer par utilisateur si un userId est fourni
  if (userId) {
    return tasks.filter((task) => task.userId === userId);
  }

  return tasks;
};

/**
 * Récupère toutes les tâches terminées depuis Firebase
 * @param {string} userId - ID de l'utilisateur (optionnel)
 * @returns {Promise<Array>} - Promesse qui se résout avec un tableau de tâches terminées
 */
const getDoneTasks = async (userId = null) => {
  const allTasks = await getAllTasks(userId);
  return allTasks.filter((task) => task.done === true);
};

/**
 * Ajoute une nouvelle tâche dans Firebase
 * @param {Object} task - La tâche à ajouter
 * @returns {Promise<Object>} - Promesse qui se résout avec la tâche ajoutée
 */
const addTask = async (task) => {
  const ref = await db.ref("todos").push(task);
  return { id: ref.key, ...task };
};

/**
 * Met à jour une tâche dans Firebase
 * @param {string} id - L'ID de la tâche à mettre à jour
 * @param {Object} updates - Les champs à mettre à jour
 * @returns {Promise<Object>} - Promesse qui se résout avec la tâche mise à jour
 */
const updateTask = async (id, updates) => {
  await db.ref(`todos/${id}`).update(updates);
  const snapshot = await db.ref(`todos/${id}`).once("value");
  return { id, ...snapshot.val() };
};

/**
 * Supprime une tâche dans Firebase
 * @param {string} id - L'ID de la tâche à supprimer
 * @returns {Promise<boolean>} - Promesse qui se résout avec true si la suppression a réussi
 */
const deleteTask = async (id) => {
  await db.ref(`todos/${id}`).remove();
  return true;
};

// Exporter les fonctions pour les utiliser dans d'autres modules
module.exports = {
  getAllTasks,
  getDoneTasks,
  addTask,
  updateTask,
  deleteTask,
};
