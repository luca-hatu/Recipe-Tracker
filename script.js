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
    const tags = [];
        document.querySelectorAll('input[name="tags"]:checked').forEach(tag => {
            tags.push(tag.value);
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
        totalCost,
        favorite: false,
        tags
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

document.getElementById('filter-select').addEventListener('change', () => {
    displayRecipes();
});

document.getElementById('show-favorites-btn').addEventListener('click', () => {
    displayFavorites();
});

function displayRecipes(recipesToShow) {
    const recipes = recipesToShow || JSON.parse(localStorage.getItem('recipes')) || [];
    const filter = document.getElementById('filter-select').value;
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';

    recipes.forEach((recipe, index) => {
        if (filter === 'all' || recipe.type === filter) {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';

            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = recipe.name;

            const recipeType = document.createElement('p');
            const typeImg = document.createElement('img');
            typeImg.src = recipe.iconSrc;
            typeImg.alt = recipe.type;
            typeImg.style.width = '30px'; 
            typeImg.style.height = '30px'; 
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

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'recipe-buttons';
            
            const editButton = document.createElement('button');
            const editImg = document.createElement('img');
            editImg.src = 'images/edit.png';
            editImg.alt = 'Edit Recipe';
            editImg.style.width = '20px'; 
            editImg.style.height = '20px'; 
            editButton.appendChild(editImg);
            editButton.addEventListener('click', () => editRecipe(index));

            const removeButton = document.createElement('button');
            const removeImg = document.createElement('img');
            removeImg.src = 'images/trash.png';
            removeImg.alt = 'Remove Recipe';
            removeImg.style.width = '20px'; 
            removeImg.style.height = '20px'; 
            removeButton.appendChild(removeImg);
            removeButton.addEventListener('click', () => removeRecipe(index));

            const viewIngredientsButton = document.createElement('button');
            viewIngredientsButton.textContent = 'View Shopping List';
            viewIngredientsButton.addEventListener('click', () => viewIngredients(index));

            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'favorite-btn';
            favoriteButton.textContent = 'Favorite';
            if (recipe.favorite) {
                favoriteButton.classList.add('filled');
            }
            favoriteButton.onclick = () => toggleFavorite(index);

            buttonsDiv.appendChild(editButton);
            buttonsDiv.appendChild(removeButton);
            buttonsDiv.appendChild(viewIngredientsButton);
            buttonsDiv.appendChild(favoriteButton);

            recipeDiv.appendChild(recipeTitle);
            recipeDiv.appendChild(recipeType);
            recipeDiv.appendChild(recipeIngredients);
            recipeDiv.appendChild(recipeInstructions);
            recipeDiv.appendChild(recipeCost);
            recipeDiv.appendChild(buttonsDiv);

            recipesDiv.appendChild(recipeDiv);
        }
    });
}

function displayFavorites() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const favoriteRecipes = recipes.filter(recipe => recipe.favorite);
    displayRecipes(favoriteRecipes);
}

function toggleFavorite(index) {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes[index].favorite = !recipes[index].favorite;
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

function editRecipe(index) {
    console.log('Edit recipe index:', index);

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipeToEdit = recipes[index];

    document.getElementById('recipe-name').value = recipeToEdit.name;
    document.getElementById('recipe-instructions').value = recipeToEdit.instructions;

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

    const typeRadios = document.querySelectorAll('input[name="type"]');
    typeRadios.forEach(radio => {
        if (radio.value === recipeToEdit.type) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    });

    document.getElementById('popup-form').style.display = 'block';

    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    displayRecipes();
}

function removeRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

function viewIngredients(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];

    const ingredientsListDiv = document.getElementById('ingredients-list');
    ingredientsListDiv.innerHTML = '';

    recipe.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('p');
        ingredientItem.textContent = `${ingredient.quantity} ${ingredient.name}`;
        ingredientsListDiv.appendChild(ingredientItem);
    });

    const totalCostP = document.getElementById('total-cost');
    totalCostP.textContent = `Total Cost: $${recipe.totalCost.toFixed(2)}`;

    document.getElementById('popup-ingredients').style.display = 'block';
}

document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('popup-ingredients').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('popup-ingredients')) {
        document.getElementById('popup-ingredients').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    displayRecipes();

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.trim().toLowerCase();
        filterRecipes(searchText);
    });
});

function filterRecipes(searchText) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const filteredRecipes = recipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(searchText) ||
               recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(searchText));
    });
    displayRecipes(filteredRecipes);
}


