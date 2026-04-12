document.addEventListener('DOMContentLoaded', function() {
    initProductPage();
    initFavoriteButton();
});

function initProductPage() {
    initSizeSelection();
    initTabs();
    initAddToCart();
}

function initFavoriteButton() {
    const favoriteBtn = document.getElementById('addToFavorites');
    
    if (!favoriteBtn) return;
    
    const productId = 'green-tea';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isInFavorites = favorites.some(item => item.id === productId);
    
    updateFavoriteButton(favoriteBtn, isInFavorites);
    
    favoriteBtn.addEventListener('click', function() {
        const productData = {
            id: productId,
            name: 'Зеленый чай',
            description: 'Нежный зеленый чай с травянистыми нотами и освежающим послевкусием',
            price: document.querySelector('.current-price').textContent,
            icon: '🍵',
            image: 'green-tea.jpg',
            category: 'tea',
            link: 'product-green-tea.html',
            size: document.querySelector('.size-option.active')?.getAttribute('data-size') || '300ml'
        };
        
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const existingIndex = favorites.findIndex(item => item.id === productData.id);
        
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
            updateFavoriteButton(favoriteBtn, false);
            showNotification('Зеленый чай удален из избранного');
        } else {
            favorites.push(productData);
            updateFavoriteButton(favoriteBtn, true);
            showNotification('Зеленый чай добавлен в избранное!');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateHeaderFavoriteCounter();
    });
}

function updateFavoriteButton(button, isAdded) {
    const icon = button.querySelector('.favorite-icon');
    const text = button.querySelector('.favorite-text');
    
    if (isAdded) {
        button.classList.add('added');
        icon.textContent = '♥';
        text.textContent = 'В избранном';
    } else {
        button.classList.remove('added');
        icon.textContent = '♡';
        text.textContent = 'В избранное';
    }
}

function updateHeaderFavoriteCounter() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const headerFavoriteBtn = document.querySelector('.favorites-btn');
    
    if (headerFavoriteBtn) {
        if (favorites.length > 0) {
            headerFavoriteBtn.textContent = `🤎 ${favorites.length}`;
        } else {
            headerFavoriteBtn.textContent = '🤎';
        }
    }
}

function initSizeSelection() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    if (!sizeOptions.length) return;
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const price = this.getAttribute('data-price');
            const size = this.getAttribute('data-size');
            
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const priceElement = document.querySelector('.current-price');
            if (priceElement) {
                priceElement.textContent = price + ' ₽';
            }
            
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
    });
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-content .tab-pane');
    
    if (!tabBtns.length || !tabPanes.length) return;
    
    if (!document.querySelector('#tab-styles')) {
        const style = document.createElement('style');
        style.id = 'tab-styles';
        style.textContent = `
            .tab-pane {
                display: none;
            }
            .tab-pane.active {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

function initAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function() {
        const productName = document.querySelector('.product-title');
        const selectedSize = document.querySelector('.size-option.active');
        const price = document.querySelector('.current-price');
        
        if (!productName || !selectedSize || !price) {
            console.error('Не найдены необходимые элементы для добавления в корзину');
            return;
        }
        
        const productData = {
            id: 'green-tea_' + Date.now(),
            name: productName.textContent,
            size: selectedSize.getAttribute('data-size'),
            price: price.textContent,
            quantity: 1,
            image: 'green-tea.jpg',
            icon: '🍵'
        };
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => 
            item.name === productData.name && item.size === productData.size
        );
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(productData);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification(`"${productData.name}" (${productData.size}) добавлен в корзину!`);
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #8B4513;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: 'Roboto', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}