"use strict"
import userDAO from '../dao/userDAO.mjs'

const userController = {
    findAll: async () => await userDAO.findAll(),
    findByUsername : async (username)=> {
        const user = await userDAO.findByUsername(username)
        return user
    },
    add : async (user) => await userDAO.add(user),
    remove : async (username) => await userDAO.removeByusername(username),
    update: async (user) => await userDAO.update(user)
}
export default userController