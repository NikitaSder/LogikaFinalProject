let currentPizza = null;

        document.addEventListener('DOMContentLoaded', function() {
            loadPizzaDetail();
            updateCartCount();
        });

        async function loadPizzaDetail() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const pizzaId = parseInt(urlParams.get('id'));

                const response = await fetch('data/pizzas.json');
                const pizzas = await response.json();
                
                currentPizza = pizzas.find(p => p.id === pizzaId);
                
                if (!currentPizza) {
                    document.querySelector('.detail-content').innerHTML = '<p>Піца не знайдена</p>';
                    return;
                }

                displayPizzaDetail();
                displayIngredients();
            } catch (error) {
                console.error('Помилка при завантаженні:', error);
            }
        }

        function displayPizzaDetail() {
            const discountedPrice = Math.round(currentPizza.price * (1 - currentPizza.discount / 100));
            
            document.getElementById('pizzaImage').src = currentPizza.image;
            document.getElementById('pizzaName').textContent = currentPizza.name;
            document.getElementById('pizzaDescription').textContent = currentPizza.description;
            
            if (currentPizza.discount > 0) {
                document.getElementById('originalPrice').textContent = currentPizza.price + ' грн';
                document.getElementById('originalPrice').style.display = 'inline';
                document.getElementById('discountedPrice').textContent = discountedPrice + ' грн';
                document.getElementById('discountBadge').textContent = '-' + currentPizza.discount + '%';
                document.getElementById('discountBadge').style.display = 'inline-block';
            } else {
                document.getElementById('originalPrice').style.display = 'none';
                document.getElementById('discountedPrice').textContent = currentPizza.price + ' грн';
                document.getElementById('discountBadge').style.display = 'none';
            }
        }

        function displayIngredients() {
            const track = document.getElementById('ingredientsTrack');
            track.innerHTML = '';

            currentPizza.ingredients.forEach((ingredient) => {
                const card = document.createElement('div');
                card.className = 'ingredient-card';
                card.innerHTML = `
                    <div class="ingredient-icon">${ingredient.icon}</div>
                    <div class="ingredient-name">${ingredient.name}</div>
                `;
                track.appendChild(card);
            });
        }

        function increaseQty() {
            const qty = document.getElementById('quantity');
            if (qty.value < 10) {
                qty.value = parseInt(qty.value) + 1;
            }
        }

        function decreaseQty() {
            const qty = document.getElementById('quantity');
            if (qty.value > 1) {
                qty.value = parseInt(qty.value) - 1;
            }
        }

        function addCurrentPizzaToCart() {
            const quantity = parseInt(document.getElementById('quantity').value);
            
            let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
            
            const existingItem = cart.find(item => item.id === currentPizza.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: currentPizza.id,
                    quantity: quantity
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            showNotification(`${currentPizza.name} додана в кошик! (${quantity} шт.)`);
            
            // Сброс quantidade
            document.getElementById('quantity').value = 1;
        }