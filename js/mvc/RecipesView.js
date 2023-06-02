import RecipesGrid from '../components/RecipesGrid.js';
import DropdownListBox from '../components/DrodpdownListbox.js';

export default class RecipesView {
  constructor(recipes, ingredients, ustensils, appliances) {
    this.recipes = recipes;
    this.ingredients = ingredients;
    this.ustensils = ustensils;
    this.appliances = appliances;
    this.grid = document.getElementById('grid');
    this.tagsContainer = document.getElementById('tags-container');
    this.mainSearchInput = document.getElementById('search-main');
  }

  render = () => {
    this.recipesGrid = new RecipesGrid(this.recipes);
    this.recipesGrid.render();
    this.ingredientsDropdown = new DropdownListBox(
      this.ingredients,
      'ingrédients',
      'primary'
    );
    this.setDropdownEventListeners(this.ingredientsDropdown);
    RecipesView.setDropdownInputEventListener(this.ingredientsDropdown);
    this.appliancesDropdown = new DropdownListBox(
      this.appliances,
      'appareils',
      'success'
    );
    this.setDropdownEventListeners(this.appliancesDropdown);
    RecipesView.setDropdownInputEventListener(this.appliancesDropdown);
    this.ustensilsDropdown = new DropdownListBox(
      this.ustensils,
      'ustensiles',
      'danger'
    );
    this.setDropdownEventListeners(this.ustensilsDropdown);
    RecipesView.setDropdownInputEventListener(this.ustensilsDropdown);
  };

  mainSearchTrigger = (handler) => {
    this.mainSearchInput.addEventListener('keyup', () => {
      const inputValue = this.mainSearchInput.value;
      if (inputValue.length >= 3) {
        handler(inputValue);
      }
    });
  };

  refreshGridTest = (testStr) => {
    console.log(testStr);
  };

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

  static setDropdownInputEventListener = (dropdown) => {
    const inputContainer = dropdown.searchInput.parentNode;
    inputContainer.addEventListener('click', () => {
      dropdown.searchInput.focus();
      dropdown.searchInput.value = '';
      dropdown.searchInput.addEventListener('blur', () => {
        dropdown.searchInput.value = dropdown.setInputValue();
      });
    });
  };

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
