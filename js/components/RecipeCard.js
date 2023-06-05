export default class RecipeCard {
  /**
   * @constructor
   * @param {Number} id
   * @param {String} name
   * @param {Number} time
   * @param {Array} ingredients
   * @param {String} description
   */
  constructor(id, name, time, ingredients, description) {
    this.id = id;
    this.title = name;
    this.time = time;
    this.ingredients = ingredients;
    this.description = description;
    this.article = this.setRecipe();
  }

  /**
   * Set recipe element wrapped in article
   * @returns {HTMLElement}
   */
  setRecipe = () => {
    const article = document.createElement('article');
    article.id = this.id;
    article.className = 'col';
    article.classList.add('col-xl-4');
    article.classList.add('col-md-6');
    article.appendChild(this.setCard());
    return article;
  };

  /**
   * Set Bootstrap card element
   * @returns {HTMLElement}
   */
  setCard = () => {
    const card = document.createElement('div');
    card.className = 'card';
    const body = document.createElement('div');
    body.className = 'card-body';
    const details = document.createElement('div');
    details.className = 'card-details';
    details.appendChild(this.setIngredients());
    details.appendChild(this.setDescription());
    body.appendChild(this.setCardHeader());
    body.appendChild(details);
    card.appendChild(RecipeCard.setCardImg());
    card.appendChild(body);
    return card;
  };

  /**
   * Set header for card body
   * @returns {HTMLElement}
   */
  setCardHeader = () => {
    const header = document.createElement('div');
    const name = document.createElement('h5');
    name.classList.add('card-name');
    const clock = document.createElement('h5');
    clock.classList.add('card-clock');
    header.classList.add('card-title');
    name.innerText = this.title;
    clock.innerText = `${this.time} min`;
    header.appendChild(name);
    header.appendChild(clock);
    return header;
  };

  /**
   * Set description list for ingredients
   * @returns {HtmlElement}
   */
  setIngredients = () => {
    const container = document.createElement('div');
    container.className = 'card-ingredients';
    const list = document.createElement('dl');
    this.ingredients.forEach((ingredient) => {
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

  /**
   * Set description element
   * @returns {HtmlElement}
   */
  setDescription = () => {
    const container = document.createElement('div');
    container.className = 'card-recipe';
    container.textContent = this.description;
    return container;
  };

  /**
   * Set generic image for card elemnt
   * @returns {HtmlElement}
   */
  static setCardImg = () => {
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = './assets/img/grey_bg.jpg';
    img.alt = 'food image';
    return img;
  };
}
