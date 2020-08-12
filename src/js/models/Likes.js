export default class Likes {
    constructor () {
        this.likes = [];
    }

    addLike(id, title, author, image) {
       const like = {id, title, author, image} 
       this.likes.push(like)
       return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        // findIndex returns -1 when false
        // if there is an element with matching id (is liked), true is returned 
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}