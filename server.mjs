'use strict'


//pour lire le .env
import dotenv from 'dotenv'
dotenv.config()

//import du client mongodb
import {mongoose} from 'mongoose';

//import du framework express
import express from 'express'
import User from "./model/userModel.mjs";
import Rating from "./model/ratingModel.mjs";
import userDAO from "./dao/userDAO.mjs";
import ratingDAO from "./dao/ratingDAO.mjs";
import {ObjectId} from "mongodb";



//port serveur http
const serverPort = process.env.PORT || 8080
//mongodb url
const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
//mongodb db
const mongoDB = process.env.MONGO_DB || 'tpDB'
console.log(mongoURL,mongoDB,serverPort)

//environnement PROD ou DEV ou TEST
const env = (new URL(import.meta.url)).searchParams.get('ENV') ||process.env.ENV || 'PROD'
console.log(`env : ${env}`)

//connexion à la BD
if (env==='TEST0') {
    await mongoose.connect(mongoURL + '/' + mongoDB)
    console.log("Mongo on "+ mongoURL + '/' + mongoDB)

} else {
    const  connexion = mongoose.createConnection(mongoURL + '/' + mongoDB)

    await mongoose.connect(mongoURL + '/' + mongoDB)
    //
    // await userDAO.removeAll();
    //
    // await fillUserAndReviews();

    console.log("Mongo on "+ mongoURL + '/' + mongoDB)
}

//import de l'application

const {default: app}  = await import ('./app.mjs')

//lancement du serveur http
const server = app.listen(serverPort, () =>
    console.log(`Example app listening on port ${serverPort}`)


)


//Pour les interrucptions utilisateur
for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal,  () => {
        console.info(`${signal} signal received.`)
        console.log("Closing http server.");
        server.close(async (err) => {
            console.log("Http server closed.")
            await mongoose.connection.close()
            console.log("MongoDB connection  closed.")
            process.exit(err ? 1 : 0)
        });
    });
async function fillUserAndReviews(){
    for (let i = 0; i < 10; i++) {
        const user = new User({
            id : new ObjectId(),
            username: `utilisateur${i + 1}`,
            password: `motdepasse${i + 1}`,
            email: `email${i + 1 }@mail.com`,
            favoriteSongs : [], // initialize as an empty array
            favoriteAlbums : [],
            listenedSongs : [],
            listenedAlbums : [],
            toListenLater : [],
            ratings : [], // initialize as an empty object
            friendsList : [],
        });
        await userDAO.add(user);
    }

    //add some review to the database 
    for (let i = 0; i < 10; i++) {
        console.log(i % 5)
        const review = new Rating({
            grade: i % 5,
            review: `review${i}`,
            typeOfContent: "song",
            contentId: i,
            userId: i,
        });
        await ratingDAO.add(review);
    }


}


export default server

