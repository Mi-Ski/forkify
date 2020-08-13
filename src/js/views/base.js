// DOM ELEMENTS AND CODE REUSABLE BETWEEN VIEWS
export const elements = {
	searchInput: document.querySelector(".search__field"),
    searchForm: document.querySelector(".search"),
    searchRes: document.querySelector(".results"),
    searchResList: document.querySelector(".results__list"),
    searchResPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    shopping: document.querySelector(".shopping__list"),
    likesMenu: document.querySelector(".likes__field"),
    likesList: document.querySelector(".likes__list")
};

export const elementSrings = {
    loader: 'loader'
}

export const spinner = (parent) => {
	const spinDOM = `
	<div class="${elementSrings.loader}">
	    <svg>
		<use href="img/icons.svg#icon-cw"></use>
	    </svg>
	</div>
	    `;
	parent.insertAdjacentHTML('afterbegin', spinDOM)
};

export const removeSpinner = () => {
    const loader = document.querySelector(`.${elementSrings.loader}`)
    //deleting a dom element requires moving to the parent and removing its child from there
    if (loader) {
        loader.parentElement.removeChild(loader)
    }
}
