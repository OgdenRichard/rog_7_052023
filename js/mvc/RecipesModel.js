export default class RecipesModel {
  /**
   * @constructor
   * @param {Object} recipes
   */
  constructor(recipes) {
    this.recipes = recipes;
    this.recipesArray = [];
    this.ingredientsArray = [];
    this.appliancesArray = [];
    this.ustensilsArray = [];
    this.filteredRecipes = [];
    this.filteredIngredients = [];
    this.filteredAppliances = [];
    this.filteredUstensils = [];
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
  bindMainSearchData = (callback) => {
    this.onMainSearchResult = callback;
  };

  bindDropdownSearch = (callback) => {
    this.onDropdownSearchResult = callback;
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
  processMainSearchValue = (inputValue, clear = false) => {
    if (!clear) {
      const matchingRecipes = this.searchMatchingRecipes(inputValue);
      this.onMainSearchResult(matchingRecipes);
    } else {
      this.clearFilters();
      this.onMainSearchResult({
        recipes: this.recipesArray,
        ingredients: this.ingredientsArray,
        appliances: this.appliancesArray,
        ustensils: this.ustensilsArray,
      });
    }
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

  processTagSearch = (idPrefix, tagValue, clear = false) => {
    // TODO > implémenter un array des tags actifs
    // TODO > retirer les nouveaux.tags des filteredArrays des dropdowns ?
    // TODO >>>> OU : ajouter une prop bool isTag | = dissocier recherche locale dans DPDWN de recherche globale par tag
    // TODO > implémenter une intersection des recettes entre tags
    // TODO > filtrer les recettes en fonction de cette intersection
    // TODO > refiltrer tous les dropdowns en fonction de cette intersection
  };

  clearFilters = () => {
    this.filteredRecipes = [];
    this.filteredIngredients = [];
    this.filteredAppliances = [];
    this.filteredUstensils = [];
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

  searchMatchingRecipes = (stringVal) => {
    // TODO appliquer traitement similaire aux dropdowns
    // si filteredRecipes, filtrer à partir des filteredRecipes
    // sinon utiliser les recipes de base
    // conditions de reset et actualisation à caler dans eventListener
    let index = this.recipesArray.length;
    this.clearFilters();
    while (index) {
      index -= 1;
      if (
        RecipesModel.searchString(
          this.recipesArray[index].name.toLowerCase(),
          stringVal.toLowerCase()
        ) ||
        RecipesModel.searchString(
          this.recipesArray[index].description.toLowerCase(),
          stringVal.toLowerCase()
        ) ||
        RecipesModel.browseRecipeIngredients(
          this.recipesArray[index].ingredients,
          stringVal
        )
      ) {
        this.filteredRecipes.push(this.recipes[index]);
        this.trimIngredientsArray(
          this.filteredIngredients,
          this.recipesArray[index].ingredients
        );
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
    return {
      recipes: this.filteredRecipes,
      ingredients: this.filteredIngredients,
      appliances: this.filteredAppliances,
      ustensils: this.filteredUstensils,
    };
  };

  static browseRecipeIngredients = (ingredients, stringVal) => {
    let index = ingredients.length;
    let matchFound = false;
    while (index && !matchFound) {
      index -= 1;
      matchFound = RecipesModel.searchString(
        ingredients[index].ingredient.toLowerCase(),
        stringVal.toLowerCase()
      );
    }
    return matchFound;
  };

  trimIngredientsArray = (mainArray, newIngredients) => {
    let index = newIngredients.length;
    while (index) {
      index -= 1;
      let matchFound = false;
      let mainIndex = mainArray.length;
      while (mainIndex) {
        mainIndex -= 1;
        matchFound =
          newIngredients[index].ingredient.toLowerCase() ===
          mainArray[mainIndex].name.toLowerCase();
        if (matchFound) {
          break;
        }
      }
      if (!matchFound) {
        /* const renamed = RecipesModel.firstLetterToUpper(
          newIngredients[index].ingredient
        ); */
        const ingredient = this.getItemDetails(
          this.ingredientsArray,
          newIngredients[index].ingredient
        );
        // mainArray.push({ name: renamed });
        if (ingredient) {
          mainArray.push(ingredient);
        }
      }
    }
  };

  getItemDetails = (sourceArray, stringVal) => {
    let index = sourceArray.length;
    while (index) {
      index -= 1;
      const item = sourceArray[index];
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
        const itemRecipeId = itemRecipes[index];
        let recipesIndex = recipesArray.length;
        let matchFound = false;
        while (recipesIndex) {
          recipesIndex -= 1;
          if (itemRecipeId === recipesArray[recipesIndex].id) {
            matchFound = true;
            filteredItems.push(itemsArray[itemsIndex]);
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

  static searchString = (stringVal, needle) => stringVal.includes(needle);

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
