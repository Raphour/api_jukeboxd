import mongoose from 'mongoose';
import User from "../model/userModel.mjs";


const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true}, // Unique username
    password: {type: String, required: true},
    profile_picture_url: {type: String},
    email: {type: String, unique: true}, // Unique email
    favoriteTracks: [{type: Number}], // Array of song IDs (reference to "Song" model)
    favoriteAlbums: [{type: Number}], // Array of album IDs (reference to "Album" model)
    friendsList: [{type: String}],
    listenedTracks: [{type: String}],
    listenedAlbums: [{type: String}],
    toListenLater: [{type: String}],
    ratings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Rating'}], // initialize as an empty object

});


const MongoUser = new mongoose.model("Users", userSchema)


const userDAO = {
    /**
     * @async
     * @function findAll
     * @returns {Promise<*>}
     */
    findAll: async () => {
        const data = await MongoUser.find({});
        return data.map((user) => new User(user));
    },

    /**
     * @async
     * @function removeAll
     * @returns {Promise<void>}
     */
    removeAll: async () => {
        await MongoUser.deleteMany();
    },

    // **Renvoie un utilisateur connu par son username ou null**
    findByUsername: async (username) => {
        const user = await MongoUser.findOne({username});
        return user ? new User(user) : null;
    },

    /** Ajoute un utilisateur
     * @async
     * @function add
     * @param user
     * @returns {Promise<User|string>}
     */
    addUser: async (user) => {

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

    /** Supprime un utilisateur par son username
     * @async
     * @function removeByusername
     * @param username
     * @returns {Promise<boolean>}
     */
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
        const user = await MongoUser.findOne({username: username});
        const friend = await MongoUser.findOne({username: friendUsername});

        // If either user does not exist, return an error message
        if (!user || !friend) {
            return 'User or friend not found';
        }

        // Add the friend's id to the user's friends list
        user.friendsList.push(friend.username);

        // Save the updated user document
        await user.save();

        // Return the updated user document
        return new User(user);
    },


    /**
     * Find user's friends list.
     * @param username
     * @returns {Promise<*[]|string>}
     */
    findFriends: async (username) => {
        // Find the user in the database
        const user = await MongoUser.findOne({username: username});

        // If the user does not exist, return an error message
        if (!user) {
            return 'User not found';
        }

        // Retrieve the friends list of the user
        const friendsList = user.friendsList;

        // Initialize an empty array to store the friends' user objects
        let friendsObjects = [];

        // For each friend in the friends list, find the friend's user object in the database
        for (let i = 0; i < friendsList.length; i++) {
            const friend = await MongoUser.findOne({username: friendsList[i]});
            // If the friend exists, add their user object to the array
            if (friend) {
                friendsObjects.push(new User(friend));
            }
        }

        user.save();

        // Return the array of the friends' user objects
        return friendsObjects;
    },

    /**
     * Add track to listened track.
     * @async
     * @param username
     * @param songId
     * @returns {Promise<User|string>}
     */
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
