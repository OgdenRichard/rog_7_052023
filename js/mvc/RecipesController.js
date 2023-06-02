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

  refreshView = (data) => {
    this.view.refreshGridTest(data);
  };

  init = () => {
    this.view.render();
    this.view.mainSearchTrigger(this.model.processMainSearchValue);
    this.model.bindProcessedData(this.refreshView);
  };
}
