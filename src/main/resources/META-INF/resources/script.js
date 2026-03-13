const foodEndpoint = window.location.origin + '/food';
let allFoodItems = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadAllFood();
});

// Load all food items
function loadAllFood() {
    showLoading();
    hideError();
    document.getElementById('myInput').value = '';

    httpGetAsync(foodEndpoint, (response) => {
        hideLoading();
        displayFoodItems(response);
    }, (error) => {
        hideLoading();
        showError('Failed to load food items. Please try again.');
    });
}

// Search by restaurant
function search() {
    const input = document.getElementById('myInput').value.trim();

    if (!input) {
        showError('Please enter a restaurant name');
        return;
    }

    showLoading();
    hideError();

    httpGetAsync(
        foodEndpoint + '/restaurant/' + encodeURIComponent(input),
        (response) => {
            hideLoading();
            displayFoodItems(response);
        },
        (error) => {
            hideLoading();
            showError('No items found for restaurant: ' + input);
        }
    );
}

// Display food items as cards
function displayFoodItems(response) {
    const data = JSON.parse(response);
    allFoodItems = data;

    const foodGrid = document.getElementById('foodGrid');
    const emptyState = document.getElementById('emptyState');

    foodGrid.innerHTML = '';

    if (!data || data.length === 0) {
        emptyState.classList.remove('hidden');
        foodGrid.classList.add('hidden');
        updateStats([]);
        return;
    }

    emptyState.classList.add('hidden');
    foodGrid.classList.remove('hidden');

    data.forEach(item => {
        const card = createFoodCard(item);
        foodGrid.appendChild(card);
    });

    updateStats(data);
}

// Create a food card element
function createFoodCard(item) {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
        <div class="food-card-header">
            <div>
                <div class="food-name">${escapeHtml(item.name)}</div>
                <div class="food-id">ID: ${item.id}</div>
            </div>
        </div>
        <div class="food-restaurant">${escapeHtml(item.restaurantName)}</div>
        <div class="food-footer">
            <div class="food-price">$${parseFloat(item.price).toFixed(2)}</div>
            <button class="btn btn-danger" onclick="deleteItem(${item.id})">🗑️ Delete</button>
        </div>
    `;
    return card;
}

// Update statistics
function updateStats(data) {
    const totalItems = data.length;
    const restaurants = new Set(data.map(item => item.restaurantName));
    const totalRestaurants = restaurants.size;
    const avgPrice = data.length > 0
        ? (data.reduce((sum, item) => sum + parseFloat(item.price), 0) / data.length).toFixed(2)
        : '0.00';

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalRestaurants').textContent = totalRestaurants;
    document.getElementById('avgPrice').textContent = '$' + avgPrice;
}

// Add new item
function addItem(event) {
    event.preventDefault();

    const name = document.getElementById('input_name').value.trim();
    const restaurantName = document.getElementById('input_restaurant').value.trim();
    const price = document.getElementById('input_price').value;

    if (!name || !restaurantName || !price) {
        showError('Please fill in all fields');
        return;
    }

    const body = { name, restaurantName, price: parseFloat(price) };

    showLoading();
    hideError();

    httpPostAsync(foodEndpoint, body, () => {
        hideLoading();
        clearForm();
        loadAllFood();
        showSuccess('Item added successfully!');
    }, (error) => {
        hideLoading();
        showError('Failed to add item. Please try again.');
    });
}

// Delete item
function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    showLoading();
    hideError();

    httpDeleteAsync(foodEndpoint + '/' + id, () => {
        hideLoading();
        loadAllFood();
        showSuccess('Item deleted successfully!');
    }, (error) => {
        hideLoading();
        showError('Failed to delete item. Please try again.');
    });
}

// Clear form inputs
function clearForm() {
    document.getElementById('input_name').value = '';
    document.getElementById('input_restaurant').value = '';
    document.getElementById('input_price').value = '';
}

// Show loading spinner
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '⚠️ ' + message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => hideError(), 5000);
}

// Hide error message
function hideError() {
    document.getElementById('error').classList.add('hidden');
}

// Show success message
function showSuccess(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '✅ ' + message;
    errorDiv.style.background = '#D1FAE5';
    errorDiv.style.color = '#065F46';
    errorDiv.style.borderLeft = '4px solid #10B981';
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        hideError();
        errorDiv.style.background = '';
        errorDiv.style.color = '';
        errorDiv.style.borderLeft = '';
    }, 3000);
}

// HTTP GET request
function httpGetAsync(url, successCallback, errorCallback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                successCallback(xmlHttp.responseText);
            } else if (errorCallback) {
                errorCallback(xmlHttp.status);
            }
        }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
}

// HTTP POST request
function httpPostAsync(url, body, successCallback, errorCallback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 201 || xmlHttp.status == 200) {
                successCallback(xmlHttp.responseText);
            } else if (errorCallback) {
                errorCallback(xmlHttp.status);
            }
        }
    };
    xmlHttp.send(JSON.stringify(body));
}

// HTTP DELETE request
function httpDeleteAsync(url, successCallback, errorCallback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('DELETE', url, true);

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 204 || xmlHttp.status == 200) {
                successCallback();
            } else if (errorCallback) {
                errorCallback(xmlHttp.status);
            }
        }
    };
    xmlHttp.send(null);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
