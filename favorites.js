function createFavoriteItem(product) {
    return `
        <div class="product-item" data-product-id="${product.id}">
            <div class="product-card" style="background: url('${product.image}') no-repeat center center; background-size: cover;">
                <div class="product-content"></div>
                <button class="remove-favorite-btn" onclick="removeFromFavorites('${product.id}')" title="Удалить из избранного">❌</button>
            </div>
            <div class="product-info">
                ${product.link ? `<a href="${product.link}" class="product-name-link">` : ''}
                    <p class="product-name">${product.name}</p>
                ${product.link ? '</a>' : ''}
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price}₽</p>
            </div>
        </div>
    `;
}

function addToFavorites(productId, productName, productDescription, productPrice, productImage, productLink = '') {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    const existingProduct = favorites.find(item => item.id === productId);
    if (existingProduct) {
        alert('Этот товар уже в избранном!');
        return;
    }
    
    const product = {
        id: productId,
        name: productName,
        description: productDescription,
        price: productPrice,
        image: productImage,
        link: productLink
    };
    
    favorites.push(product);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Товар добавлен в избранное!');
}

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => item.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}

function loadFavorites() {
    const container = document.getElementById('favorites-container');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <div class="icon">🤎</div>
                <p>В избранном пока ничего нет</p>
                <p>Добавляйте товары в избранное, нажимая на сердечко 🤎</p>
                <a href="coffee.html" class="back-button" style="margin-top: 20px;">Перейти в каталог</a>
            </div>
        `;
        return;
    }
    container.innerHTML = favorites.map(product => createFavoriteItem(product)).join('');
}
document.addEventListener('DOMContentLoaded', loadFavorites);