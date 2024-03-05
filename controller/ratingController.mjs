"use strict";
import ratingDAO from "../dao/ratingDAO.mjs";

const ratingController = {
    findAll: async () => await ratingDAO.findAll(),
    findByUsername : async (username) => await ratingDAO.findByUsername(username),
    findById: async (id) => await ratingDAO.findById(id),
    add: async (rating) => await ratingDAO.add(rating),
    removeAll: async () => await ratingDAO.removeAll()
}

export default ratingController