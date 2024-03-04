import {mongoose} from 'mongoose';
import Rating from "../model/ratingModel.mjs";
import autoIncrement from 'mongoose-auto-increment';

const ratingSchema = new mongoose.Schema({
    grade : { type : Number, required : true},
    review : { type : String },
    typeOfContent: { type : String, required : true},
    contentId: { type : Number, required : true},
    userId: { type : Number, required : true},
})
ratingSchema.plugin(autoIncrement.plugin, { model: 'Ratings', field: 'id', startAt: 1 });
const MongoRating = new mongoose.model("Ratings",ratingSchema)
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
        const rating = await MongoRating.findOne({ id });
        return rating ? new Rating(rating) : null;
    },

    /**
     * Add a new rating.
     * @param {Rating} rating - The Rating object to add.
     * @returns {Promise<Rating|null>} - The added Rating object if successful, null otherwise.
     */
    add: async (rating) => {
        if (!rating || !(rating instanceof Rating)) {
            console.log('Not a valid rating');
            return 'Not a valid rating';
        }
        const existingRating = await MongoRating.findOne({ id: rating.id });
        if (existingRating) {
            console.log('Rating already exists');
            return 'Rating already exists';
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
        const result = await MongoRating.deleteOne({ id });
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
        const existingRating = await MongoRating.findOne({ id: rating.id });
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

 