import recipes from './recipes.js';
import RecipesView from './RecipesView.js';
import RecipesModel from './RecipesModel.js';

const View = new RecipesView(recipes);
const Model = new RecipesModel(recipes);
Model.init();
View.init();
