"use strict"
import express from 'express'
import userController from '../controller/userController.mjs'
import ratingController from '../controller/ratingController.mjs'
import userDAO from "../dao/userDAO.mjs";
import contentInformationDAO from "../dao/contentInformationDAO.mjs";

const router = express.Router()

router
    .route('/user')
    .get(async (req, res) => {
        // #swagger.summary = 'un résumé'
        // #swagger.description = 'une description'
        res.status(200).send(await userController.findAll())
    })
    .post(async (req, res) => {
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
        // #swagger.summary = 'un résumé'
        // #swagger.description = 'une description'
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

        const friendsList = await userController.findFriends(req.params["username"])

        if (friendsList == null) {
            res.status(404).send({message: "user not found"})
        } else {
            res.status(200).send(friendsList)
        }
    })
    .post(async (req, res) => {
        console.log(req.params["username"])
        console.log(req.body["friendUsername"])
        const user = await userController.addFriend(req.params["username"],req.body["friendUsername"])
        if (!user) {
            res.status(404).send({message: "User not found"})
        } else {
            res.status(200).send({message: "User added to friends list"})
        }
    })
router
    .route('/ratings/:username/')
    .get(async (req, res) => {
            res.send(await ratingController.findByUsername(req.params["username"]))
        }
    )

router
    .route('/ratings')
    .get(async (req, res) => {
            res.send(await ratingController.findAll())
        }
    )
    .post(async (req, res) => {
        res.send(await ratingController.add(req.body))
    })

router
    .route('/content')
    .get(async (req, res) => {
        res.send(await contentInformationDAO.findAll())
    })
    .post(async (req, res) => {
        res.send(await contentInformationDAO.add(req.body))
    })
    .delete(async (req, res) => {
        res.send(await contentInformationDAO.removeAll())
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

