// Инициализация данных
let products = [
    {
        id: 1,
        title: "Милый автомобильчик",
        description: "Очаровательная 3D модель автомобиля с милыми деталями и пастельными цветами.",
        price: 2499,
        image: "image/ii1.jpg"
    },
    {
        id: 2,
        title: "Домик для зверушек",
        description: "Милейший домик с округлыми формами для ваших виртуальных питомцев.",
        price: 1899,
        image: "image/ii2.jpg"
    },
    {
        id: 3,
        title: "Волшебная палочка",
        description: "Прекрасная модель волшебной палочки с блестками и сердечками.",
        price: 1299,
        image: "image/ii3.jpg"
    },
    {
        id: 4,
        title: "Кавайный персонаж",
        description: "Очаровательный 3D персонаж с большими глазами и милыми аксессуарами.",
        price: 3499,
        image: "image/i6.jpg"
    },
    {
        id: 5,
        title: "Цветущее дерево",
        description: "Дерево с розовыми цветочками и милыми птичками на ветках.",
        price: 799,
        image: "image/i4.jpg"
    },
    {
        id: 6,
        title: "Воздушный кораблик",
        description: "Невесомый кораблик с облачками и радужным парусом.",
        price: 2999,
        image: "image/i5.jpg"
    }
];

let cart = [];
let discount = 0;
const promoCode = "KAWAII10"; // Промокод для скидки

// DOM элементы
const catalogElement = document.querySelector('.catalog');
const cartItemsElement = document.querySelector('.cart-items');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');
const promoInput = document.getElementById('promo-code');
const applyPromoButton = document.getElementById('apply-promo');
const newProductForm = document.getElementById('new-product-form');

// Функция отображения товаров в каталоге
function renderProducts() {
    catalogElement.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.title}" class="product-image">` : '🖼️ Изображение товара'}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} руб.</div>
                <button class="add-to-cart" data-id="${product.id}">Добавить в корзиночку 🛒</button>
            </div>
        `;
        catalogElement.appendChild(productCard);
    });

    // Добавляем обработчики событий для кнопок "Добавить в корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
            
            // Анимация добавления
            const button = e.target;
            button.textContent = "Добавлено! 💖";
            setTimeout(() => {
                button.textContent = "Добавить в корзиночку 🛒";
            }, 1000);
        });
    });
}

// Функция добавления товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Воспроизведение милого звука (если бы он был)
    // new Audio('sounds/kawaii-sound.mp3').play();
}

// Функция обновления отображения корзины
function updateCart() {
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = `
            <div class="empty-cart">
                <div class="sad-face">(´;ω;｀)</div>
                <p>Ваша корзиночка пустая</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price} руб.</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Удалить</button>
                </div>
            `;
            cartItemsElement.appendChild(cartItem);
        });
        
        // Добавляем обработчики событий для кнопок в корзине
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                updateQuantity(productId, 1);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
    
    // Обновляем итоговую сумму
    calculateTotal();
}

// Функция обновления количества товара в корзине
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// Функция удаления товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Функция расчета итоговой суммы
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;
    
    subtotalElement.textContent = `${subtotal.toFixed(2)} руб.`;
    discountElement.textContent = `-${discountAmount.toFixed(2)} руб.`;
    totalElement.textContent = `${total.toFixed(2)} руб.`;
}

// Функция применения промокода
function applyPromoCode() {
    const code = promoInput.value.trim();
    
    if (code === promoCode) {
        discount = 0.1; // 10% скидка
        alert('Ура! Промокод применен! 🎉 Вы получили скидку 10%');
        promoInput.style.borderColor = '#a2d2ff';
        promoInput.style.backgroundColor = '#f0f8ff';
    } else if (code) {
        alert('Ой-ой! Такого промокода нет 😢 Попробуйте еще раз!');
        promoInput.style.borderColor = '#ff6b6b';
        promoInput.style.backgroundColor = '#fff0f0';
    }
    
    updateCart();
}

// Функция добавления нового товара
function addNewProduct(event) {
    event.preventDefault();
    
    const title = document.getElementById('product-title').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value;
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        title,
        description,
        price,
        image: image || null
    };
    
    products.push(newProduct);
    renderProducts();
    
    // Очищаем форму
    document.getElementById('new-product-form').reset();
    
    // Показываем милое сообщение
    alert('Товарик успешно добавлен в каталог! 🌸');
    
    // Прокручиваем к каталогу
    document.querySelector('.catalog').scrollIntoView({ behavior: 'smooth' });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
    
    // Обработчики событий
    applyPromoButton.addEventListener('click', applyPromoCode);
    newProductForm.addEventListener('submit', addNewProduct);
    
    // Добавляем обработчик для кнопки оформления заказа
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Ваша корзиночка пустая! Добавьте что-нибудь милое! 🛍️');
        } else {
            alert('Спасибо за ваш заказик! 💖 Мы обработаем его в ближайшее время!');
            cart = [];
            discount = 0;
            promoInput.value = '';
            updateCart();
        }
    });
});