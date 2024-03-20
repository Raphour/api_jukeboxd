import bcrypt from 'bcrypt';

export default class User {
    id;
    username;
    email;
    password;
    profile_picture_url;
    favoriteTracks = []; // initialize as an empty array
    favoriteAlbums = [];
    listenedTracks = [];
    listenedAlbums = [];
    toListenLater = [];
    friendsList = [];

    constructor(obj) {

        // Extract and validate required properties
        const {
            id,
            username,
            email,
            password,
            favoriteAlbums,
            favoriteTracks,
            friendsList,
            toListenLater,
            ratings,
            listenedAlbums,
            listenedTracks,
            profile_picture_url
        } = obj;

        if (!username || typeof username !== 'string') {
            throw new TypeError(`Invalid username: must be a strin g${typeof username}`);
        }

        if (!email || typeof email !== 'string') {
            throw new TypeError(`Invalid email: must be a string but is ` + typeof email + username);
        }

        if (!password || typeof password !== 'string') {
            throw new TypeError('Invalid password: must be a string');
        }

        this.profile_picture_url = profile_picture_url || null;

        // Store validated data in properties
        this.username = username;
        // Hash the password using bcrypt
        this.password = bcrypt.hashSync(password, 10);


        this.email = email
        this.id = id

        // Optional validation and initialization for other properties
        if (favoriteAlbums && Array.isArray(favoriteAlbums)) {
            this.favoriteAlbums = favoriteAlbums;
        }

        if (favoriteTracks && Array.isArray(favoriteTracks)) {
            this.favoriteTracks = favoriteTracks;
        }

        if (friendsList && Array.isArray(friendsList)) {
            this.friendsList = friendsList;
        }

        this.favoriteAlbums = favoriteAlbums;
        this.favoriteTracks = favoriteTracks;


        this.friendsList = friendsList;

        this.toListenLater = toListenLater;

        this.ratings = ratings;


        this.listenedAlbums = listenedAlbums;
        this.listenedTracks = listenedTracks;


    }

    // Add methods for user actions
    addFavoriteTrack(track) {
        if (!track) {
            throw new Error('Invalid song argument');
        }
        this.favoriteTracks.push(track);
    }

    addFavoriteAlbum(album) {
        if (!album) {
            throw new Error('Invalid album argument');
        }
        this.favoriteAlbums.push(album);
    }

    addListenedAlbums(item) {
        if (!item) {
            throw new Error('Invalid item argument (song or album)');
        }
        this.listenedAlbums.push(item);

    }

    addToListenedTracks(item) {
        if (!item) {
            throw new Error('Invalid item argument (song or album)');
        }
        this.listenedTracks.push(item);

    }

    addRating(rating) {
        if (typeof rating === 'object' && rating !== null) {
            this.ratings.push(rating);
        } else {
            throw new Error('Invalid rating argument');
        }

    }

    addFriend(friendId) {
        if (!friendId) {
            throw new Error('Invalid friendId argument');
        }
        this.friendsList.push(friendId)
    }
}
