
//Getting precise data about a particular recipe
import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe() {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
	    	this.author = res.data.recipe.publisher;
	   		this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
	} catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        //calculating` prep time if every 3 ingredients increase the prep time by 15mins
        const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
    }
   
    //for the sake of simplicity number of servings will always be 4
    calcServings() {
        this.servings = 4;
    }

    //unifying and separating the ingredients
    parseIngredients() {
		const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

		const newIngredients = this.ingredients.map(el => {

			//1 uniform units
			let ingredient = el.toLowerCase();

			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i])
			});

			//2 remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			//3 parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(' ')
			//true/false. for each element checks if it's inside the unitsShort array. returns index of the position where it turns out to be true
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //there is a unit
                const arrCount = arrIng.slice(0, unitIndex)

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    //eval evaluates the string as a js code, will do the math
                    //arrCount [4, 1/2] -> 4 + 1/2 -> 4,5
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(3).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                //there is no unit, but the 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                    //ingredient: ingredient
                }
            }

			return objIng;
		});
		this.ingredients = newIngredients;
    }

    updateServings(type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        //ingredients
        this.ingredients.forEach(ing => {
            // ing.count = ing.count * (newServings / this.servings)
            ing.count *= (newServings / this.servings)
        })

        this.servings = newServings;
    }
}
