export default class ContentInformationModel {
    deezerId;
    favorites;
    listened;
    ratings;

    constructor(obj) {
        const {deezerId, favorites, listened, ratings} = obj;

        if (!deezerId || typeof deezerId !== 'string') {
            throw new TypeError('Invalid deezerId: must be a string');
        }

        if (!favorites || !Array.isArray(favorites)) {
            throw new TypeError('Invalid favorites: must be an array');
        }

        if (!listened || !Array.isArray(listened)) {
            throw new TypeError('Invalid listened: must be an array');
        }

        if (!ratings || !Array.isArray(ratings)) {
            throw new TypeError('Invalid ratings: must be an array');
        }

        this.deezerId = deezerId;
        this.favorites = favorites;
        this.listened = listened;
        this.ratings = ratings;
    }
}