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
   * Fires Model callback
   * @callback handler
   */
  mainSearchTrigger = (handler) => {
    // TODO gérer touche space?
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

  bindDropdownTextSearch = (callback) => {
    this.onDropdownTextSearch = callback;
  };

  bindAddNewTag = (callback) => {
    this.onAddNewTag = callback;
  };

  bindRemoveTag = (callback) => {
    this.onRemoveTag = callback;
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
    this.refreshDropdownItems([...searchResult.ingredients], 'igr');
    this.refreshDropdownItems([...searchResult.appliances], 'apl');
    this.refreshDropdownItems([...searchResult.ustensils], 'ust');
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

  static refreshDropdown = (list, elementsArray) => {
    let listIndex = list.length;
    while (listIndex) {
      listIndex -= 1;
      let index = elementsArray.length;
      let display = false;
      const domElement = list[listIndex];
      while (index) {
        index -= 1;
        if (
          domElement.innerText === elementsArray[index].name &&
          !elementsArray[index].isTag
        ) {
          display = true;
          elementsArray.splice(index, 1);
          break;
        }
      }
      domElement.style.display = display ? 'block' : 'none';
    }
  };

  setDropdownsTriggers = () => {
    let clear = false;
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
          const tags = document.getElementsByClassName('tag');
          input.value = '';
          // TODO utiliser plutôt RecipeModel.mainSearchValue && activeTags.length?
          clear = this.mainSearchInput.value.length < 3 && !tags.length;
          this.onDropdownTextSearch(dropdown.idPrefix, input.value, clear);
        });
        input.addEventListener('focusout', () => {
          input.value = dropdown.setInputValue();
        });
        input.addEventListener('keyup', () => {
          clear = this.mainSearchInput.value.length < 3;
          this.onDropdownTextSearch(dropdown.idPrefix, input.value, clear);
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
