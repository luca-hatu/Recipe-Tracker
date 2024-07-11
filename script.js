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
    const iconSrc = typeElement ? typeElement.nextElementSibling.src : '';

    if (!name || !ingredients || !instructions || !type) {
        alert("Please fill in all fields and select a recipe type.");
        return;
    }

    const recipe = {
        name,
        ingredients,
        instructions,
        type,
        iconSrc
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
        const typeImg = document.createElement('img');
        typeImg.src = recipe.iconSrc;
        typeImg.alt = recipe.type;
        typeImg.style.width = '30px';  // Adjusted width
        typeImg.style.height = '30px'; // Adjusted height
        recipeType.textContent = 'Type: ';
        recipeType.appendChild(typeImg);
        recipeType.innerHTML += ` ${recipe.type}`;

        const recipeIngredients = document.createElement('p');
        recipeIngredients.textContent = `Ingredients: ${recipe.ingredients}`;

        const recipeInstructions = document.createElement('p');
        recipeInstructions.textContent = `Instructions: ${recipe.instructions}`;

        // Edit and Remove Buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'recipe-buttons';
        
        const editButton = document.createElement('button');
        const editImg = document.createElement('img');
        editImg.src = 'images/edit.png';
        editImg.alt = 'Edit Recipe';
        editImg.style.width = '20px';  // Adjusted width
        editImg.style.height = '20px'; // Adjusted height
        editButton.appendChild(editImg);
        editButton.addEventListener('click', () => editRecipe(index)); // Add event listener for edit button

        const removeButton = document.createElement('button');
        const removeImg = document.createElement('img');
        removeImg.src = 'images/trash.png';
        removeImg.alt = 'Remove Recipe';
        removeImg.style.width = '20px';  // Adjusted width
        removeImg.style.height = '20px'; // Adjusted height
        removeButton.appendChild(removeImg);
        removeButton.addEventListener('click', () => removeRecipe(index)); // Add event listener for remove button

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(removeButton);

        recipeDiv.appendChild(recipeTitle);
        recipeDiv.appendChild(recipeType);
        recipeDiv.appendChild(recipeIngredients);
        recipeDiv.appendChild(recipeInstructions);
        recipeDiv.appendChild(buttonsDiv);

        recipesDiv.appendChild(recipeDiv);
    });
}

function editRecipe(index) {
    // Implement edit functionality if needed
    // For now, let's log the index to verify if editRecipe function is being called
    console.log('Edit recipe index:', index);

    // Example: You can pre-fill a form with the existing recipe data for editing
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipeToEdit = recipes[index];

    // Pre-fill form fields with existing data
    document.getElementById('recipe-name').value = recipeToEdit.name;
    document.getElementById('recipe-ingredients').value = recipeToEdit.ingredients;
    document.getElementById('recipe-instructions').value = recipeToEdit.instructions;

    // Find and check the type radio button matching the recipe's type
    const typeRadios = document.querySelectorAll('input[name="type"]');
    typeRadios.forEach(radio => {
        if (radio.value === recipeToEdit.type) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    });

    // Display the popup form for editing
    document.getElementById('popup-form').style.display = 'block';
}

function removeRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

document.addEventListener('DOMContentLoaded', displayRecipes);
