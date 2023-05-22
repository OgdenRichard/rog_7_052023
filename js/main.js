import recipes from './recipes.js';
import RecipesView from './RecipesView.js';

const View = new RecipesView(recipes);
View.init();
