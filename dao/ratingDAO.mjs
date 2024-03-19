import {mongoose} from 'mongoose';
import Rating from "../model/ratingModel.mjs";


const ratingSchema = new mongoose.Schema({
    grade: {type: Number, required: true},
    review: {type: String},
    typeOfContent: {type: String, required: true},
    contentId: {type: Number, required: true},
    username: {type: String, required: true},
})

const MongoRating = new mongoose.model("Ratings", ratingSchema)
const ratingDAO = {

    /**
     * Find all ratings.
     * @returns {Promise<Array<Rating>>} - Array of Rating objects.
     */
    findAll: async () => {
        const data = await MongoRating.find({});
        return data.map((rating) => new Rating(rating));
    },

    /**
     * Remove all ratings.
     * @returns {Promise<void>}
     */
    removeAll: async () => {
        await MongoRating.deleteMany();
    },

    /**
     * Find a rating by ID.
     * @param {string} id - The ID of the rating.
     * @returns {Promise<Rating|null>} - The Rating object if found, null otherwise.
     */
    findById: async (id) => {
        const rating = await MongoRating.findOne({id});
        return rating ? new Rating(rating) : null;
    },

    /**
     * Find all ratings by user ID.
     * @param {string} username - The ID of the user.
     * @returns {Promise<Array<Rating>>} - Array of Rating objects.
     */
    findByUsername: async (username) => {
        const data = await MongoRating.find({username : username});
        return data.map((rating) => new Rating(rating));
    },


    /**
     * Add a new rating.
     * @param {Rating} rating - The Rating object to add.
     * @returns {Promise<Rating>} - The added Rating object if successful, null otherwise.
     */
    add: async (rating) => {
        const r = new Rating(rating);
        if (!r || !(r instanceof Rating)) {
            console.log('Not a valid rating');
            return undefined;
        }
        // find rating that have same contentId and username
        const existingRating = await MongoRating.findOne({contentId: r.contentId, username: r.username});
        if (existingRating) {
            console.log('Rating already exists');
            return undefined;
        }
        const newRating = new MongoRating(rating);
        await newRating.save();
        return new Rating(newRating);
    },

    /**
     * Remove a rating by id.
     * @param {string} id - The login of the rating to remove.
     * @returns {Promise<boolean>} - True if the rating was successfully removed, false otherwise.
     */
    removeByLogin: async (id) => {
        const result = await MongoRating.deleteOne({id});
        return result.deletedCount === 1;
    },

    /**
     * Update a rating.
     * @param {Rating} rating - The updated Rating object.
     * @returns {Promise<Rating|null>} - The updated Rating object if successful, null otherwise.
     */
    update: async (rating) => {
        if (!rating || !(rating instanceof Rating)) {
            return null;
        }
        const existingRating = await MongoRating.findOne({id: rating.id});
        if (!existingRating) {
            return null;
        }
        existingRating.grade = rating.grade;
        existingRating.review = rating.review;
        await existingRating.save();
        return new Rating(existingRating);
    },
}

export default ratingDAO;

 