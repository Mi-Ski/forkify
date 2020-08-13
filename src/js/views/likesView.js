import { elements } from './base';

// isLiked = boolean
export const toggleLikeButton = (isLiked) => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
    // icons.svg#icon-heart-outlined
}