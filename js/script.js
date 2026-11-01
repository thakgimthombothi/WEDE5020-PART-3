// Load saved cart products
let cart = JSON.parse(localStorage.getItem("urbanCart")) || [];

// Save cart products
function saveCart() {
    localStorage.setItem("urbanCart", JSON.stringify(cart));
}

// Add a product to the cart
function addToCart(productName, price, sizeId) {
    let size = "";

    if (sizeId !== "") {
        size = document.getElementById(sizeId).value;
    }

    let existingProduct = cart.find(function(item) {
        return item.name === productName && item.size === size;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            size: size,
            quantity: 1
        });
    }

    saveCart();
    displayCart();

    alert(productName + " added to your cart.");
}

// Display shopping cart
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) {
        return;
    }

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(function(item, index) {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let div = document.createElement("div");
        div.className = "cart-item";

        let details = document.createElement("div");

        details.innerHTML =
            "<strong>" + item.name + "</strong><br>" +
            "Size: " + (item.size || "One size") + "<br>" +
            "R" + item.price + " each";

        let controls = document.createElement("div");
        controls.className = "quantity-controls";

        controls.innerHTML =
            '<button onclick="changeQuantity(' + index + ', -1)">-</button> ' +
            item.quantity +
            ' <button onclick="changeQuantity(' + index + ', 1)">+</button><br>' +
            "Total: R" + itemTotal + "<br>" +
            '<button onclick="removeFromCart(' + index + ')">Remove</button>';

        div.appendChild(details);
        div.appendChild(controls);

        cartItems.appendChild(div);
    });

    cartTotal.textContent = total;
}

// Change product quantity
function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

// Remove product from cart
function removeFromCart(index) {
    cart.splice(index, 1);

    saveCart();
    displayCart();
}

// Clear shopping cart
function clearCart() {
    cart = [];

    saveCart();
    displayCart();
}

// Search and filter products
function filterProducts() {
    let searchInput = document.getElementById("searchInput");
    let categoryFilter = document.getElementById("categoryFilter");
    let products = document.querySelectorAll(".product-card");

    if (!searchInput || !categoryFilter) {
        return;
    }

    let searchText = searchInput.value.toLowerCase().trim();
    let selectedCategory = categoryFilter.value;

    products.forEach(function(product) {
        let productName = product.querySelector("h3").textContent.toLowerCase();
        let category = product.dataset.category;

        let matchesSearch = productName.includes(searchText);
        let matchesCategory =
            selectedCategory === "all" || category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }
    });
}

// Contact form message
function submitContact(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    let response = document.getElementById("contact-response");

    if (name === "" || email === "" || message === "") {
        response.textContent = "Please complete all the fields.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        response.textContent = "Please enter a valid email address.";
        return;
    }

    response.textContent =
        "Thank you, " + name + ". Your message has been received.";

    document.getElementById("contactForm").reset();
}

// Product enquiry form
function submitEnquiry(event) {
    event.preventDefault();

    let name = document.getElementById("enquiryName").value.trim();
    let email = document.getElementById("enquiryEmail").value.trim();
    let product = document.getElementById("enquiryProduct").value;
    let message = document.getElementById("enquiryMessage").value.trim();

    let response = document.getElementById("enquiryResponse");

    if (name === "" || email === "" ||
        product === "" || message === "") {

        response.textContent = "Please complete all fields.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        response.textContent = "Please enter a valid email address.";
        return;
    }

    response.textContent =
        "Thank you, " + name + ". Your enquiry about " +
        product + " has been received.";

    document.getElementById("enquiryForm").reset();
}

// Checkout and place an order
function checkoutOrder(event) {
    event.preventDefault();

    let response = document.getElementById("checkoutResponse");

    // Check if the cart is empty
    if (cart.length === 0) {
        response.textContent = "Your cart is empty. Please add products before checking out.";
        return;
    }

    // Get customer details
    let name = document.getElementById("customerName").value.trim();
    let email = document.getElementById("customerEmail").value.trim();
    let phone = document.getElementById("customerPhone").value.trim();
    let address = document.getElementById("deliveryAddress").value.trim();
    let payment = document.getElementById("paymentMethod").value;

    // Check that all details are entered
    if (name === "" || email === "" || phone === "" ||
        address === "" || payment === "") {
        response.textContent = "Please complete all the fields.";
        return;
    }

    // Calculate order total
    let total = 0;

    cart.forEach(function(item) {
        total += item.price * item.quantity;
    });

    // Display order confirmation
    response.textContent =
        "Thank you, " + name + "! Your order has been placed. " +
        "Total: R" + total + ". Payment method: " + payment + ".";

    // Clear the cart after placing the order
    cart = [];
    saveCart();
    displayCart();

    // Reset checkout form
    document.getElementById("checkoutForm").reset();
}

// Start website functions when page loads
document.addEventListener("DOMContentLoaded", function() {

    displayCart();

    let searchInput = document.getElementById("searchInput");
    let categoryFilter = document.getElementById("categoryFilter");

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterProducts);
    }

});