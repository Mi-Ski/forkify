import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeViews";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, spinner, removeSpinner } from "./views/base";

/* Global state of the app:
- Search objects
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};
window.state = state;
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
		spinner(elements.searchRes);
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

elements.searchResPages.addEventListener("click", (e) => {
	//event delegation
	const btn = e.target.closest(".btn-inline");
	if (btn) {
		const goTo = parseInt(btn.dataset.goto, 10);
		searchView.clearPrevious();
		searchView.renderResults(state.search.result, goTo);
		console.log(goTo);
	}
});

/* 
	RECIPE CONTROLLER
*/
const controlRecipe = async () => {
	//deleting # from the window hash string
	const id = window.location.hash.replace("#", "");

	if (id) {
		if (state.search) searchView.highlightSelected(id);
		//prepare ui for the changes
		recipeView.clearRecipeView();
		spinner(elements.recipe);
		//create a new recipe object
		state.recipe = new Recipe(id);

		try {
			//get recipe data and parse the ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			//calc time and servings
			state.recipe.calcTime();
			state.recipe.calcServings();

			//render the recipe on ui
			removeSpinner();
			recipeView.renderRecipe(
				state.recipe,
				state.likes.isLiked(id)
			);

		} catch (error) {
			console.log(`Error processing recipe! ${error}`);
		}
	}
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
["hashchange", "load"].forEach((event) => window.addEventListener(event, controlRecipe));

/* 
	LIST CONTROLLER
*/

const controlList = () => {
	// Create new list if there is none yet
	if (!state.list) {
		state.list = new List();
	}

	// Add each ingredient to the list and UI (it's an array, so forEach)
	state.recipe.ingredients.forEach((el) => {
		// Saving to const b/c it returns item(uniqid, count, unit, ingredient)
		let item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

// Handle, delete and update list item events
elements.shopping.addEventListener("click", (e) => {
	const id = e.target.closest(".shopping__item").dataset.itemid;
	console.log(id);
	//console.log(e.target.value);
	// Handle the delete button
	if (e.target.matches(".shopping__delete, .shopping__delete *")) {
		// Delete from state
		state.list.deleteItem(id);

		// Delete from UI
		listView.deleteItem(id);
		// Handel the count update
	} else if (e.target.matches(".shopping__count *")) {
		let val = parseFloat(e.target.value);
		console.log(val);
		state.list.updateCount(id, val);
	}
});

/* 
	LIKES CONTROLLER
*/
// TESTING
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes())	

const controlLike = () => {
	if (!state.likes) {
		state.likes = new Likes();
	};

	const currentId = state.recipe.id;

	// user has not yet liked a recipe
	if (!state.likes.isLiked(currentId)) {
		// 1. add like to the state
		const newLike = state.likes.addLike(
			currentId,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		);

		// 2. toggle the like button
		likesView.toggleLikeButton(true)

		// 3. add like to the UI
		likesView.renderLike(newLike);

		// the recipe is already liked
	} else {
		// 1. remove like from the state
		state.likes.deleteLike(currentId);

		// 2. toggle the like button
		likesView.toggleLikeButton(false);

		// 3. remove like from the UI
		likesView.deleteLike(currentId);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes())
};

// Handling recipe button clicks
// Event delegation, elements are not yet on the page when it loads
elements.recipe.addEventListener("click", (e) => {
	// btn-decrease *     -> any child of btn-decrease
	if (e.target.matches(".btn-decrease, .btn-decrease *")) {
		if (state.recipe.servings > 1) {
			state.recipe.updateServings("dec");
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches(".btn-increase, .btn-increase *")) {
		if (state.recipe.servings < 12) {
			state.recipe.updateServings("inc");
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches(".recipe__btn-add, .recipe__btn-add *")) {
		// adding ingredients to the shopping list
		controlList();
	} else if (e.target.matches(".recipe__love, .recipe__love *")) {
		// call the likes controller
		controlLike();
	}

	console.log(state.recipe);
});

window.l = new List();
