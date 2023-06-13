/* eslint-disable import/extensions */
import RecipesGrid from '../components/RecipesGrid.js';
import DropdownListBox from '../components/DrodpdownListbox.js';

export default class RecipesView {
  /**
   * @constructor
   * @param {Array} recipes
   * @param {Array} ingredients
   * @param {Array} ustensils
   * @param {Array} appliances
   */
  constructor(recipes, ingredients, ustensils, appliances) {
    this.recipes = recipes;
    this.ingredients = ingredients;
    this.ustensils = ustensils;
    this.appliances = appliances;
    this.grid = document.getElementById('grid');
    this.tagsContainer = document.getElementById('tags-container');
    this.mainSearchInput = document.getElementById('search-main');
  }

  /**
   * View initialization and render
   * @returns {void}
   */
  render = () => {
    this.recipesGrid = new RecipesGrid(this.recipes);
    this.recipesGrid.render();
    this.ingredientsDropdown = new DropdownListBox(
      this.ingredients,
      'ingrédients',
      'primary',
      'igr'
    );
    this.setDropdownEventListeners(this.ingredientsDropdown);
    RecipesView.setDropdownInputEventListeners(this.ingredientsDropdown);
    this.appliancesDropdown = new DropdownListBox(
      this.appliances,
      'appareils',
      'success',
      'apl'
    );
    this.setDropdownEventListeners(this.appliancesDropdown);
    RecipesView.setDropdownInputEventListeners(this.appliancesDropdown);
    this.ustensilsDropdown = new DropdownListBox(
      this.ustensils,
      'ustensiles',
      'danger',
      'ust'
    );
    this.setDropdownEventListeners(this.ustensilsDropdown);
    RecipesView.setDropdownInputEventListeners(this.ustensilsDropdown);
  };

  /**
   * Fires Model callback
   * @callback handler
   */
  mainSearchTrigger = (handler) => {
    this.mainSearchInput.addEventListener('keyup', (event) => {
      const inputValue = event.target.value;
      if (inputValue.length >= 3) {
        handler(inputValue);
      }
    });
    this.mainSearchInput.addEventListener('keydown', (event) => {
      const t = event.target;
      if (
        (event.key === 'Delete' && t.selectionStart < 3) ||
        (event.key === 'Backspace' && t.selectionStart === 3)
      ) {
        const recipes = [...this.recipes];
        const ingredients = [...this.ingredients];
        const appliances = [...this.appliances];
        const ustensils = [...this.ustensils];
        this.refreshGrid(recipes);
        RecipesView.refreshIngredients(ingredients);
        RecipesView.refreshAppliances(appliances);
        RecipesView.refreshUstensils(ustensils);
      }
    });
  };

  ingredientsSearchTrigger = (handler) => {
    const input = this.ingredientsDropdown.searchInput;
    input.addEventListener('keyup', () => {
      handler(input.value);
    });
  };

  /**
   * Refresh display from main search results
   * @param {Object} searchResult
   */
  refreshFromMainSearch = (searchResult) => {
    this.refreshGrid(searchResult.recipes);
    RecipesView.refreshIngredients(searchResult.ingredients);
    RecipesView.refreshAppliances(searchResult.appliances);
    RecipesView.refreshUstensils(searchResult.ustensils);
  };

  refreshGrid = (recipesArray) => {
    let cardsIndex = this.recipesGrid.recipesCards.length;
    while (cardsIndex) {
      cardsIndex -= 1;
      let index = recipesArray.length;
      let cardDisplay = false;
      const card = this.recipesGrid.recipesCards[cardsIndex];
      while (index) {
        index -= 1;
        const currentId = recipesArray[index].id;
        if (card.id === currentId) {
          cardDisplay = true;
          recipesArray.splice(index, 1);
          break;
        }
      }
      card.article.style.display = cardDisplay ? 'block' : 'none';
    }
  };

  static refreshIngredients = (ingredientsArray) => {
    const ingredientsList = document.getElementById('igr-list');
    const dropdownElements = ingredientsList.getElementsByClassName(
      'listbox-dropdown__option'
    );
    RecipesView.refreshDropdown(dropdownElements, ingredientsArray);
  };

  static refreshAppliances = (appliancesArray) => {
    const appliancesList = document.getElementById('apl-list');
    const dropdownElements = appliancesList.getElementsByClassName(
      'listbox-dropdown__option'
    );
    RecipesView.refreshDropdown(dropdownElements, appliancesArray);
  };

  static refreshUstensils = (ustensilsArray) => {
    const ustensilsList = document.getElementById('ust-list');
    const dropdownElements = ustensilsList.getElementsByClassName(
      'listbox-dropdown__option'
    );
    RecipesView.refreshDropdown(dropdownElements, ustensilsArray);
  };

  static refreshDropdown = (dropdown, elementsArray) => {
    let dropdownIndex = dropdown.length;
    while (dropdownIndex) {
      dropdownIndex -= 1;
      let index = elementsArray.length;
      let display = false;
      const domElement = dropdown[dropdownIndex];
      while (index) {
        index -= 1;
        if (domElement.innerText === elementsArray[index].name) {
          display = true;
          elementsArray.splice(index, 1);
          break;
        }
      }
      domElement.style.display = display ? 'block' : 'none';
    }
  };

  /**
   * Set event listeners for each dropdown
   * Fires data filtering by tag in Model
   * @param {Object} dropdown
   * @returns {void}
   */
  setDropdownEventListeners = (dropdown) => {
    const options = dropdown.list.getElementsByClassName(
      'listbox-dropdown__option'
    );
    const optionsArray = [...options];
    optionsArray.forEach((option) => {
      option.addEventListener('click', () => {
        const button = RecipesView.setTagButton(
          option.innerText,
          dropdown.color
        );
        this.tagsContainer.appendChild(button);
        option.style.display = 'none';
        button.addEventListener('click', () => {
          option.style.display = 'block';
          this.tagsContainer.removeChild(button);
        });
      });
    });
  };

  /**
   * Swap generic value with placeholder on click on dropdown or focus out
   * @param {Object} dropdown
   * @returns {void}
   */
  static setDropdownInputEventListeners = (dropdown) => {
    const inputContainer = dropdown.searchInput.parentNode;
    inputContainer.addEventListener('click', () => {
      dropdown.searchInput.focus();
      dropdown.searchInput.value = '';
      dropdown.searchInput.addEventListener('blur', () => {
        dropdown.searchInput.value = dropdown.setInputValue();
      });
    });
  };

  /**
   * Set a tag button to append to tag container
   * @param {String} text
   * @param {String} color
   * @returns {HTMLElement}
   */
  static setTagButton = (text, color) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('tag');
    button.classList.add('btn');
    button.classList.add(`btn-${color}`);
    button.innerText = text;
    return button;
  };
}
