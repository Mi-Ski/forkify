
//Searching recipes with the api; query will be: const query = searchView.getInput();
import axios from "axios";

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		try {
			let result = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			this.result = result.data.recipes;
			//console.log(this.result);
		} catch (err) {
			alert(err);
		}
	}
}
