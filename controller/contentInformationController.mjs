"use strict"
import contentInformationDAO from "../dao/contentInformationDAO.mjs";
import userDAO from "../dao/userDAO.mjs";

const contentInformationController = {
    findAll: async () => await contentInformationDAO.findAll(),
    findByDeezerId: async (deezerId) => await contentInformationDAO.findByDeezerId(deezerId),
    add: async (contentInformation) => await contentInformationDAO.add(contentInformation),
    removeAll: async () => await contentInformationDAO.removeAll(),
    addListenedContent: async (deezerId, username) => {
        await contentInformationDAO.addListenedContent(deezerId, username)
        await userDAO.addListenedTrack(username, deezerId)
    },
    removeListenedContent: async (deezerId, username) => {
        await contentInformationDAO.removeListenedContent(deezerId, username)
        await userDAO.removeListenedTrack(username, deezerId)
    },
    addFavoriteContent: async (deezerId, username) => {
        await contentInformationDAO.addFavoriteContent(deezerId, username)
        await userDAO.addFavoriteTrack(username, deezerId)
    },
    removeFavoriteContent: async (deezerId, username) => {
        await contentInformationDAO.removeFavoriteContent(deezerId, username)
        await userDAO.removeFavoriteTrack(username, deezerId)
    },
    addRating: async (deezerId, username) => await contentInformationDAO.addRating(deezerId, username),
    findRatings : async (deezerId) => await contentInformationDAO.findRatings(deezerId)
}

export default contentInformationController