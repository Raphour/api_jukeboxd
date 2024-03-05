"use strict"
import express from 'express'
import userController from '../controller/userController.mjs'
import ratingController from '../controller/ratingController.mjs'
import userDAO from "../dao/userDAO.mjs";
const router = express.Router()

router
    .route('/user')
    .get(async (req, res) =>{
        // #swagger.summary = 'un résumé'
        // #swagger.description = 'une description'
        res.status(200).send(await userController.findAll())})
    .post(async (req, res) =>{
        const newUser = req.body;

        if (!newUser || !newUser.username || !newUser.password) {
            return res.status(400).send({ message: "not added" });
        }

        try {
            const existingUser = await userController.findByUsername(newUser.username);

            if (existingUser) {
                return res.status(400).send({ message: "not added, user already exists" });
            }
            const createdUser = await userController.add(newUser);
            res.status(201).send(newUser);
        } catch (error) {
            res.status(500).send({ message: "Internal server error" });
        }
    })
    .put(async (req, res)=> {
        const updatedUser = req.body
        if (!updatedUser || !updatedUser.username || !updatedUser.password) {
            return res.status(400).send({ message: "Missing required fields" })
        }
        try {
            const user = await userController.update(updatedUser)
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }
            res.status(200).send(user)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Internal server error" })
        }
    })

router
    .route('/user/:username')
    .get(async (req, res) =>{
        // #swagger.summary = 'un résumé'
        // #swagger.description = 'une description'
        console.log(req.params["username"])
        const user = await userController.findByusername(req.params["username"])

        if(user==null){
            console.log('Okay')
            res.status(404).send({message:"user not found"})
        }else{
            res.status(200).send(user)
        }})
    .delete(async (req,res)=> {
        const user = await userController.remove(req.params["username"])
        if (!user) {
            res.status(404).send({ message: "User not found" })
        } else {
            res.status(200).send({ message: "User deleted" })
        }
    })
router
    .route('/user/:username/ratings')
    .get(async (req, res) =>{
        res.status(200).send(await ratingController.findByUsername(req.params["username"]) )})

router
    .route('/rating')
    .get(async (req, res) =>{
        res.status(200).send(await ratingController.findAll())})
    
export default router

