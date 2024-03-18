export default class User {
    id;
    username;
    email;
    password;
    favoriteSongs = []; // initialize as an empty array
    favoriteAlbums = [];
    listenedSongs = [];
    listenedAlbums = [];
    toListenLater = [];
    friendsList = [];

    constructor(obj) {

        // Extract and validate required properties
        const {  id,username,email, password, favoriteAlbums, favoriteSongs,friendsList,toListenLater,ratings,listenedAlbums,listenedSongs } = obj;

        if (!username || typeof username !== 'string') {
            throw new TypeError(`Invalid username: must be a strin g${typeof username}`);
        }

        if (!email || typeof email !== 'string') {
            throw new TypeError(`Invalid email: must be a string but is ` + typeof email + username);
        }

        if (!password || typeof password !== 'string') {
            throw new TypeError('Invalid password: must be a string');
        }

        // Store validated data in properties
        this.username = username;
        this.password = password;
        this.email = email
        this.id = id

        // Optional validation and initialization for other properties
        if (favoriteAlbums && Array.isArray(favoriteAlbums)) {
            this.favoriteAlbums = favoriteAlbums;
        }

        if (favoriteSongs && Array.isArray(favoriteSongs)) {
            this.favoriteSongs = favoriteSongs;
        }

        if (friendsList && Array.isArray(friendsList)) {
            this.friendsList = friendsList;
        }

        this.favoriteAlbums = favoriteAlbums;
        this.favoriteSongs = favoriteSongs;
        this.friendsList = friendsList;
        this.toListenLater = toListenLater;
        this.ratings = ratings;
        this.listenedAlbums = listenedAlbums;
        this.listenedSongs = listenedSongs;
        


    }

    // Add methods for user actions
    addFavoriteSong(song) {
        if (!song) {
            throw new Error('Invalid song argument');
        }
        this.favoriteSongs.push(song);
    }

    addFavoriteAlbum(album) {
        if (!album) {
            throw new Error('Invalid album argument');
        }
        this.favoriteAlbums.push(album);
    }

    addToListened(item) {
        if (!item) {
            throw new Error('Invalid item argument (song or album)');
        }
        // Check if it's a song or album and add it to the respective list
        if (typeof item["type"] ==='string' && item["type"]  === 'track') {
            this.listenedSongs.push(item);
        } else if (typeof item["type"]  ==='string' && item["type"]  === 'album') {
            this.listenedAlbums.push(item);
        } else {
            throw new Error('Invalid item format (must be a song or album)');
        }
    }

    addRating(rating){
        if(typeof rating === 'object' && rating !== null){
            this.ratings.push(rating);
        }else{
            throw new Error('Invalid rating argument');
        }

    }

    addFriend(friendId){
        if(!friendId){
            throw new Error('Invalid friendId argument');
        }
        this.friendsList.push(friendId)
    }
}
