import {mongoose} from 'mongoose';
import Rating from "../model/ratingModel.mjs";

const ratingSchema = new mongoose.Schema({
    _id : {type : String, required: true, unique : true},
    grade : { type : Number, required : true},
    review : { type : String },
})
const MongoRating = new mongoose.model("Ratings",ratingSchema)
const ratingDAO = {
    // **Renvoie un tableau d'utilisateurs**
    findAll: async () => {
        const data = await MongoRating.find({});
        return data.map((rating) => new Rating(rating));
    },

    // **Supprime tous les utilisateurs**
    removeAll: async () => {
        await MongoRating.deleteMany();
    },

    // **Renvoie un utilisateur connu par son login ou null**
    findById: async (id) => {
        const rating = await MongoRating.findOne({ id });
        return rating ? new Rating(rating) : null;
    },

    // **Ajoute un utilisateur si il est valide et n'existe pas**
    // **Sinon "User already exists" ou "Not a valid user"**
    add: async (rating) => {

        if (!rating || !(rating instanceof Rating)) {
            return 'Not a valid rating';
        }

        const existingUser = await MongoRating.findOne({ id: rating.id });
        if (existingUser) {
            return 'Rating already exists';
        }

        const MongoRating = new MongoRating(user);
        await MongoRating.save();
        return new User(MongoRating);
    },

    // **Supprime un utilisateur connu par son login**
    // **Renvoie true si la suppression fonctionne, false sinon**
    removeByLogin: async (login) => {
        const result = await MongoRating.deleteOne({ login });
        return result.deletedCount === 1;
    },

    // **Modifie un utilisateur**
    // **Renvoie l'utilisateur modifié ou null**
    update: async (user) => {
        if (!user || !(user instanceof User)) {
            return null
        }

        const existingUser = await MongoRating.findOne({ login: user.login });
        if (!existingUser) {
            return null;
        }

        existingUser.login = user.login;
        existingUser.password = user.password;
        await existingUser.save();
        return new User(existingUser);
    },
}
export default ratingDAO