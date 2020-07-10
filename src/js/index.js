import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, spinner, removeSpinner } from "./views/base";

/* Global state of the app:
- Search objects
- Current recipe object
- Shopping list object
- Liked recipes
*/

const state = {};

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
	}
};

elements.searchForm.addEventListener("submit", (e) => {
	//prevents reloading the page after submitting
	e.preventDefault();
	submitClicked();
});
