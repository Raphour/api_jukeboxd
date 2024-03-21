"use strict"
import contentInformationDAO from "../dao/contentInformationDAO.mjs";

const contentInformationController = {
    findAll: async () => await contentInformationDAO.findAll(),
    findByDeezerId: async (deezerId) => await contentInformationDAO.findByDeezerId(deezerId),
    add: async (contentInformation) => await contentInformationDAO.add(contentInformation),
    removeAll: async () => await contentInformationDAO.removeAll(),
    addListenedContent: async (deezerId, username) => await contentInformationDAO.addListenedContent(deezerId, username),
    removeListenedContent: async (deezerId, username) => await contentInformationDAO.removeListenedContent(deezerId, username),
    addFavoriteContent: async (deezerId, username) => await contentInformationDAO.addFavoriteContent(deezerId, username),
    removeFavoriteContent: async (deezerId, username) => await contentInformationDAO.removeFavoriteContent(deezerId, username),
    addRating: async (deezerId, username) => await contentInformationDAO.addRating(deezerId, username),
    findRatings : async (deezerId) => await contentInformationDAO.findRatings(deezerId)
}

export default contentInformationController