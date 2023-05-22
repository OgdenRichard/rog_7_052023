export default class RecipesView {
  constructor(data) {
    this.recipes = data;
    this.grid = document.getElementById('grid');
  }

  init = () => {
    let nextRow = true;
    let cardsCount = 1;
    this.recipes.forEach((recipe) => {
      if (nextRow) {
        this.grid.appendChild(this.addRow());
      }
      const currentRow = this.grid.lastChild;
      currentRow.appendChild(this.setCard(recipe.name, recipe.time));
      // console.log(recipe.name);
      nextRow = cardsCount % 3 === 0;
      cardsCount += 1;
      console.log(`${cardsCount} | ${nextRow}`);
    });
  };

  addRow = () => {
    const row = document.createElement('div');
    row.className = 'row';
    // row.classList.add('row-cols-4');
    return row;
  };

  setCard = (title, time) => {
    const col = document.createElement('div');
    col.className = 'col';
    const card = document.createElement('div');
    card.className = 'card';
    const body = document.createElement('div');
    body.className = 'card-body';
    body.appendChild(this.setCardHeader(title, time));
    card.appendChild(body);
    col.appendChild(card);
    return col;
  };

  setCardHeader = (title, time) => {
    const header = document.createElement('div');
    const name = document.createElement('h5');
    const clock = document.createElement('h5');
    header.classList.add('card-title');
    name.innerText = title;
    clock.innerText = time;
    header.appendChild(name);
    header.appendChild(clock);
    return header;
  };
}
