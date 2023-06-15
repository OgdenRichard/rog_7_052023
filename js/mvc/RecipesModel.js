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
  bindProcessedData = (callback) => {
    this.onMainSearchResult = callback;
  };

  bindIngredientsSearch = (callback) => {
    this.onFilteredIngredients = callback;
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
    const matchingRecipes = this.searchMatchingRecipes(
      this.recipesArray,
      inputValue,
      'name'
    );
    this.onMainSearchResult(matchingRecipes);
  };

  processDropdownSearch = (dropdownName, inputValue) => {
    let sourceArray = [];
    switch (dropdownName) {
      case 'ingredients':
        sourceArray = this.filteredIngredients.length
          ? this.filteredIngredients
          : this.ingredientsArray;
        break;
      case 'appliances':
        sourceArray = this.filteredAppliances.length
          ? this.filteredAppliances
          : this.appliancesArray;
        break;
      case 'ustensils':
        sourceArray = this.filteredUstensils.length
          ? this.filteredUstensils
          : this.ustensilsArray;
        break;
      default:
        break;
    }
    if (inputValue.length) {
      let result = [];
      result = this.searchMatchingDropdownItems(sourceArray, inputValue);
      this.onFilteredIngredients(result);
    } else if (sourceArray.length) {
      this.onFilteredIngredients(sourceArray);
    }
  };

  searchMatchingDropdownItems = (sourceArray, stringVal) => {
    const searchResult = [];
    let index = sourceArray.length;
    while (index) {
      index -= 1;
      const ingredient = sourceArray[index];
      if (
        RecipesModel.searchString(
          ingredient.name.toLowerCase(),
          stringVal.toLowerCase()
        )
      ) {
        searchResult.push(ingredient);
      }
    }
    return searchResult;
  };

  searchMatchingRecipes = (itemsArray, stringVal) => {
    let index = itemsArray.length;
    this.filteredIngredients = [];
    this.filteredAppliances = [];
    this.filteredUstensils = [];
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
        ) ||
        RecipesModel.browseRecipeIngredients(
          itemsArray[index].ingredients,
          stringVal
        )
      ) {
        filteredRecipes.push(itemsArray[index]);
        RecipesModel.trimIngredientsArray(
          this.filteredIngredients,
          itemsArray[index].ingredients
        );
      }
    }
    this.filteredAppliances = RecipesModel.setArrayFromRecipesIds(
      filteredRecipes,
      this.appliancesArray
    );
    this.filteredUstensils = RecipesModel.setArrayFromRecipesIds(
      filteredRecipes,
      this.ustensilsArray
    );
    return {
      recipes: filteredRecipes,
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

  static trimIngredientsArray = (mainArray, newIngredients) => {
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
          // TODO : splice ?
          break;
        }
      }
      if (!matchFound) {
        const renamed = RecipesModel.firstLetterToUpper(
          newIngredients[index].ingredient
        );
        mainArray.push({ name: renamed });
      }
    }
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
