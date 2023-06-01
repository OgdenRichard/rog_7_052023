export default class RecipesModel {
  constructor(recipes) {
    this.recipes = recipes;
    this.recipesArray = [];
    this.ingredientsArray = [];
    this.appliancesArray = [];
    this.ustensilsArray = [];
  }

  init = () => {
    this.recipes.forEach((recipe) => {
      const { id, name, time, ingredients, appliance, description } = recipe;
      this.recipesArray.push({ id, name, time, ingredients, description });
      this.processRecipeIngredients(id, ingredients);
    });
    console.log(this.ingredientsArray);
  };

  processRecipeIngredients = (id, ingredients) => {
    ingredients.forEach((ingredient) => {
      const ingredientObject = this.ingredientsArray.find(
        (element) =>
          element.name.toLowerCase() === ingredient.ingredient.toLowerCase()
      );
      if (!ingredientObject) {
        const renamed = RecipesModel.firstLetterToUpper(ingredient.ingredient);
        this.ingredientsArray.push({
          name: renamed,
          recipes: [id],
        });
      } else {
        ingredientObject.recipes.push(id);
      }
    });
  };

  static firstLetterToUpper = (name) =>
    `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}
