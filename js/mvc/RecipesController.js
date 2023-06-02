/* eslint-disable import/extensions */
import recipes from '../data/recipes.js';
import RecipesView from './RecipesView.js';
import RecipesModel from './RecipesModel.js';

export default class RecipesController {
  constructor() {
    this.model = new RecipesModel(recipes);
    this.view = new RecipesView(
      this.model.recipesArray,
      this.model.ingredientsArray,
      this.model.ustensilsArray,
      this.model.appliancesArray
    );
  }

  init = () => {
    this.view.render();
  };
}
