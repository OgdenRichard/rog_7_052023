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

  onDropdownSearchResult = (resultArray, idPrefix) => {
    this.view.refreshDropdownItems(resultArray, idPrefix);
  };

  onTagSearchResult = (result) => {
    this.view.refreshFromMainSearch(result);
  };

  onDropdownTextSearch = (idPrefix, inputValue, clear = false) => {
    this.model.processDropdownSearch(idPrefix, inputValue, clear);
  };

  onAddNewTag = (idPrefix, tagValue, clear = false) => {
    this.model.processTagSearch(idPrefix, tagValue, clear);
  };

  onRemoveTag = (idPrefix, tagValue, clear = false) => {
    this.model.removeTagFromSearch(idPrefix, tagValue, clear);
  };

  /**
   * Launch view rendering on page load
   * Bind event handlers and callbacks between RecipesModel and RecipesView
   * @returns {void}
   */
  init = () => {
    this.view.render();
    this.view.mainSearchTrigger(this.model.processMainSearchValue);
    this.view.bindDropdownTextSearch(this.onDropdownTextSearch);
    this.view.bindAddNewTag(this.onAddNewTag);
    this.view.bindRemoveTag(this.onRemoveTag);
    this.model.bindMainSearchData(this.onMainSearchResult);
    this.model.bindTagSearch(this.onTagSearchResult);
    this.model.bindDropdownSearch(this.onDropdownSearchResult);
  };
}
