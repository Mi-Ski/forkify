import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeViews";
import * as listView from "./views/listView";
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
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log(`Error processing recipe! ${error}`);
    }
  }
};

/* 
	LIST CONTROLLER
*/

const controlList = () => {
  // Create new list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI (it's an array, so forEach)
  state.recipe.ingredients.forEach((el) => {
    // Saving to const b/c it returns item(uniqid, count, unit, ingredient)
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

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
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    controlList();
  }
  console.log(state.recipe);
});

window.l = new List();
