export default class RecipesModel {
  /**
   * @constructor
   * @param {Object} recipes
   */
  constructor(recipes) {
    this.recipes = recipes;
    this.recipesArray = [];
    this.dismissedRecipes = [];
    this.ingredientsArray = [];
    this.dismissedIngredients = [];
    this.appliancesArray = [];
    this.dismissedAppliances = [];
    this.ustensilsArray = [];
    this.dismissedUstensils = [];
    this.init();
  }

  /**
   * Prepare data for RecipesView initialization
   * Regroup ingredients, ustensils and appliances data in specific arrays
   * @returns {void}
   */
  init = () => {
    this.recipes.forEach((recipe) => {
      const { id, name, time, ingredients, appliance, ustensils, description } =
        recipe;
      this.recipesArray.push({ id, name, time, ingredients, description });
      if (ingredients && ingredients.length) {
        this.processRecipesIngredients(id, ingredients);
      }
      if (ustensils && ustensils.length) {
        this.processRecipesUstensils(id, ustensils);
      }
      if (appliance) {
        this.processRecipesAppliances(id, appliance);
      }
    });
    RecipesModel.sortByNames(this.ingredientsArray);
    RecipesModel.sortByNames(this.ustensilsArray);
    RecipesModel.sortByNames(this.appliancesArray);
  };

  /**
   * Send back processed data to RecipesModel
   * @callback callback : Set and fired in RecipesController
   * @returns {void}
   */
  bindProcessedData = (callback) => {
    this.onMainSearchResult = callback;
  };

  /**
   * Populate ingredientsArray property with formatted data
   * @param {Number} id
   * @param {Array} ingredients
   * @returns {void}
   */
  processRecipesIngredients = (id, ingredients) => {
    ingredients.forEach((ingredient) => {
      RecipesModel.populateItemsArray(
        id,
        ingredient.ingredient,
        this.ingredientsArray
      );
    });
  };

  /**
   * Populate appliancesArray property with formatted data
   * @param {Number} id
   * @param {String} appliance
   * @returns {void}
   */
  processRecipesAppliances = (id, appliance) => {
    RecipesModel.populateItemsArray(id, appliance, this.appliancesArray);
  };

  /**
   * Populate ustensilsArray property with formatted data
   * @param {Number} id
   * @param {Array} ustensils
   * @returns {void}
   */
  processRecipesUstensils = (id, ustensils) => {
    ustensils.forEach((ustensil) => {
      RecipesModel.populateItemsArray(id, ustensil, this.ustensilsArray);
    });
  };

  /**
   * Main search event handler
   * @param {String} inputValue
   * @returns {void}
   */
  processMainSearchValue = (inputValue) => {
    const matchesByName = RecipesModel.searchItemsArray(
      this.recipesArray,
      inputValue,
      'name'
    );
    this.onMainSearchResult(matchesByName);
  };

  static addMatches = (mainArray, matchesArray) => {
    let index = matchesArray.length;
    while (index) {
      index -= 1;
      mainArray.push(matchesArray[index]);
    }
  };

  static searchItemsArray = (itemsArray, stringVal) => {
    let index = itemsArray.length;
    const filteredRecipes = [];
    while (index) {
      index -= 1;
      if (
        RecipesModel.searchString(
          itemsArray[index].name.toLowerCase(),
          stringVal.toLowerCase()
        ) ||
        RecipesModel.searchString(
          itemsArray[index].description.toLowerCase(),
          stringVal.toLowerCase()
        ) /* ||
        RecipesModel.browseIngredients() */
      ) {
        filteredRecipes.push(itemsArray[index]);
        // this.trimIngredientsArray();
      }
    }
    return filteredRecipes;
  };

  static searchString = (stringVal, needle) => stringVal.includes(needle);

  /**
   * Callback binding test
   * @param {String} testStr
   * @returns {void}
   */
  sendProcessedData = (testStr) => {
    this.onMainSearchResult(`${testStr} et renvoyée à la view`);
  };

  /**
   * Process data to fill property array
   * Avoid duplicates
   * Sort items by name alphavetically
   * Set first letter to uppercase
   * @param {Number} id
   * @param {String} itemName
   * @param {Array} itemArray
   * @returns {void}
   */
  static populateItemsArray = (id, itemName, itemArray) => {
    const itemObject = itemArray.find(
      (element) => element.name.toLowerCase() === itemName.toLowerCase()
    );
    if (!itemObject) {
      const renamedItem = RecipesModel.firstLetterToUpper(itemName);
      itemArray.push({
        name: renamedItem,
        recipes: [id],
      });
    } else {
      itemObject.recipes.push(id);
    }
  };

  /**
   * Sort by string alphabetically (ascending)
   * @param {Array} elementsArray
   * @returns {void}
   */
  static sortByNames = (elementsArray) => {
    elementsArray.sort((a, b) => a.name.localeCompare(b.name));
  };

  /**
   * Set first letter to uppercase
   * @param {String} name
   * @returns {String}
   */
  static firstLetterToUpper = (name) =>
    `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}
