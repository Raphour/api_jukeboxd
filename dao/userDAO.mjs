import {mongoose} from 'mongoose';
import User from "../model/userModel.mjs";
import {ObjectId} from "mongodb";


const userSchema = new mongoose.Schema({
    id: {type: ObjectId, required: true, unique: true},
    username: {type: String, required: true, unique: true}, // Unique username
    password: {type: String, required: true},
    email: {type: String, unique: true}, // Unique email
    favoriteTracks: [{type: Number}], // Array of song IDs (reference to "Song" model)
    favoriteAlbums: [{type: Number}], // Array of album IDs (reference to "Album" model)
    friendsList: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    listenedTracks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
    listenedAlbums: [{type: mongoose.Schema.Types.ObjectId, ref: 'Album'}],
    toListenLater: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}],
    ratings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Rating'}], // initialize as an empty object

});


const MongoUser = new mongoose.model("Users", userSchema)


const userDAO = {
    // **Renvoie un tableau d'utilisateurs**
    findAll: async () => {
        const data = await MongoUser.find({});
        return data.map((user) => new User(user));
    },

    // **Supprime tous les utilisateurs**
    removeAll: async () => {
        await MongoUser.deleteMany();
    },

    // **Renvoie un utilisateur connu par son username ou null**
    findByUsername: async (username) => {
        const user = await MongoUser.findOne({username});
        return user ? new User(user) : null;
    },

    // **Ajoute un utilisateur si il est valide et n'existe pas**
    // **Sinon "User already exists" ou "Not a valid user"**
    add: async (user) => {

        if (!user || !(user instanceof User)) {
            return 'Not a valid user';
        }

        const existingUser = await MongoUser.findOne({username: user.username});
        if (existingUser) {
            return 'User already exists';
        }

        const mongoUser = new MongoUser(user);

        await mongoUser.save();
        return new User(mongoUser);
    },

    // **Supprime un utilisateur connu par son username**
    // **Renvoie true si la suppression fonctionne, false sinon**
    removeByusername: async (username) => {
        const result = await MongoUser.deleteOne({username: username});
        return result.deletedCount === 1;
    },


    /**
     * Adds a friend to a user's friends list.
     *
     * @async
     * @function addFriend
     * @param {string} username - The username of the user who wants to add a friend.
     * @param {string} friendUsername - The username of the user to be added as a friend.
     * @returns {Promise<User>} The updated user document with the new friend added to the friends list.
     * @throws {string} Will throw an error if either the user or the friend does not exist in the database.
     */
    addFriend: async (username, friendUsername) => {
        // Find the user and the friend in the database
        const user = await MongoUser.findOne({username});
        const friend = await MongoUser.findOne({username: friendUsername});

        // If either user does not exist, return an error message
        if (!user || !friend) {
            return 'User or friend not found';
        }

        // Add the friend's id to the user's friends list
        user.friendsList.push(friend._id);

        // Save the updated user document
        await user.save();

        // Return the updated user document
        return new User(user);
    },

// Add a Track to a user's listened songs list
    addListenedTrack: async (username, songId) => {
        // Find the user in the database
        const user = await MongoUser.findOne({username});

        // If the user does not exist, return an error message
        if (!user) {
            return 'User not found';
        }

        // Add the song ID to the user's listened songs list
        user.addToListenedTracks(songId);

        // Save the updated user document
        await user.save();

        // Return the updated user document
        return new User(user);
    },

    addFavoriteTrack: async (username, songId) => {
        // Find the user in the database
        const user = await MongoUser.findOne({username});

        // If the user does not exist, return an error message
        if (!user) {
            return 'User not found';
        }

        // Add the song ID to the user's listened songs list
        user.addFavoriteTrack(songId);

        // Save the updated user document
        await user.save();

        // Return the updated user document
        return new User(user);
    },






    // **Modifie un utilisateur**
    // **Renvoie l'utilisateur modifié ou null**
    update: async (user) => {
        if (!user || !(user instanceof User)) {
            return null
        }

        const existingUser = await MongoUser.findOne({username: user.username});
        if (!existingUser) {
            return null;
        }

        existingUser.username = user.username;
        existingUser.password = user.password;
        await existingUser.save();
        return new User(existingUser);
    },


}
export default userDAO
