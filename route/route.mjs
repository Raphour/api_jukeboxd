"use strict"
import express from 'express'
import userController from '../controller/userController.mjs'
import ratingController from '../controller/ratingController.mjs'
import contentInformationDAO from "../dao/contentInformationDAO.mjs";
import UserNotFoundError from "../model/error/UserNotFoundError.mjs";

const router = express.Router()

router
    .route('/user')
    .get(async (req, res) => {
        // #swagger.summary = 'Obtenire la liste des utilisateurs'
        // #swagger.description = 'Renvoie la liste des utilisateurs enregistrés dans la base de données.'
        // #swagger.responses[200] = {description: 'Liste des utilisateurs récupérée avec succès.'}
        // #swagger.tags = ['User']
        res.status(200).send(await userController.findAll())
    })
    .post(async (req, res) => {
        // #swagger.summary = 'Ajouter un utilisateur'
        // #swagger.description = 'Ajoute un utilisateur à la base de données.'
        // #swagger.tags = ['User']
        const newUser = req.body;

        if (!newUser || !newUser.username || !newUser.password) {
            return res.status(400).send({message: "not added"});
        }

        try {
            const existingUser = await userController.findByUsername(newUser.username);

            if (existingUser) {
                return res.status(400).send({message: "not added, user already exists"});
            }
            const createdUser = await userController.add(newUser);
            res.status(201).send(createdUser);
        } catch (error) {
            res.status(500).send({message: "Internal server error"});
        }
    })
    .put(async (req, res) => {
        // swagger.summary = 'Mettre à jour un utilisateur'
        // swagger.description = 'Met à jour un utilisateur dans la base de données.'

        // #swagger.tags = ['User']
        const updatedUser = req.body
        if (!updatedUser || !updatedUser.username || !updatedUser.password) {
            return res.status(400).send({message: "Missing required fields"})
        }
        try {
            const user = await userController.update(updatedUser)
            if (!user) {
                return res.status(400).send({message: "User not found"})
            }
            res.status(200).send(user)
        } catch (error) {
            console.error(error)
            res.status(500).send({message: "Internal server error"})
        }
    })

router
    .route('/user/:username')
    .get(async (req, res) => {
        // #swagger.summary = 'Obtenire une utilisateur par son username'
        // #swagger.description = 'Renvoie un utilisateur connu par son username.'
        // #swagger.tags = ['User']
        console.log(req.params["username"])
        const user = await userController.findByUsername(req.params["username"])

        if (user == null) {
            console.log('Okay')
            res.status(404).send({message: "user not found"})
        } else {
            res.status(200).send(user)
        }
    })
    .delete(async (req, res) => {
        // #swagger.summary = 'Supprimer un utilisateur'
        // #swagger.description = 'Supprime un utilisateur de la base de données.'
        // #swagger.responses[200] = {description: 'Utilisateur supprimé avec succès.'}
        // #swagger.responses[404] = {description: 'Utilisateur non trouvé.'}
        // #swagger.tags = ['User']
        const user = await userController.remove(req.params["username"])
        if (!user) {
            res.status(404).send({message: "User not found"})
        } else {
            res.status(200).send({message: "User deleted"})
        }
    })

router
    .route('/user/:username/friend')
    .get(async (req, res) => {
        // #swagger.summary = 'Obtenir la liste des amis d\'un utilisateur'
        // #swagger.description = 'Renvoie la liste des amis d\'un utilisateur.'
        // #swagger.tags = ['User']
        // #swagger.responses[200] = {description: 'Liste des amis réculpérée avec succès.'}
        // #swagger.responses[404] = {description: 'Utilisateur non trouvé.'}

        let friendsList = null
        try {
            friendsList = await userController.findFriends(req.params["username"])
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return res.status(404).send({message: "User not found"})
            } else {
                return res.status(500).send({message: "Internal server error"})
            }
        }
        res.status(200).send(friendsList)

    })
    .post(async (req, res) => {
        console.log(req.params["username"])
        console.log(req.body["friendUsername"])
        let user = null

        try {
            user = await userController.addFriend(req.params["username"], req.body["friendUsername"])
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return res.status(404).send({message: error.message})
            } else {
                return res.status(500).send({message: "Internal server error"})
            }
        }
    })
router
    .route('/ratings/:username/')
    .get(async (req, res) => {
            res.send(await ratingController.findByUser(req.params["username"]))
        }
    )

router
    .route('/ratings')
    .get(async (req, res) => {
        // #swagger.summary = 'Recupere la liste des notes'
        // #swagger.description = 'Renvoie la liste des notes enregistrées dans la base de données.'
        // #swagger.responses[200] = {description: 'Liste des notes récupérée avec succès.'}
        // #swagger.tags = ['Rating']

            res.send(await ratingController.findAll())
        }
    )
    .post(async (req, res) => {
            // #swagger.summary = 'Ajouter une note'
            // #swagger.description = 'Ajoute une note à la base de données.'
            // #swagger.tags = ['Rating']
            // #swagger.responses[201] = {description: 'Note ajoutée avec succès.'}
            // #swagger.responses[400] = {description: 'Note invalide.'}
            // #swagger.responses[400] = {description: 'Note déjà existante.'}
            // #swagger.parameters['newRating']  = { in: 'body', description: 'Note à ajouter.', required: true, type: 'object', schema: { $ref: "#/definitions/Rating" } }
            try {

                res.status(201).send(await ratingController.add(req.body))
            } catch (error) {
                if (error.options.cause === "invalidRating") {
                    res.status(400).send({message: "Invalid rating"})
                } else if (error.options.cause === "existingRating") {
                    res.status(400).send({message: "Rating already exists"})
                }
            }

        }
    )

router
    .route('/content')
    .get(async (req, res) => {
        // #swagger.summary = 'Recupere la liste des contenus'
        // #swagger.description = 'Renvoie la liste des contenus enregistrés dans la base de données.'
        // #swagger.responses[200] = {description: 'Liste des contenus récupérée avec succès.'}
        // #swagger.tags = ['Content']
        res.send(await contentInformationDAO.findAll())
    })
    .post(async (req, res) => {
        // #swagger.summary = 'Ajouter un contenu'
        // #swagger.description = 'Ajoute un contenu à la base de données.'
        // #swagger.tags = ['Content']
        // #swagger.responses[201] = {description: 'Contenu ajouté avec succès.'}
        res.send(await contentInformationDAO.add(req.body))
    })

router.route('/content/:deezerId')
    .get(async (req, res) => {
        // #swagger.summary = 'Recupere les informations d'un contenu par son deezerId'
        // #swagger.description = ''
        res.send(await contentInformationDAO.findByDeezerId(req.params["deezerId"]))
    })

router.route('/content/:deezerId/listened')
    // #swagger.summary = 'Recupere les utilisateurs ayant écouté un contenu'
    .get(async (req, res) => {
        res.send(await contentInformationDAO.findByDeezerId(req.params["deezerId"]["listened"]))
    })

router.route('/content/:deezerId/favorite')
    .get(async (req, res) => {
        // #swagger.summary = 'Recupere les utilisateurs ayant mis en favoris un contenu'
        res.send(await contentInformationDAO.findByDeezerId(req.params["deezerId"]["favorites"]))
    })

router.route('/content/:deezerId/listened/:username')
    .post(async (req, res) => {
        // #swagger.summary = 'Ajoute un utilisateur à la liste des utilisateurs ayant écouté un contenu'
        res.send(await contentInformationDAO.addListenedContent(req.params["deezerId"], req.params["username"]))
    })
    .delete(async (req, res) => {
        // #swagger.summary = 'Retire un utilisateur de la liste des utilisateurs ayant écouté un contenu'
        res.send(await contentInformationDAO.removeListenedContent(req.params["deezerId"], req.params["username"]))
    })

router.route('/content/:deezerId/favorite/:username')
    .post(async (req, res) => {
        res.send(await contentInformationDAO.addFavoriteContent(req.params["deezerId"], req.params["username"]))
    })
    .delete(async (req, res) => {
        res.send(await contentInformationDAO.removeFavoriteContent(req.params["deezerId"], req.params["username"]))
    })

export default router

