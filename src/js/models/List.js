import * as recipeView from "../views/recipeViews";
import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    //an array where each object has count, unit and ingredient
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);
    return item;
  }

  deleteItem(identifier) {
    //will find the index of the element that satisfies the condition
    const index = this.items.findIndex(
      (currentElement) => currentElement.id === identifier
    );

    //[0,3,6,7] splice(1, 2)   -> returns[3,6], original array is [0,7]
    //[0,3,6,7] slice(1, 2)    -> returns[3], original array is [0,3,6,7]
    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
      this.items.find(el => el.id === id).count = parseFloat(newCount);
  }
  
}