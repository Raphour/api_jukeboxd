import {mongoose} from 'mongoose';
import User from "../model/userModel.mjs";
import {ObjectId} from "mongodb";


const userSchema = new mongoose.Schema({
    id : {type : ObjectId,required : true, unique : true},
    username: { type: String, required: true, unique: true }, // Unique username
    password: { type: String, required: true },
    email: { type: String,  unique: true }, // Unique email
    favoriteSongs: [{ type: Number }], // Array of song IDs (reference to "Song" model)
    favoriteAlbums: [{ type: Number }], // Array of album IDs (reference to "Album" model)
    friendsList : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    listenedSongs : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    listenedAlbums : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    toListenLater : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    ratings : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }], // initialize as an empty object

});


const MongoUser = new mongoose.model("Users",userSchema)



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
        const user = await MongoUser.findOne({ username });
        return user ? new User(user) : null;
    },

    // **Ajoute un utilisateur si il est valide et n'existe pas**
    // **Sinon "User already exists" ou "Not a valid user"**
    add: async (user) => {

        if (!user || !(user instanceof User)) {
            return 'Not a valid user';
        }

        const existingUser = await this.findOne({ username: user.username });
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
        const result = await MongoUser.deleteOne({ username : username });
        return result.deletedCount === 1;
    },

    // **Modifie un utilisateur**
    // **Renvoie l'utilisateur modifié ou null**
    update: async (user) => {
        if (!user || !(user instanceof User)) {
            return null
        }

        const existingUser = await MongoUser.findOne({ username: user.username });
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
