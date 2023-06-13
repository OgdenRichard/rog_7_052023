/* eslint-disable import/extensions */
import recipes from '../data/recipes.js';
import RecipesView from './RecipesView.js';
import RecipesModel from './RecipesModel.js';

export default class RecipesController {
  /**
   * @constructor
   */
  constructor() {
    this.model = new RecipesModel(recipes);
    this.view = new RecipesView(
      this.model.recipesArray,
      this.model.ingredientsArray,
      this.model.ustensilsArray,
      this.model.appliancesArray
    );
  }

  /**
   * @callback for RecipesModel.bindProcessedData
   * @param {Object} processRecipesUstensils
   * @returns {void}
   */
  refreshView = (result) => {
    this.view.refreshFromMainSearch(result);
  };

  refreshIngredients = (ingredientsArray) => {
    RecipesView.refreshIngredients(ingredientsArray);
  };

  /**
   * Launch view rendering on page load
   * Bind event handlers and callbacks between RecipesModel and RecipesView
   * @returns {void}
   */
  init = () => {
    this.view.render();
    this.view.mainSearchTrigger(this.model.processMainSearchValue);
    this.view.ingredientsSearchTrigger(this.model.processDropdownSearch);
    this.model.bindProcessedData(this.refreshView);
    this.model.bindIngredientsSearch(this.refreshIngredients);
  };
}
