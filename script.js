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

document.getElementById('add-ingredient-btn').addEventListener('click', () => {
    const ingredientsContainer = document.getElementById('ingredients-container');

    const ingredientDiv = document.createElement('div');
    ingredientDiv.className = 'ingredient';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Ingredient:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'ingredient-name';
    nameLabel.appendChild(nameInput);

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.className = 'ingredient-quantity';
    quantityLabel.appendChild(quantityInput);

    const priceLabel = document.createElement('label');
    priceLabel.textContent = 'Price:';
    const priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.className = 'ingredient-price';
    priceLabel.appendChild(priceInput);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-ingredient-btn';
    removeBtn.addEventListener('click', () => {
        ingredientDiv.remove();
    });

    ingredientDiv.appendChild(nameLabel);
    ingredientDiv.appendChild(quantityLabel);
    ingredientDiv.appendChild(priceLabel);
    ingredientDiv.appendChild(removeBtn);

    ingredientsContainer.appendChild(ingredientDiv);
});

document.getElementById('recipe-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('recipe-name').value;
    const instructions = document.getElementById('recipe-instructions').value;
    const typeElement = document.querySelector('input[name="type"]:checked');
    const type = typeElement ? typeElement.value : '';
    const iconSrc = typeElement ? typeElement.nextElementSibling.src : '';

    if (!name || !instructions || !type) {
        alert("Please fill in all fields and select a recipe type.");
        return;
    }

    const ingredients = [];
    document.querySelectorAll('.ingredient').forEach(ingredient => {
        const name = ingredient.querySelector('.ingredient-name').value;
        const quantity = ingredient.querySelector('.ingredient-quantity').value;
        const price = parseFloat(ingredient.querySelector('.ingredient-price').value);

        if (name && quantity && price) {
            ingredients.push({ name, quantity, price });
        }
    });

    const totalCost = ingredients.reduce((total, ingredient) => {
        return total + (parseFloat(ingredient.quantity) * parseFloat(ingredient.price));
    }, 0);

    const recipe = {
        name,
        instructions,
        type,
        iconSrc,
        ingredients,
        totalCost
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

        const recipeIngredients = document.createElement('div');
        recipeIngredients.className = 'recipe-ingredients';
        recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('p');
            ingredientItem.textContent = `${ingredient.quantity} ${ingredient.name} - $${ingredient.price.toFixed(2)}`;
            recipeIngredients.appendChild(ingredientItem);
        });

        const recipeInstructions = document.createElement('p');
        recipeInstructions.textContent = `Instructions: ${recipe.instructions}`;

        const recipeCost = document.createElement('p');
        recipeCost.textContent = `Total Cost: $${recipe.totalCost.toFixed(2)}`;

        // Edit, Remove, and View Ingredients Buttons
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

        const viewIngredientsButton = document.createElement('button');
        viewIngredientsButton.textContent = 'View Shopping List';
        viewIngredientsButton.addEventListener('click', () => viewIngredients(index));

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(removeButton);
        buttonsDiv.appendChild(viewIngredientsButton);

        recipeDiv.appendChild(recipeTitle);
        recipeDiv.appendChild(recipeType);
        recipeDiv.appendChild(recipeIngredients);
        recipeDiv.appendChild(recipeInstructions);
        recipeDiv.appendChild(recipeCost);
        recipeDiv.appendChild(buttonsDiv);

        recipesDiv.appendChild(recipeDiv);
    });
}

function viewIngredients(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];

    const ingredientsListDiv = document.getElementById('ingredients-list');
    ingredientsListDiv.innerHTML = '';

    recipe.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('p');
        ingredientItem.textContent = `${ingredient.quantity} ${ingredient.name} - $${ingredient.price.toFixed(2)}`;
        ingredientsListDiv.appendChild(ingredientItem);
    });

    const totalCostP = document.getElementById('total-cost');
    totalCostP.textContent = `Total Cost: $${recipe.totalCost.toFixed(2)}`;

    // Display the popup
    document.getElementById('popup-ingredients').style.display = 'block';
}

function editRecipe(index) {
    // For now, let's log the index to verify if editRecipe function is being called
    console.log('Edit recipe index:', index);

    // Example: You can pre-fill a form with the existing recipe data for editing
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipeToEdit = recipes[index];

    // Pre-fill the form fields with the existing recipe data
    document.getElementById('recipe-name').value = recipeToEdit.name;
    document.getElementById('recipe-instructions').value = recipeToEdit.instructions;

    // Clear previous ingredients and re-add from recipeToEdit
    const ingredientsContainer = document.getElementById('ingredients-container');
    ingredientsContainer.innerHTML = '';

    recipeToEdit.ingredients.forEach(ingredient => {
        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'ingredient';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Ingredient:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'ingredient-name';
        nameInput.value = ingredient.name;
        nameLabel.appendChild(nameInput);

        const quantityLabel = document.createElement('label');
        quantityLabel.textContent = 'Quantity:';
        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.className = 'ingredient-quantity';
        quantityInput.value = ingredient.quantity;
        quantityLabel.appendChild(quantityInput);

        const priceLabel = document.createElement('label');
        priceLabel.textContent = 'Price:';
        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.className = 'ingredient-price';
        priceInput.value = ingredient.price;
        priceLabel.appendChild(priceInput);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-ingredient-btn';
        removeBtn.addEventListener('click', () => {
            ingredientDiv.remove();
        });

        ingredientDiv.appendChild(nameLabel);
        ingredientDiv.appendChild(quantityLabel);
        ingredientDiv.appendChild(priceLabel);
        ingredientDiv.appendChild(removeBtn);

        ingredientsContainer.appendChild(ingredientDiv);
    });

    // Pre-select the type radio button matching the recipe's type
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

document.addEventListener('DOMContentLoaded', () => {
    displayRecipes();

    // Close button for ingredients popup
    document.querySelector('#popup-ingredients .close-btn').addEventListener('click', () => {
        document.getElementById('popup-ingredients').style.display = 'none';
    });

    // Close popup when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('popup-ingredients')) {
            document.getElementById('popup-ingredients').style.display = 'none';
        }
    });
});
