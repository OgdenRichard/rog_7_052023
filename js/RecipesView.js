import RecipesGrid from './components/RecipesGrid.js';
import DropdownListBox from './components/DrodpdownListbox.js';

export default class RecipesView {
  constructor(recipes, ingredients, ustensils, appliances) {
    this.recipes = recipes;
    this.ingredients = ingredients;
    this.ustensils = ustensils;
    this.appliances = appliances;
    this.grid = document.getElementById('grid');
    this.tagsContainer = document.getElementById('tags-container');
    this.dropdowns = [];
  }

  init = () => {
    this.recipesGrid = new RecipesGrid(this.recipes);
    this.recipesGrid.render();
    /* const ingredientsDropdown = new DropdownListBox(
      this.ingredients,
      'ingrédients',
      'primary'
    );
    const appliancesDropown = new DropdownListBox(
      this.appliances,
      'appareils',
      'success'
    );
    const ustensilsDropdown = new DropdownListBox(
      this.ustensils,
      'ustensiles',
      'danger'
    );
    this.dropdowns.push(ingredientsDropdown);
    this.dropdowns.push(appliancesDropown);
    this.dropdowns.push(ustensilsDropdown);
    this.dropdowns.forEach((dropdown) => {
      this.setDropdownEventListeners(dropdown);
      this.setDropdownInputEventListener(dropdown);
    }); */
  };

  processAccessories = (recipe) => {
    if (recipe.ingredients) {
      recipe.ingredients.forEach((ingredient) => {
        if (!this.ingredients.includes(ingredient.ingredient)) {
          this.ingredients.push(ingredient.ingredient);
        }
      });
    }
    if (recipe.appliance && !this.appliances.includes(recipe.appliance)) {
      this.appliances.push(recipe.appliance);
    }
    if (recipe.ustensils) {
      recipe.ustensils.forEach((ustensil) => {
        if (!this.ustensils.includes(ustensil)) {
          this.ustensils.push(ustensil);
        }
      });
    }
  };

  addRow = (lastRow) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.classList.add('gx-5');
    row.classList.add('mb-5');
    if (lastRow) {
      row.classList.add('row-cols-3');
    }
    return row;
  };

  setDropdownEventListeners = (dropdown) => {
    const options = dropdown.list.getElementsByClassName(
      'listbox-dropdown__option'
    );
    const optionsArray = [...options];
    optionsArray.forEach((option) => {
      option.addEventListener('click', () => {
        const button = this.setTagButton(option.innerText, dropdown.color);
        this.tagsContainer.appendChild(button);
        option.style.display = 'none';
        button.addEventListener('click', () => {
          option.style.display = 'block';
          this.tagsContainer.removeChild(button);
        });
      });
    });
  };

  setDropdownInputEventListener = (dropdown) => {
    const inputContainer = dropdown.searchInput.parentNode;
    inputContainer.addEventListener('click', () => {
      dropdown.searchInput.value = '';
      dropdown.searchInput.focus();
      dropdown.searchInput.addEventListener('blur', () => {
        dropdown.searchInput.value = dropdown.setInputValue();
      });
    });
  };

  setTagButton = (text, color) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('tag');
    button.classList.add('btn');
    button.classList.add(`btn-${color}`);
    button.innerText = text;
    return button;
  };

  setCard = (title, time, ingredients, description) => {
    const col = document.createElement('div');
    col.className = 'col';
    col.classList.add('col-xl-4');
    col.classList.add('col-md-6');
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = './assets/img/grey_bg.jpg';
    img.alt = 'food image';
    const body = document.createElement('div');
    body.className = 'card-body';
    const details = document.createElement('div');
    details.className = 'card-details';
    details.appendChild(this.setIngredients(ingredients));
    details.appendChild(this.setDescription(description));
    body.appendChild(this.setCardHeader(title, time));
    body.appendChild(details);
    card.appendChild(img);
    card.appendChild(body);
    col.appendChild(card);
    return col;
  };

  setCardHeader = (title, time) => {
    const header = document.createElement('div');
    const name = document.createElement('h5');
    name.classList.add('card-name');
    const clock = document.createElement('h5');
    clock.classList.add('card-clock');
    header.classList.add('card-title');
    name.innerText = title;
    clock.innerText = `${time} min`;
    header.appendChild(name);
    header.appendChild(clock);
    return header;
  };

  setIngredients = (ingredients) => {
    const container = document.createElement('div');
    container.className = 'card-ingredients';
    const list = document.createElement('dl');
    ingredients.forEach((ingredient) => {
      const elementTitle = document.createElement('dt');
      elementTitle.textContent = `${ingredient.ingredient}`;
      elementTitle.textContent += ingredient.quantity ? ' : ' : '';
      list.appendChild(elementTitle);
      const elementDesc = document.createElement('dd');
      if (ingredient.quantity) {
        const textUnit = ingredient.unit ? ingredient.unit : '';
        elementDesc.textContent = `${ingredient.quantity} ${textUnit}`;
      } else {
        elementDesc.classList.add('clearfix');
      }
      list.appendChild(elementDesc);
    });
    container.append(list);
    return container;
  };

  setDescription = (description) => {
    const container = document.createElement('div');
    container.className = 'card-recipe';
    container.textContent = description;
    return container;
  };
}
