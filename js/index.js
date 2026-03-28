// Функции управления кошиком

function addToCart(pizzaId) {
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    const existingItem = cart.find(item => item.id === pizzaId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: pizzaId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Показываем уведомление
    showNotification('Піца додана в кошик!');
}

function updateCartCount() {
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function showNotification(message) {
    // Удалить существующее уведомление если оно есть
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Инициализация счетчика при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
