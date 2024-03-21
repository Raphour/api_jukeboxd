"use strict"
import express from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './swagger.json' assert {type: 'json'};

//pour lire le .env
import dotenv from 'dotenv'
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors'
dotenv.config()
//api path
const APIPATH = process.env.API_PATH || '/api/v0'

const app = express()

//chargement des middleware
//Pour le CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.setHeader("Access-Control-Allow-Methods",'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers",'Content-Type,Authorization');
    next();
})
//pour traiter les body en json
app.use(express.json())

//route pour swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerJson))

app.use('/deeznuts', createProxyMiddleware({ target: 'https://api.deezer.com', changeOrigin: true, pathRewrite: {'^/deeznuts' : '/'} }));

app.use(cors())



//chargement des routes
const {default: routes}  = await import ('./route/route.mjs')
app.use(APIPATH+'/',routes)

//message par defaut
app.use((error,req,res,next)=>{
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({message:message})
})

export default app;
