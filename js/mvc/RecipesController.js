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
  onMainSearchResult = (result) => {
    this.view.refreshFromMainSearch(result);
  };

  onAddNewTag = (idPrefix, tagValue) => {
    this.model.processTagSearch(idPrefix, tagValue);
  };

  static onDropdownSearchResult = (resultArray, idPrefix) => {
    RecipesView.refreshDropdownItems(resultArray, idPrefix);
  };

  /**
   * Launch view rendering on page load
   * Bind event handlers and callbacks between RecipesModel and RecipesView
   * @returns {void}
   */
  init = () => {
    this.view.render();
    this.view.bindAddNewTag(this.onAddNewTag);
    this.view.mainSearchTrigger(this.model.processMainSearchValue);
    this.view.ingredientsSearchTrigger(this.model.processDropdownSearch);
    this.model.bindMainSearchData(this.onMainSearchResult);
    this.model.bindDropdownSearch(RecipesController.onDropdownSearchResult);
  };
}
