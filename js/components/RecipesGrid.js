import RecipeCard from './RecipeCard.js';

export default class RecipesGrid {
  constructor(recipesData) {
    this.recipesData = recipesData;
    this.gridContainer = document.getElementById('grid');
    this.recipesCards = [];
  }

  render = () => {
    let nextRow = true;
    let isLastRow = false;
    let cardsCount = 1;
    this.recipesData.forEach((recipe) => {
      if (nextRow) {
        isLastRow = this.recipesData.length - cardsCount < 3;
        this.gridContainer.appendChild(RecipesGrid.addRow(isLastRow));
      }
      const currentRow = this.gridContainer.lastChild;
      const { id, name, time, ingredients, description } = recipe;
      const card = new RecipeCard(id, name, time, ingredients, description);
      this.recipesCards.push(card);
      currentRow.appendChild(card.article);
      nextRow = cardsCount % 3 === 0;
      cardsCount += 1;
    });
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
}
