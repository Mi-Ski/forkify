import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, spinner, removeSpinner } from "./views/base";

/* Global state of the app:
- Search objects
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};

/* 
	SEARCH CONTROLLER
*/

let submitClicked = async () => {
	//get query from the form input
	//const query = searchView.getInput();
	const query = 'fig';
	
	if (query) {
		//new search object and add to state
		state.search = new Search(query);
		//prepare UI for results
		searchView.clearInput();
		searchView.clearPrevious();
        	spinner(elements.searchRes)
		try {
			//PAUSE until the search for recipes is complete
			await state.search.getResults();
			//show the results on the ui. Search.result = recipe
			removeSpinner();
			searchView.renderResults(state.search.result);
		} catch (error) {
			console.log(error);
			removeSpinner();
		}
	}
};

elements.searchForm.addEventListener("submit", (e) => {
	//prevents reloading the page after submitting
	e.preventDefault();
	submitClicked();
});

//TESTING
window.addEventListener("load", (e) => {
	//prevents reloading the page after submitting
	e.preventDefault();
	submitClicked();
});

elements.searchResPages.addEventListener('click', e => {
	//event delegation
	const btn = e.target.closest('.btn-inline')
	if (btn) {
		const goTo = parseInt(btn.dataset.goto, 10);
		searchView.clearPrevious();
		searchView.renderResults(state.search.result, goTo);
		console.log(goTo);
	}
})

/* 
	RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    //deleting # from the window hash string
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
	//prepare ui for the changes
	
	//create a new recipe object
	state.recipe = new Recipe(id);
	window.r = state.recipe;

	try {
		//get recipe data
		await state.recipe.getRecipe();

		//calc time and servings
		state.recipe.calcTime();
		state.recipe.calcServings();

		//render the recipe on ui
		console.log(state.recipe);
		
	}  catch (error) {
	    console.log(`Error processing recipe! ${error}`);
	}
    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
