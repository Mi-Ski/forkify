
// no need to specify .js when importing
import x from './models/Search'

//import {add as a, multiply as m, ID} from './views/searchView'

// * imports everything as a named object
import * as searchView from './views/searchView'

console.log(`Using imported functions! adding: ${searchView.add(searchView.ID, 23)}... multiplying: ${searchView.multiply(parseInt('15'), 9)}... also, ${x} test`);
