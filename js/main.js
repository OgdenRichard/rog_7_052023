import recipes from './recipes.js';
import RecipesView from './RecipesView.js';
import RecipesModel from './RecipesModel.js';

const Model = new RecipesModel(recipes);
const View = new RecipesView(
  Model.recipesArray,
  Model.ingredientsArray,
  Model.ustensilsArray,
  Model.appliancesArray
);
View.init();
