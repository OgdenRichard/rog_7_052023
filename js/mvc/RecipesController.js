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
   * @param {Object} result
   * @returns {void}
   */
  onMainSearchResult = (result) => {
    this.view.refreshFromCrossedSearch(result);
  };

  /**
   * @callback for RecipesModel.bindTagSearch
   * @param {Object} result
   * @returns {void}
   */
  onTagSearchResult = (result) => {
    this.view.refreshFromCrossedSearch(result);
  };

  /**
   * @callback for RecipesModel.bindDropdownSearch
   * @param {Object} result
   * @returns {void}
   */
  onDropdownSearchResult = (resultArray, idPrefix) => {
    this.view.refreshDropdownItems(resultArray, idPrefix);
  };

  /**
   * @callback for RecipesView.bindDropdownTextSearch
   * @param {string} idPrefix
   * @param {string} inputValue
   * @returns {void}
   */
  onDropdownTextSearch = (idPrefix, inputValue) => {
    this.model.processDropdownSearch(idPrefix, inputValue);
  };

  /**
   * @callback for RecipesView.bindAddNewTag
   * @param {string} idPrefix
   * @param {number} tagValue
   * @returns {void}
   */
  onAddNewTag = (idPrefix, tagValue) => {
    this.model.processTagSearch(idPrefix, tagValue);
  };

  /**
   * @callback for RecipesView.bindRemoveTag
   * @param {string} idPrefix
   * @param {number} tagValue
   * @returns {void}
   */
  onRemoveTag = (idPrefix, tagValue) => {
    this.model.removeTagFromSearch(idPrefix, tagValue);
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
