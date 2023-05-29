export default class RecipesView {
  constructor(data) {
    this.recipes = data;
    this.grid = document.getElementById('grid');
    this.ingredients = [];
    this.ustensils = [];
    this.appliances = [];
    this.ingredientsDropdown = document.getElementById('ingredients');
    this.ustensilsDropdown = document.getElementById('ustensils');
    this.applianceDropdown = document.getElementById('appliances');
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
    console.log(this.ingredients);
    console.log(this.appliances);
    console.log(this.ustensils);
    this.displayAdvancedSearchCategory();
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

  displayAdvancedSearchCategory = () => {
    if (this.ingredients.length) {
      let currentList = this.setNewList();
      for (let index = 0; index < this.ingredients.length; index += 1) {
        const ingredient = this.ingredients[index];
        const newList = index === 0 || index % 3 === 0;
        if (newList) {
          currentList = this.setNewList('bg-blue');
          this.ingredientsDropdown.appendChild(currentList);
        }
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
    listElement.setAttribute('tabindex', '0');
    listElement.innerText = text;
    return listElement;
  };

  addRow = (lastRow) => {
    const row = document.createElement('div');
    row.className = 'row';
    if (lastRow) {
      row.classList.add('row-cols-3');
    }
    return row;
  };

  setCard = (title, time, ingredients, description) => {
    const col = document.createElement('div');
    col.className = 'col';
    const card = document.createElement('div');
    card.className = 'card';
    const body = document.createElement('div');
    body.className = 'card-body';
    const details = document.createElement('div');
    details.className = 'card-details';
    details.appendChild(this.setIngredients(ingredients));
    details.appendChild(this.setDescription(description));
    body.appendChild(this.setCardHeader(title, time));
    body.appendChild(details);
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
