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
   * Send back processed data to RecipesModel
   * @callback callback : Set and fired in RecipesController
   * @returns {void}
   */
  bindMainSearchData = (callback) => {
    this.onMainSearchResult = callback;
  };

  bindDropdownSearch = (callback) => {
    this.onDropdownSearchResult = callback;
  };

  bindTagSearch = (callback) => {
    this.onTagSearchResult = callback;
  };

  /**
   * Main search event handler
   * @param {String} inputValue
   * @returns {void}
   */
  processMainSearchValue = (inputValue) => {
    this.mainSearchValue = inputValue.toLowerCase();
    this.refreshTagsRecipes();
    this.searchMatchingRecipes();
    this.onMainSearchResult({
      recipes: this.filteredRecipes,
      ingredients: this.filteredIngredients,
      appliances: this.filteredAppliances,
      ustensils: this.filteredUstensils,
    });
  };

  searchMatchingRecipes = () => {
    const recipes = this.tagsRecipes.length
      ? this.tagsRecipes
      : this.recipesArray;
    let index = recipes.length;
    this.filteredRecipes = [];
    this.clearFilters();
    while (index) {
      index -= 1;
      if (
        RecipesModel.searchString(
          recipes[index].name.toLowerCase(),
          this.mainSearchValue
        ) ||
        RecipesModel.searchString(
          recipes[index].description.toLowerCase(),
          this.mainSearchValue
        ) ||
        this.browseRecipeIngredients(
          recipes[index].ingredients,
          this.mainSearchValue
        )
      ) {
        this.filteredRecipes.push(recipes[index]);
        this.trimIngredientsArray(recipes[index].ingredients);
      }
    }
    this.filteredAppliances = RecipesModel.setArrayFromRecipesIds(
      this.filteredRecipes,
      this.appliancesArray
    );
    this.filteredUstensils = RecipesModel.setArrayFromRecipesIds(
      this.filteredRecipes,
      this.ustensilsArray
    );
  };

  browseRecipeIngredients = (ingredients) => {
    let index = ingredients.length;
    let matchFound = false;
    while (index && !matchFound) {
      index -= 1;
      matchFound = RecipesModel.searchString(
        ingredients[index].ingredient.toLowerCase(),
        this.mainSearchValue
      );
    }
    return matchFound;
  };

  trimIngredientsArray = (newIngredients) => {
    let index = newIngredients.length;
    while (index) {
      index -= 1;
      let matchFound = false;
      let mainIndex = this.filteredIngredients.length;
      while (mainIndex) {
        mainIndex -= 1;
        matchFound =
          newIngredients[index].ingredient.toLowerCase() ===
          this.filteredIngredients[mainIndex].name.toLowerCase();
        if (matchFound) {
          break;
        }
      }
      if (!matchFound) {
        const ingredient = this.getIngredientData(
          newIngredients[index].ingredient
        );
        if (ingredient) {
          this.filteredIngredients.push(ingredient);
        }
      }
    }
  };

  getIngredientData = (stringVal) => {
    let index = this.ingredientsArray.length;
    while (index) {
      index -= 1;
      const item = this.ingredientsArray[index];
      if (item.name.toLowerCase() === stringVal.toLowerCase()) {
        return item;
      }
    }
    return false;
  };

  static setArrayFromRecipesIds = (recipesArray, itemsArray) => {
    let itemsIndex = itemsArray.length;
    const filteredItems = [];
    while (itemsIndex) {
      itemsIndex -= 1;
      const itemRecipes = itemsArray[itemsIndex].recipes;
      for (let index = 0; index < itemRecipes.length; index += 1) {
        const item = itemsArray[itemsIndex];
        const itemRecipeId = itemRecipes[index];
        let recipesIndex = recipesArray.length;
        let matchFound = false;
        while (recipesIndex) {
          recipesIndex -= 1;
          if (itemRecipeId === recipesArray[recipesIndex].id) {
            matchFound = true;
            filteredItems.push(item);
            break;
          }
        }
        if (matchFound) {
          break;
        }
      }
    }
    return filteredItems;
  };

  processDropdownSearch = (idPrefix, inputValue, clear = false) => {
    let sourceArray = [];
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

  static searchMatchingDropdownItems = (sourceArray, stringVal) => {
    const searchResult = [];
    let index = sourceArray.length;
    while (index) {
      index -= 1;
      const item = sourceArray[index];
      if (
        RecipesModel.searchString(
          item.name.toLowerCase(),
          stringVal.toLowerCase()
        )
      ) {
        searchResult.push(item);
      }
    }
    return searchResult;
  };

  processTagSearch = (idPrefix, tagValue) => {
    let tag = null;
    this.clearFilters();
    switch (idPrefix) {
      case 'igr':
        if (this.filteredIngredients.length) {
          this.toggleTag(tagValue, this.filteredIngredients);
        }
        tag = this.toggleTag(tagValue, this.ingredientsArray);
        break;
      case 'apl':
        if (this.filteredAppliances.length) {
          this.toggleTag(tagValue, this.filteredAppliances);
        }
        tag = this.toggleTag(tagValue, this.appliancesArray);
        break;
      case 'ust':
        if (this.filteredUstensils.length) {
          this.toggleTag(tagValue, this.filteredUstensils);
        }
        tag = this.toggleTag(tagValue, this.ustensilsArray);
        break;
      default:
        break;
    }
    if (tag) {
      this.activeTags.push(...tag);
      this.restrictByTagsRecipesIds(...tag);
      this.refreshDisplayFromTags();
      this.onTagSearchResult({
        recipes: this.tagsRecipes,
        ingredients: this.filteredIngredients,
        appliances: this.filteredAppliances,
        ustensils: this.filteredUstensils,
      });
    }
  };

  removeTagFromSearch = (idPrefix, tagValue) => {
    let tag = null;
    tag = this.toggleTag(tagValue, this.activeTags);
    if (tag) {
      switch (idPrefix) {
        case 'igr':
          if (this.filteredIngredients.length) {
            this.filteredIngredients.push(...tag);
          }
          this.ingredientsArray.push(...tag);
          break;
        case 'apl':
          if (this.filteredAppliances.length) {
            this.filteredAppliances.push(...tag);
          }
          this.appliancesArray.push(...tag);
          break;
        case 'ust':
          if (this.filteredUstensils.length) {
            this.filteredUstensils.push(...tag);
          }
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

  toggleTag = (tagName, sourceArray) => {
    let tag = null;
    let index = sourceArray.length;
    while (index) {
      index -= 1;
      if (sourceArray[index].name === tagName) {
        tag = sourceArray.splice(index, 1);
        break;
      }
    }
    return tag;
  };

  restrictByTagsRecipesIds = (sourceArray) => {
    let rcpIndex = this.tagsRecipes.length;
    const newRecipes = sourceArray.recipes;
    if (rcpIndex) {
      while (rcpIndex) {
        rcpIndex -= 1;
        let found = false;
        for (let index = 0; index < newRecipes.length; index += 1) {
          const recipe = newRecipes[index];
          found = recipe === this.tagsRecipes[rcpIndex].id;
          if (found) {
            break;
          }
        }
        if (!found) {
          this.tagsRecipes.splice(rcpIndex, 1);
        }
      }
    } else {
      this.addtagsRecipesFromId(newRecipes);
    }
  };

  refreshDisplayFromTags = () => {
    const recipesArray = this.filteredRecipes.length
      ? this.filteredRecipes
      : this.recipesArray;
    let tagsIndex = this.tagsRecipes.length;
    while (tagsIndex) {
      tagsIndex -= 1;
      let found = false;
      let rcpIndex = recipesArray.length;
      while (rcpIndex && !found) {
        rcpIndex -= 1;
        found = recipesArray[rcpIndex].id === this.tagsRecipes[tagsIndex].id;
        if (found) {
          this.trimIngredientsArray(recipesArray[rcpIndex].ingredients);
        }
      }
      if (!found) {
        this.tagsRecipes.splice(tagsIndex, 1);
      }
    }
    this.filteredAppliances = RecipesModel.setArrayFromRecipesIds(
      this.tagsRecipes,
      this.appliancesArray
    );
    this.filteredUstensils = RecipesModel.setArrayFromRecipesIds(
      this.tagsRecipes,
      this.ustensilsArray
    );
  };

  refreshTagsRecipes = () => {
    if (this.activeTags.length) {
      let tagsIndex = this.activeTags.length;
      this.tagsRecipes = [];
      while (tagsIndex) {
        tagsIndex -= 1;
        this.restrictByTagsRecipesIds(this.activeTags[tagsIndex]);
      }
    }
  };

  addtagsRecipesFromId = (sourceArray) => {
    let tagsIndex = sourceArray.length;
    while (tagsIndex) {
      tagsIndex -= 1;
      let found = false;
      let rcpIndex = this.recipesArray.length;
      while (rcpIndex && !found) {
        rcpIndex -= 1;
        found = this.recipesArray[rcpIndex].id === sourceArray[tagsIndex];
        if (found) {
          this.tagsRecipes.push(this.recipesArray[rcpIndex]);
        }
      }
    }
  };

  clearFilters = () => {
    this.filteredIngredients = [];
    this.filteredAppliances = [];
    this.filteredUstensils = [];
  };

  static searchString = (stringVal, needle) => stringVal.includes(needle);

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
