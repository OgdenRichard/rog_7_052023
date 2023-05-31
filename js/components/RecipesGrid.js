export default class RecipesGrid {
  constructor(recipesData) {
    this.recipesData = recipesData;
    this.grid = document.getElementById('grid');
  }

  render = () => {
    let nextRow = true;
    let isLastRow = false;
    let cardsCount = 1;
    this.recipesData.forEach((recipe) => {
      if (nextRow) {
        isLastRow = this.recipes.length - cardsCount < 3;
        this.grid.appendChild(RecipesGrid.addRow(isLastRow));
      }
      const currentRow = this.grid.lastChild;
      const { name, time, ingredients, description } = recipe;
      currentRow.appendChild(
        RecipesGrid.setRecipe(name, time, ingredients, description)
      );
      nextRow = cardsCount % 3 === 0;
      cardsCount += 1;
    });
    // TODO set recipe ids
  };

  static setRecipe = (title, time, ingredients, description) => {
    const article = document.createElement('article');
    article.className = 'col';
    article.classList.add('col-xl-4');
    article.classList.add('col-md-6');
    article.appendChild(
      RecipesGrid.setCard(title, time, ingredients, description)
    );
    return article;
  };

  static setCard = (title, time, ingredients, description) => {
    const card = document.createElement('div');
    card.className = 'card';
    const body = document.createElement('div');
    body.className = 'card-body';
    const details = document.createElement('div');
    details.className = 'card-details';
    details.appendChild(RecipesGrid.setIngredients(ingredients));
    details.appendChild(RecipesGrid.setDescription(description));
    body.appendChild(RecipesGrid.setCardHeader(title, time));
    body.appendChild(details);
    card.appendChild(RecipesGrid.setCardImg);
    card.appendChild(body);
    return card;
  };

  static addRow = (isLastRow) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.classList.add('gx-5');
    row.classList.add('mb-5');
    if (isLastRow) {
      row.classList.add('row-cols-3');
    }
    return row;
  };

  static setCardImg = () => {
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = './assets/img/grey_bg.jpg';
    img.alt = 'food image';
    return img;
  };

  static setCardHeader = (title, time) => {
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

  static setIngredients = (ingredients) => {
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

  static setDescription = (description) => {
    const container = document.createElement('div');
    container.className = 'card-recipe';
    container.textContent = description;
    return container;
  };
}
