//curly braces when importing selected named variables
import { elements } from "./base";

//select the dom element, read the value and return it
export const getInput = () => elements.searchInput.value;

const renderRecipe = (recipe) => {
	let markup = `
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
        </li>
    `;
	//inserts the 'markup' element into the dom tree, after the last one, inside the parent.
	elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

//clears the input after clicking Search
//in curly braces so there's no implicit return
export const clearInput = () => {
	elements.searchInput.value = ``;
};

//clearing previous recipes from the ui list
export const clearPrevious = () => {
	//deleting all of the inner li elements
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = '';
};

//////////////////////////////////////////////////////////////////////////
// formatting the recipe title

const limitRecipeTitle = (title, limit = 17) => {
	let newTitle = [];

	let reduceFunc = (acc, cur) => {
		if (acc + cur.length <= limit) {
			newTitle.push(cur);
        }
        //calculation needed only until the point where acc is bigger than the limit
		return acc + cur.length;
	};

	if (title.length > limit) {
            //first 2 arguments of a reduce callback function are: previousValue and currentValue
            //this reduce has the accumulator and current as the first parameter
            //2nd parameter here is initialValue (0) of the accumulator
            //title.split(" ") returns an array of individual words
        title.split(" ").reduce(reduceFunc, 0);
            //return the result, .join will join it into a string separated by spaces
        return `${newTitle.join(' ')}...`;
	}
	return title;
};

///////////////////////////////////////////////////
// rendering buttons
// side will be either left or right, type: 'prev' or 'next'

const buttonHtml = (page, type) =>
    `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage); 

    let button;
    if (page === 1 && pages > 1) {
        //only button to the next page 
        button = buttonHtml(page, 'next')
    } else if (page < pages && page !== 1) {
        //both buttons
        button = `
            ${button = buttonHtml(page, 'prev')}
            ${button = buttonHtml(page, 'next')} 
        `;
    } else if (page === pages && pages > 1) {
        //only button to the previous page
        button = buttonHtml(page, 'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //calculate results of the current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
        //slice extracts up to but not including the End
    recipes.slice(start, end).forEach(renderRecipe);
    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage)
};
