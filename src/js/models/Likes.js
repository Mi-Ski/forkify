export default class Likes {
    constructor () {
        this.likes = [];
    }

    addLike(id, title, author, image) {
       const like = {id, title, author, image};
       this.likes.push(like);

        //  Add data to localStorage
        this.persistData();
       return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Delete data from localStorage
        this.persistData();
    }

    isLiked(id) {
        // findIndex returns -1 when false
        // if there is an element with matching id (is liked), true is returned 
        return this.likes.findIndex(el => el.id === id) !== -1
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Reassign likes from the local storage
        if (storage) this.likes = storage;
    }
}