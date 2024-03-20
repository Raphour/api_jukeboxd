"use strict"
import userDAO from '../dao/userDAO.mjs'

const userController = {
    findAll: async () => await userDAO.findAll(),
    findByUsername: async (username) => {
        return await userDAO.findByUsername(username)
    },
    add: async (user) => await userDAO.addUser(user),
    remove: async (username) => await userDAO.removeByusername(username),
    update: async (user) => await userDAO.update(user),
    addFriend: async (username, friendUsername) => await userDAO.addFriend(username, friendUsername),
    findFriends: async (username) => await userDAO.findFriends(username)
}
export default userController