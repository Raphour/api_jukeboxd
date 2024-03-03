// Importation des modules nécessaires
import express from 'express';
import mongoose from 'mongoose';



// Définition du port d'écoute
const port = 3000;

// **Configuration de la base de données**

// Connexion à la base de données
mongoose.connect('mongodb://localhost:27017/ma_base_de_donnees', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Définition du schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pseudo: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ['utilisateur'],
  },
  favoris: {
    type: [{
      contenu_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Musique' // Modèle Musique
      },
      type_contenu: {
        type: String,
        enum: ['musique', 'album'],
      },
    }],
  },
  notes: {
    type: [{
      contenu_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Musique' // Modèle Musique
      },
      type_contenu: {
        type: String,
        enum: ['musique', 'album'],
      },
      commentaire: {
        type: String,
      },
      note: {
        type: Number,
        min: 1,
        max: 5,
      },
    }],
  },
});

// Création du modèle utilisateur
const User = mongoose.model('Utilisateur', userSchema);

// **Configuration des routes**

// Création du routeur
const router = express.Router();

// Définition des routes pour les utilisateurs
router.post('/', userDAO.createUser);
router.get('/', userDAO.getAllUsers);
router.get('/:id', userDAO.getUserById);
router.put('/:id', userDAO.updateUserById);
router.delete('/:id', userDAO.deleteUserById);

// **Démarrage du serveur**

// Ajout du routeur à l'application
app.use('/api/users', router);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

// **Fonctions utilitaires**

// ...





// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
