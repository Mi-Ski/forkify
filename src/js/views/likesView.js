import { elements } from './base';
import { limitRecipeTitle } from './searchView';

// isLiked = boolean
export const toggleLikeButton = (isLiked) => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
    // icons.svg#icon-heart-outlined
}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = like => {
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.image}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title, 21)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = likeId => {
    // Parent of an element with a href attribute css selector
    const el = document.querySelector(`.likes__link[href*="${likeId}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}