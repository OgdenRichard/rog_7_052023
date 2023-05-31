import DropdownListBox from './components/DrodpdownListbox.js';

export default class RecipesView {
  constructor(data) {
    this.recipes = data;
    this.grid = document.getElementById('grid');
    this.ingredients = [];
    this.ustensils = [];
    this.appliances = [];
    this.dropdowns = [];
    this.ingredientsDropdown = document.getElementById('ingredients');
    this.ingredientsInput = document.getElementById('input_ingredients');
    this.ustensilsDropdown = document.getElementById('ustensils');
    this.appliancesDropdown = document.getElementById('appliances');
    this.tagsContainer = document.getElementById('tags-container');
  }

  init = () => {
    let nextRow = true;
    let lastRow = false;
    let cardsCount = 1;
    this.recipes.forEach((recipe) => {
      this.processAccessories(recipe);
      if (nextRow) {
        lastRow = this.recipes.length - cardsCount < 3;
        this.grid.appendChild(this.addRow(lastRow));
      }
      const currentRow = this.grid.lastChild;
      // TODO : destructuring
      currentRow.appendChild(
        this.setCard(
          recipe.name,
          recipe.time,
          recipe.ingredients,
          recipe.description
        )
      );
      nextRow = cardsCount % 3 === 0;
      cardsCount += 1;
    });
    const ingredientsDropdown = new DropdownListBox(
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
    /* this.setDropdownEventListeners(this.ingredientsDropdown, 'btn-primary');
    this.setDropdownEventListeners(this.appliancesDropdown, 'btn-success');
    this.setDropdownEventListeners(this.ustensilsDropdown, 'btn-danger');
    this.setDropdownInputEventListener(this.ingredientsInput); */
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

  displayAdvancedSearchCategory = (accessoriesArray, dropdown, color) => {
    if (accessoriesArray.length) {
      const currentList = this.setNewList(color);
      dropdown.appendChild(currentList);
      for (let index = 0; index < accessoriesArray.length; index += 1) {
        const ingredient = accessoriesArray[index];
        currentList.appendChild(this.setListElement(ingredient));
      }
    }
  };

  setNewList = (color) => {
    const list = document.createElement('ul');
    list.classList.add('listbox-dropdown__list');
    list.classList.add(color);
    return list;
  };

  setListElement = (text) => {
    const listElement = document.createElement('li');
    listElement.classList.add('listbox-dropdown__option');
    listElement.tabIndex = '0';
    listElement.innerText = text;
    return listElement;
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

  setDropdownEventListeners = (dropdown, color) => {
    const options = dropdown.getElementsByClassName('listbox-dropdown__option');
    const optionsArray = [...options];
    optionsArray.forEach((option) => {
      option.addEventListener('click', () => {
        const button = this.setTagButton(option.innerText, color);
        this.tagsContainer.appendChild(button);
        option.style.display = 'none';
        this.ingredientsInput.value = 'Ingrédients';
        button.addEventListener('click', () => {
          option.style.display = 'block';
          this.tagsContainer.removeChild(button);
        });
      });
    });
  };

  setDropdownInputEventListener = (input) => {
    input.addEventListener('click', () => {
      const test = input.getElementsByTagName('input');
      test[0].value = '';
      test[0].focus();
      test[0].addEventListener('blur', () => {
        test[0].value = 'Ingrédients';
      });
    });
  };

  setTagButton = (text, color) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('tag');
    button.classList.add('btn');
    button.classList.add(color);
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
