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
    this.nomatchingRecipeMsg = document.getElementById('rcp-nomatch');
    this.dropdowns = [];
  }

  /**
   * View initialization and render
   * @returns {void}
   */
  render = () => {
    this.recipesGrid = new RecipesGrid(this.recipes);
    this.recipesGrid.render();
    this.dropdowns.push(
      new DropdownListBox(this.ingredients, 'ingrédients', 'primary', 'igr')
    );
    this.dropdowns.push(
      new DropdownListBox(this.appliances, 'appareils', 'success', 'apl')
    );
    this.dropdowns.push(
      new DropdownListBox(this.ustensils, 'ustensiles', 'danger', 'ust')
    );
    this.dropdowns.forEach((dropdown) => {
      this.setDropdownOptionsEventListeners(dropdown);
      RecipesView.setDropdownInputEventListeners(dropdown);
    });
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
        handler('', true);
      }
    });
  };

  ingredientsSearchTrigger = (handler) => {
    this.dropdowns.forEach((dropdown) => {
      const input = dropdown.searchInput;
      if (dropdown.idPrefix) {
        input.addEventListener('keyup', () => {
          handler(dropdown.idPrefix, input.value);
        });
        input.addEventListener('blur', (event) => {
          event.stopPropagation();
          handler(dropdown.idPrefix, '');
        });
      }
    });
  };

  /**
   * Refresh display from main search results
   * @param {Object} searchResult
   */
  refreshFromMainSearch = (searchResult) => {
    this.nomatchingRecipeMsg.style.display = searchResult.recipes.length
      ? 'none'
      : 'block';
    this.refreshGrid([...searchResult.recipes]);
    RecipesView.refreshDropdownItems([...searchResult.ingredients], 'igr');
    RecipesView.refreshDropdownItems([...searchResult.appliances], 'apl');
    RecipesView.refreshDropdownItems([...searchResult.ustensils], 'ust');
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

  static refreshDropdownItems = (resultArray, idPrefix) => {
    const list = document.getElementById(`${idPrefix}-list`);
    const listElements = list.getElementsByClassName(
      'listbox-dropdown__option'
    );
    list.title = resultArray.length ? '' : 'Aucun élément correspondant';
    RecipesView.refreshDropdown(listElements, [...resultArray]);
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
  setDropdownOptionsEventListeners = (dropdown) => {
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
    inputContainer.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdown.searchInput.focus();
      dropdown.searchInput.value = '';
    });
    dropdown.searchInput.addEventListener('focus', () => {
      dropdown.searchInput.value = '';
    });
    dropdown.searchInput.addEventListener('blur', (event) => {
      event.stopPropagation();
      dropdown.searchInput.value = dropdown.setInputValue();
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
