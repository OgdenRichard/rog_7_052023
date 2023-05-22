export default class RecipesView {
  constructor(data) {
    this.recipes = data;
  }

  init = () => {
    this.recipes.forEach((recipe) => {
      console.log(recipe.name);
    });
  };

  setCard = () => {
    const card = document.createElement('div');
  };

  setCardHeader = (title, time) => {
    const header = document.createElement('div');
    const name = document.createElement('h5');
    const clock = document.createElement('h5');
    header.classList.add('card-header');
    name.innerText = title;
    clock.innerText = time;
    header.appendChild(name);
    header.appendChild(time);
  };
}
