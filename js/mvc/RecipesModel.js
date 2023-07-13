export default class RecipesModel {
  /**
   * @constructor
   * @param {Object} recipes
   */
  constructor(recipes) {
    this.recipes = recipes;
    this.mainSearchValue = '';
    this.recipesArray = [];
    this.filteredRecipes = [];
    this.ingredientsArray = [];
    this.filteredIngredients = [];
    this.appliancesArray = [];
    this.filteredAppliances = [];
    this.ustensilsArray = [];
    this.filteredUstensils = [];
    this.activeTags = [];
    this.tagsRecipes = [];
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
   * Populate ingredientsArray property with formatted data
   * @param {number} id
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
   * @param {number} id
   * @param {String} appliance
   * @returns {void}
   */
  processRecipesAppliances = (id, appliance) => {
    RecipesModel.populateItemsArray(id, appliance, this.appliancesArray);
  };

  /**
   * Populate ustensilsArray property with formatted data
   * @param {number} id
   * @param {Array} ustensils
   * @returns {void}
   */
  processRecipesUstensils = (id, ustensils) => {
    ustensils.forEach((ustensil) => {
      RecipesModel.populateItemsArray(id, ustensil, this.ustensilsArray);
    });
  };

  /**
   * Send back processed data from Main search to RecipesModel
   * @callback callback : Set and fired in RecipesController
   * @returns {void}
   */
  bindMainSearchData = (callback) => {
    this.onMainSearchResult = callback;
  };

  /**
   * Send back processed data from Dropdown search to RecipesModel
   * @callback callback : Set and fired in RecipesController
   * @returns {void}
   */
  bindDropdownSearch = (callback) => {
    this.onDropdownSearchResult = callback;
  };

  /**
   * Send back processed data from Tag search to RecipesModel
   * @callback callback : Set and fired in RecipesController
   * @returns {void}
   */
  bindTagSearch = (callback) => {
    this.onTagSearchResult = callback;
  };

  /**
   * Remove multiple whitespaces between words and convert string to lower case
   * @param {string} inputValue
   * @returns {void}
   */
  setMainSearchValue = (inputValue) => {
    this.mainSearchValue = inputValue.replace(/\s+/g, ' ').toLowerCase();
  };

  /**
   * Main search event handler
   * @param {string} inputValue
   * @returns {void}
   */
  processMainSearchValue = (inputValue) => {
    this.setMainSearchValue(inputValue);
    this.refreshTagsRecipes();
    this.searchMatchingRecipes();
    this.onMainSearchResult({
      recipes: this.filteredRecipes,
      ingredients: this.filteredIngredients,
      appliances: this.filteredAppliances,
      ustensils: this.filteredUstensils,
    });
  };

  /**
   * Set filtered arrays from main search values and tags filtering
   * @returns {void}
   */
  searchMatchingRecipes = () => {
    const recipes = this.tagsRecipes.length
      ? this.tagsRecipes
      : this.recipesArray;
    this.filteredRecipes = [];
    this.clearFilters();
    this.filteredRecipes = recipes.filter(
      (recipe) =>
        RecipesModel.searchString(
          recipe.name.toLowerCase(),
          this.mainSearchValue
        ) ||
        RecipesModel.searchString(
          recipe.description.toLowerCase(),
          this.mainSearchValue
        ) ||
        this.browseRecipeIngredients(recipe.ingredients, this.mainSearchValue)
    );
    this.filteredRecipes.forEach((recipe) => {
      this.trimIngredientsArray(recipe.ingredients);
    });
    this.filteredAppliances = RecipesModel.setArrayFromRecipesIds(
      this.filteredRecipes,
      this.appliancesArray
    );
    this.filteredUstensils = RecipesModel.setArrayFromRecipesIds(
      this.filteredRecipes,
      this.ustensilsArray
    );
  };

  /**
   * Search for matching elements in a recipe ingrediens
   * @param {string} ingredients
   * @returns {boolean}
   */
  browseRecipeIngredients = (ingredients) => {
    const matches = ingredients.filter((ingredient) =>
      RecipesModel.searchString(
        ingredient.ingredient.toLowerCase(),
        this.mainSearchValue
      )
    );
    return matches.length > 0;
  };

  /**
   * Add all recipes ingredients to this.filteredIngredients
   * Used if any match is found whith main search value in current recipe
   * Avoid duplicates ingredients
   * @param {Array} newIngredients
   * @returns {void}
   */
  trimIngredientsArray = (newIngredients) => {
    newIngredients.forEach((newIngredient) => {
      const ingredient = this.getIngredientData(newIngredient.ingredient);
      if (
        ingredient &&
        !this.filteredIngredients.some(
          (element) => element.id === ingredient.id
        )
      ) {
        this.filteredIngredients.push(ingredient);
      }
    });
  };

  /**
   * Retrieve current ingredient data from ingredientsArray
   * @param {string} stringVal
   * @returns {boolean | Object} ingredient object or false if there is no match
   */
  getIngredientData = (stringVal) => {
    const result = this.ingredientsArray.filter(
      (ingredient) => ingredient.name.toLowerCase() === stringVal.toLowerCase()
    );
    return result[0];
  };

  /**
   * Set an array of ustensils or appliances from filtered recipes
   * @param {Array} recipesArray
   * @param {Array} itemsArray
   * @returns {Array}
   */
  static setArrayFromRecipesIds = (recipesArray, itemsArray) => {
    const filteredItems = [];
    itemsArray.forEach((item) => {
      item.recipes.forEach((recipeId) => {
        const res = recipesArray.filter((recipe) => recipe.id === recipeId);
        if (
          res.length &&
          !filteredItems.some((element) => element.id === item.id)
        ) {
          filteredItems.push(item);
        }
      });
    });
    return filteredItems;
  };

  /**
   * Filter dropdown items from user input
   * @param {string} idPrefix
   * @param {string} inputValue
   * @param {boolean} clear
   * @returns {void}
   */
  processDropdownSearch = (idPrefix, inputValue) => {
    let sourceArray = [];
    const clear =
      !this.activeTags.length &&
      !this.filteredIngredients.length &&
      !this.filteredAppliances.length &&
      !this.filteredUstensils.length &&
      this.mainSearchValue.length < 3;
    switch (idPrefix) {
      case 'igr':
        sourceArray = !clear ? this.filteredIngredients : this.ingredientsArray;
        break;
      case 'apl':
        sourceArray = !clear ? this.filteredAppliances : this.appliancesArray;
        break;
      case 'ust':
        sourceArray = !clear ? this.filteredUstensils : this.ustensilsArray;
        break;
      default:
        break;
    }
    if (inputValue.length) {
      let result = [];
      result = RecipesModel.searchMatchingDropdownItems(
        sourceArray,
        inputValue
      );
      this.onDropdownSearchResult(result, idPrefix);
    } else if (sourceArray.length) {
      this.onDropdownSearchResult(sourceArray, idPrefix);
    }
  };

  /**
   * Search for matching items in dropdown array
   * @param {Array} sourceArray
   * @param {string} stringVal
   * @returns {Array}
   */
  static searchMatchingDropdownItems = (sourceArray, stringVal) => {
    const searchResult = sourceArray.filter((item) =>
      RecipesModel.searchString(
        item.name.toLowerCase(),
        stringVal.toLowerCase()
      )
    );
    return searchResult;
  };

  /**
   * Perform tag filtering on new tag added
   * @param {string} idPrefix
   * @param {string} tagValue
   * @returns {void}
   */
  processTagSearch = (idPrefix, tagValue) => {
    let tag = null;
    this.clearFilters();
    switch (idPrefix) {
      case 'igr':
        tag = RecipesModel.toggleTag(tagValue, this.ingredientsArray);
        break;
      case 'apl':
        tag = RecipesModel.toggleTag(tagValue, this.appliancesArray);
        break;
      case 'ust':
        tag = RecipesModel.toggleTag(tagValue, this.ustensilsArray);
        break;
      default:
        break;
    }
    if (tag) {
      this.activeTags.push(...tag);
      this.restrictByTagsRecipesIds(...tag);
      this.refreshFiltersFromTags();
      this.onTagSearchResult({
        recipes: this.tagsRecipes,
        ingredients: this.filteredIngredients,
        appliances: this.filteredAppliances,
        ustensils: this.filteredUstensils,
      });
    }
  };

  /**
   * Refresh tag search on tag removal
   * @param {string} idPrefix
   * @param {string} tagValue
   * @returns {void}
   */
  removeTagFromSearch = (idPrefix, tagValue) => {
    let tag = null;
    tag = RecipesModel.toggleTag(tagValue, this.activeTags);
    if (tag) {
      switch (idPrefix) {
        case 'igr':
          this.ingredientsArray.push(...tag);
          break;
        case 'apl':
          this.appliancesArray.push(...tag);
          break;
        case 'ust':
          this.ustensilsArray.push(...tag);
          break;
        default:
          break;
      }
      if (this.activeTags.length) {
        this.refreshTagsRecipes();
        this.searchMatchingRecipes();
        this.onTagSearchResult({
          recipes: this.filteredRecipes,
          ingredients: this.filteredIngredients,
          appliances: this.filteredAppliances,
          ustensils: this.filteredUstensils,
        });
      } else {
        this.tagsRecipes = [];
        this.processMainSearchValue(this.mainSearchValue);
      }
    }
  };

  /**
   * Search and remove tag from array if any match is found
   * @param {string} tagName
   * @param {Array} sourceArray
   * @returns {null | Array} Array of one tag object on match, null otherwise
   */
  static toggleTag = (tagName, sourceArray) => {
    let tag = null;
    const tagIndex = sourceArray.findIndex((el) => el.name === tagName);
    if (tagIndex > -1) {
      tag = sourceArray.splice(tagIndex, 1);
    }
    return tag;
  };

  /**
   * Performs array intersection with current tag recipes
   * @param {Object} tag
   * @returns {void}
   */
  restrictByTagsRecipesIds = (tag) => {
    const newRecipes = tag.recipes;
    if (this.tagsRecipes.length) {
      const updatedRecipes = [];
      newRecipes.forEach((id) => {
        const found = this.tagsRecipes.filter(
          (tagRecipe) => tagRecipe.id === id
        );
        if (found.length) {
          updatedRecipes.push(...found);
        }
      });
      this.tagsRecipes = updatedRecipes;
    } else {
      this.addtagsRecipesFromId(newRecipes);
    }
  };

  /**
   * Filter dropdowns and recipes from tags
   * @returns {void}
   */
  refreshFiltersFromTags = () => {
    const recipesArray = this.filteredRecipes.length
      ? this.filteredRecipes
      : this.recipesArray;
    const updatedTagRecipes = [];
    this.tagsRecipes.forEach((tagRecipe) => {
      const matches = recipesArray.filter(
        (recipe) => recipe.id === tagRecipe.id
      );
      if (matches.length) {
        this.trimIngredientsArray(matches[0].ingredients);
        updatedTagRecipes.push(...matches);
      }
    });
    this.tagsRecipes = updatedTagRecipes;
    this.filteredAppliances = RecipesModel.setArrayFromRecipesIds(
      this.tagsRecipes,
      this.appliancesArray
    );
    this.filteredUstensils = RecipesModel.setArrayFromRecipesIds(
      this.tagsRecipes,
      this.ustensilsArray
    );
  };

  /**
   * Refresh tagRecipes array from all active tags
   * @returns {void}
   */
  refreshTagsRecipes = () => {
    if (this.activeTags.length) {
      this.tagsRecipes = [];
      this.activeTags.forEach((tag) => {
        this.restrictByTagsRecipesIds(tag);
      });
    }
  };

  /**
   * Add recipes from a single tag
   * @param {Array} sourceArray
   * @returns {void}
   */
  addtagsRecipesFromId = (sourceArray) => {
    sourceArray.forEach((id) => {
      const newTagRecipe = this.recipesArray.filter(
        (recipe) => recipe.id === id
      );
      if (newTagRecipe.length) {
        this.tagsRecipes.push(...newTagRecipe);
      }
    });
  };

  /**
   * Clear dropdown filters arrays
   * @returns {void}
   */
  clearFilters = () => {
    this.filteredIngredients = [];
    this.filteredAppliances = [];
    this.filteredUstensils = [];
  };

  /**
   * Process data to fill property array
   * Avoid duplicates
   * Sort items by name alphabetically
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
        id: itemArray.length,
        name: renamedItem,
        recipes: [id],
      });
    } else {
      itemObject.recipes.push(id);
    }
  };

  /**
   * Search needle in string value
   * @param {string} stringVal
   * @param {string} needle
   * @returns {boolean}
   */
  static searchString = (stringVal, needle) => stringVal.includes(needle);

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
