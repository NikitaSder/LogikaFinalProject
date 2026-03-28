let cart = [];
        let allPizzas = [];

        document.addEventListener('DOMContentLoaded', async function() {
            loadCart();
            await loadPizzasData();
            displayCart();
        });

        async function loadPizzasData() {
            try {
                const response = await fetch('data/pizzas.json');
                allPizzas = await response.json();
            } catch (error) {
                console.error('Помилка при завантаженні даних:', error);
            }
        }

        function loadCart() {
            const savedCart = localStorage.getItem('cart');
            cart = savedCart ? JSON.parse(savedCart) : [];
        }

        function displayCart() {
            const container = document.getElementById('cartItems');
            
            if (cart.length === 0) {
                container.innerHTML = '<p class="empty-cart">Ваш кошик порожній. <a href="menu.html">Перейти до меню</a></p>';
                updateCartSummary();
                return;
            }
            
            container.innerHTML = '';
            cart.forEach((item, index) => {
                const pizza = allPizzas.find(p => p.id === item.id);
                if (pizza) {
                    const cartItem = createCartItem(item, pizza, index);
                    container.appendChild(cartItem);
                }
            });
            
            updateCartSummary();
        }

        function createCartItem(item, pizza, index) {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            const discountedPrice = Math.round(pizza.price * (1 - pizza.discount / 100));
            const currentPrice = pizza.discount > 0 ? discountedPrice : pizza.price;
            const itemTotal = currentPrice * item.quantity;
            
            itemElement.innerHTML = `
                <img class="item-image" src="${pizza.image}" alt="${pizza.name}">
                <div class="item-details">
                    <h3>${pizza.name}</h3>
                    <p>${pizza.description}</p>
                    <div class="item-price">
                        ${pizza.discount > 0 ? `
                            <span class="original-price">${pizza.price} грн</span>
                            <span class="discounted-price">${discountedPrice} грн</span>
                        ` : `
                            <span class="price">${pizza.price} грн</span>
                        `}
                    </div>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)">−</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" onchange="setQuantity(${index}, this.value)">
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="item-total">${itemTotal} грн</div>
                    <button class="btn-remove" onclick="removeFromCart(${index})">✕</button>
                </div>
            `;
            
            return itemElement;
        }

        function updateQuantity(index, change) {
            cart[index].quantity += change;
            if (cart[index].quantity < 1) {
                cart[index].quantity = 1;
            }
            saveCart();
            displayCart();
        }

        function setQuantity(index, value) {
            const qty = parseInt(value);
            if (qty >= 1 && qty <= 10) {
                cart[index].quantity = qty;
                saveCart();
                displayCart();
            }
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            saveCart();
            displayCart();
            updateCartCount();
        }

        function updateCartSummary() {
            let subtotal = 0;
            let discount = 0;
            
            cart.forEach(item => {
                const pizza = allPizzas.find(p => p.id === item.id);
                if (pizza) {
                    const originalPrice = pizza.price * item.quantity;
                    subtotal += originalPrice;
                    discount += Math.round(pizza.price * pizza.discount / 100) * item.quantity;
                }
            });
            
            const delivery = cart.length > 0 ? 50 : 0;
            const total = subtotal - discount + delivery;
            
            document.getElementById('subtotal').textContent = subtotal + ' грн';
            document.getElementById('discount').textContent = discount + ' грн';
            document.getElementById('delivery').textContent = delivery + ' грн';
            document.getElementById('total').textContent = total + ' грн';
        }

        function applyPromo() {
            const promoCode = document.getElementById('promoCode').value.toUpperCase();
            if (promoCode === 'PIZZA') {
                alert('Промокод застосований: 10% знижка!');
            } else if (promoCode === '') {
                alert('Введіть промокод');
            } else {
                alert('Невизначений промокод');
            }
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Кошик порожній');
                return;
            }
            
            const orderNumber = Math.floor(Math.random() * 10000);
            alert(`Замовлення #${orderNumber} успішно створено! Доставка за 30 хвилин.`);
            
            // Очистили кошик
            cart = [];
            localStorage.removeItem('cart');
            displayCart();
            updateCartCount();
        }

        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }