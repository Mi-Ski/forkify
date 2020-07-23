import Search from "./models/Search";
import Recipe from "./models/Recipe"
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
	const query = searchView.getInput();

	if (query) {
		//new search object and add to state
		state.search = new Search(query);
		//prepare UI for results
		searchView.clearInput();
		searchView.clearPrevious();
        spinner(elements.searchRes)
		//PAUSE until the search for recipes is complete
		await state.search.getResults();
        //show the results on the ui. Search.result = recipe
        removeSpinner();
		searchView.renderResults(state.search.result);
		console.log(state.search.result);
	}
};

elements.searchForm.addEventListener("submit", (e) => {
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

let r = new Recipe('2ea734');
r.getRecipe()