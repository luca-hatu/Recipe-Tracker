document.getElementById('add-recipe-btn').addEventListener('click', () => {
    document.getElementById('popup-form').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('popup-form').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('popup-form')) {
        document.getElementById('popup-form').style.display = 'none';
    }
});

document.getElementById('recipe-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('recipe-ingredients').value;
    const instructions = document.getElementById('recipe-instructions').value;
    const typeElement = document.querySelector('input[name="type"]:checked');
    const type = typeElement ? typeElement.value : '';
    const iconClass = typeElement ? typeElement.nextElementSibling.className : '';

    if (!name || !ingredients || !instructions || !type) {
        alert("Please fill in all fields and select a recipe type.");
        return;
    }

    const recipe = {
        name,
        ingredients,
        instructions,
        type,
        iconClass
    };

    let recipes = [];
    if (localStorage.getItem('recipes')) {
        recipes = JSON.parse(localStorage.getItem('recipes'));
    }
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    document.getElementById('recipe-form').reset();
    document.getElementById('popup-form').style.display = 'none';
    displayRecipes();
});

function displayRecipes() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';

        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = recipe.name;

        const recipeType = document.createElement('p');
        recipeType.innerHTML = `Type: <i class="${recipe.iconClass}"></i> ${recipe.type}`;

        const recipeIngredients = document.createElement('p');
        recipeIngredients.textContent = `Ingredients: ${recipe.ingredients}`;

        const recipeInstructions = document.createElement('p');
        recipeInstructions.textContent = `Instructions: ${recipe.instructions}`;

        recipeDiv.appendChild(recipeTitle);
        recipeDiv.appendChild(recipeType);
        recipeDiv.appendChild(recipeIngredients);
        recipeDiv.appendChild(recipeInstructions);

        recipesDiv.appendChild(recipeDiv);
    });
}

document.addEventListener('DOMContentLoaded', displayRecipes);
