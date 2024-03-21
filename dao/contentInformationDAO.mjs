import mongoose from 'mongoose';
import ContentInformation from '../model/contentInformationModel.mjs';

const contentInformationSchema = new mongoose.Schema({
    deezerId: {type: Number, required: true},
    favorites: {type: [String]},
    listened: {type: [String]},
    ratings: {type: [String]}
});

const MongoContentInformation = new mongoose.model("ContentInformation", contentInformationSchema)
// const MongoUser = new mongoose.model("Users", userSchema)

const contentInformationDAO = {
    /**
     * Return every content Information
     * @returns {Promise<*>}
     */
    findAll: async () => {
        const data = await MongoContentInformation.find({});
        return data.map((contentInformation) => new ContentInformation(contentInformation));
    },

    findByDeezerId: async (deezerId) => {
        const contentInformation = await MongoContentInformation.findOne({deezerId: deezerId});
        return contentInformation ? new ContentInformation(contentInformation) : null;
    },

    add: async (contentInformation) => {
            try {
                const c = new ContentInformation(contentInformation);
                await c.save();
                return c;
            }catch (e) {
                if (e.name === 'ValidationError') {
                    return 'Invalid content information';
                }
                console.error(e);
            }
    },

    addListenedContent: async (deezerId, username) => {
        await MongoContentInformation.updateOne({deezerId: deezerId}, {$push: {listened: username}});
    },

    removeListenedContent: async (deezerId, username) => {
        await MongoContentInformation.updateOne({deezerId: deezerId}, {$pull: {listened: username}});
    },

    addFavoriteContent: async (deezerId, username) => {
        await MongoContentInformation.updateOne({deezerId: deezerId}, {$push: {favorites: username}});
    },

    removeFavoriteContent: async (deezerId, username) => {
        await MongoContentInformation.updateOne({deezerId: deezerId}, {$pull: {favorites: username}});
    },

    findRatings: async (deezerId) => {
        const contentInformation = await MongoContentInformation.findOne({deezerId: deezerId});
        if (contentInformation.length === 0) {
            return null;
        }else{

        }

        return contentInformation["ratings"] ? new ContentInformation(contentInformation) : null;
    },

    addRating: async (deezerId, username) => {
        await MongoContentInformation.updateOne({deezerId: deezerId}, {$push: {ratings: username}});
    },

    removeAll: async () => {
        await MongoContentInformation.deleteMany();
    }
}

export default contentInformationDAO