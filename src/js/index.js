
import axios from 'axios';

async function getResults(query) {
    try {
    let result = await axios(`https://forkify-api.herokuapp.com/api/search?q=${query}`)
    const recipes = result.data.recipes
    console.log(recipes);
    }
    catch(error){
        alert(error)
    }

}
getResults('carrot');