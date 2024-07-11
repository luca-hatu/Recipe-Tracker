document.getElementById('recipe-form').addEventListener('submit', addRecipe);

function addRecipe(e) {
    e.preventDefault();

    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('recipe-ingredients').value;
    const instructions = document.getElementById('recipe-instructions').value;

    const recipe = {
        name,
        ingredients,
        instructions
    };

    let recipes = [];
    if (localStorage.getItem('recipes')) {
        recipes = JSON.parse(localStorage.getItem('recipes'));
    }
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    document.getElementById('recipe-form').reset();
    displayRecipes();
}

function displayRecipes() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';

        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = recipe.name;

        const recipeIngredients = document.createElement('p');
        recipeIngredients.textContent = `Ingredients: ${recipe.ingredients}`;

        const recipeInstructions = document.createElement('p');
        recipeInstructions.textContent = `Instructions: ${recipe.instructions}`;

        recipeDiv.appendChild(recipeTitle);
        recipeDiv.appendChild(recipeIngredients);
        recipeDiv.appendChild(recipeInstructions);

        recipesDiv.appendChild(recipeDiv);
    });
}

document.addEventListener('DOMContentLoaded', displayRecipes);
