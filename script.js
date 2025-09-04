const products = [
  { id: 1, name: "Headphones", price: 50, image: "images/headphones.jpg" },
  { id: 2, name: "Smart Watch", price: 120, image: "images/smartwatch.jpg" },
  { id: 3, name: "Phone Charger", price: 20, image: "images/charger.jpg" },
];

let cart = [];

// Load cart from localStorage
function loadCart() {
  const stored = localStorage.getItem("cart");
  if (stored) cart = JSON.parse(stored);
  updateCartUI();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render Products
function renderProducts(filter = "") {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";
  products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(product => {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow text-center";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded mb-2">
        <h3 class="font-semibold">${product.name}</h3>
        <p class="text-gray-600">$${product.price}</p>
        <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded add-to-cart" data-id="${product.id}">
          Add to Cart
        </button>
      `;
      productsContainer.appendChild(div);
    });
}

// Update Cart UI
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    cartItems.innerHTML += `
      <li class="flex justify-between items-center">
        <span>${item.name} x${item.qty}</span>
        <span>$${item.price * item.qty}</span>
        <button class="text-red-500 remove-item" data-index="${index}">✖</button>
      </li>
    `;
  });

  cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  cartTotal.textContent = total;

  saveCart();
}

// Add to Cart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
  }

  if (e.target.classList.contains("remove-item")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCartUI();
  }
});

// Cart modal toggle
document.getElementById("cart-btn").onclick = () => {
  document.getElementById("cart-modal").classList.remove("hidden");
};
document.getElementById("close-cart").onclick = () => {
  document.getElementById("cart-modal").classList.add("hidden");
};

// Checkout
document.getElementById("checkout").onclick = () => {
  cart = [];
  updateCartUI();
  document.getElementById("cart-modal").classList.add("hidden");
  document.getElementById("checkout-modal").classList.remove("hidden");
};
document.getElementById("close-checkout").onclick = () => {
  document.getElementById("checkout-modal").classList.add("hidden");
};

// Search filter
document.getElementById("search-bar").addEventListener("input", (e) => {
  renderProducts(e.target.value);
});

// Init
loadCart();
renderProducts();
