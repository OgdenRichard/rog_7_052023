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
    this.setDropdownsTriggers();
  };

  /**
   * Fires dropdown search in RecipesModel
   * @callback callback
   */
  bindDropdownTextSearch = (callback) => {
    this.onDropdownTextSearch = callback;
  };

  /**
   * Fires tag filtering in RecipesModel
   * @callback callback
   */
  bindAddNewTag = (callback) => {
    this.onAddNewTag = callback;
  };

  /**
   * Fires tag filtering or reset in RecipesModel
   * @callback callback
   */
  bindRemoveTag = (callback) => {
    this.onRemoveTag = callback;
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
      } else {
        handler('');
      }
    });
  };

  /**
   * Refresh display from main search results
   * @param {Object} searchResult
   */
  refreshFromCrossedSearch = (searchResult) => {
    this.nomatchingRecipeMsg.style.display = searchResult.recipes.length
      ? 'none'
      : 'block';
    this.refreshGrid([...searchResult.recipes]);
    this.refreshDropdownItems([...searchResult.ingredients], 'igr');
    this.refreshDropdownItems([...searchResult.appliances], 'apl');
    this.refreshDropdownItems([...searchResult.ustensils], 'ust');
  };

  /**
   * Refresh recipes cards display
   * @param {Array} recipesArray
   * @returns {void}
   */
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

  /**
   * Process dropdowns from search / filtering results
   * @param {Array} resultArray
   * @param {string} idPrefix
   * @returns {void}
   */
  refreshDropdownItems = (resultArray, idPrefix) => {
    let currentDropdown = null;
    this.dropdowns.forEach((dropdown) => {
      if (dropdown.idPrefix === idPrefix) {
        currentDropdown = dropdown;
      }
    });
    if (currentDropdown) {
      const { list } = currentDropdown;
      const listElements = list.getElementsByClassName(
        'listbox-dropdown__option'
      );
      list.title = resultArray.length ? '' : 'Aucun élément';
      RecipesView.refreshDropdown(listElements, [...resultArray]);
    }
  };

  /**
   * Toggle display of <li> elements for current dropdown
   * @param {Array} list
   * @param {Array} elementsArray
   * @returns {void}
   */
  static refreshDropdown = (list, elementsArray) => {
    let listIndex = list.length;
    while (listIndex) {
      listIndex -= 1;
      let index = elementsArray.length;
      let display = false;
      const domElement = list[listIndex];
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
   * Set listeners for dropdowns user actions
   * @returns {void}
   */
  setDropdownsTriggers = () => {
    this.dropdowns.forEach((dropdown) => {
      const input = dropdown.searchInput;
      const inputContainer = dropdown.searchInput.parentNode;
      const options = dropdown.list.getElementsByClassName(
        'listbox-dropdown__option'
      );
      if (dropdown.idPrefix) {
        inputContainer.addEventListener('click', () => {
          input.focus();
          input.value = '';
        });
        input.addEventListener('focus', () => {
          input.value = '';
          this.onDropdownTextSearch(dropdown.idPrefix, input.value);
        });
        input.addEventListener('focusout', () => {
          input.value = dropdown.setInputValue();
        });
        input.addEventListener('keyup', () => {
          this.onDropdownTextSearch(dropdown.idPrefix, input.value);
        });
        for (let index = 0; index < options.length; index += 1) {
          const option = options[index];
          option.addEventListener('click', () => {
            const button = RecipesView.setTagButton(
              option.innerText,
              dropdown.color
            );
            this.tagsContainer.appendChild(button);
            option.style.display = 'none';
            this.onAddNewTag(dropdown.idPrefix, option.innerText);
            button.addEventListener('click', () => {
              option.style.display = 'block';
              this.onRemoveTag(dropdown.idPrefix, option.innerText);
              this.tagsContainer.removeChild(button);
            });
          });
        }
      }
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
