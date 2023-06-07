/* eslint-disable import/extensions */
import RecipeCard from './RecipeCard.js';

export default class RecipesGrid {
  /**
   * @constructor
   * @param {Array} recipesData
   */
  constructor(recipesData) {
    this.recipesData = recipesData;
    this.gridContainer = document.getElementById('grid');
    this.recipesCards = [];
  }

  /**
   * Initialize a recipe card and append it to DOM
   */
  render = () => {
    this.recipesData.forEach((recipe) => {
      const { id, name, time, ingredients, description } = recipe;
      const card = new RecipeCard(id, name, time, ingredients, description);
      this.recipesCards.push(card);
      this.gridContainer.appendChild(card.article);
    });
  };

  /**
   * Create a new row for Bootstrap grid
   * @param {Boolean} isLastRow
   * @returns {HTMLElement}
   */
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
