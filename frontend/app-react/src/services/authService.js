// Service pour gérer l'authentification Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

/**
 * S'inscrire avec email et mot de passe
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @param {string} displayName - Nom d'affichage
 * @returns {Promise} - Promesse avec l'utilisateur créé
 */
export const register = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Mettre à jour le profil avec le nom d'affichage
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);

    let message = "Erreur lors de l'inscription";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "Cet email est déjà utilisé";
        break;
      case "auth/invalid-email":
        message = "Email invalide";
        break;
      case "auth/weak-password":
        message = "Le mot de passe est trop faible";
        break;
      default:
        message = error.message;
    }

    throw new Error(message);
  }
};

/**
 * Se connecter avec email et mot de passe
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise} - Promesse avec l'utilisateur connecté
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);

    let message = "Erreur lors de la connexion";
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        message = "Email ou mot de passe incorrect";
        break;
      case "auth/invalid-email":
        message = "Email invalide";
        break;
      case "auth/user-disabled":
        message = "Ce compte a été désactivé";
        break;
      case "auth/too-many-requests":
        message =
          "Trop de tentatives de connexion. Veuillez réessayer plus tard";
        break;
      default:
        message = error.message;
    }

    throw new Error(message);
  }
};

/**
 * Se déconnecter
 * @returns {Promise} - Promesse vide
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

/**
 * S'abonner aux changements d'état de l'authentification
 * @param {function} callback - Fonction à appeler lors d'un changement
 * @returns {function} - Fonction pour se désabonner
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
