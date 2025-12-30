// ---------------------------------------------------------
// 1. Scroll Reveal Animation
// ---------------------------------------------------------
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


// ---------------------------------------------------------
// 2. Contact Form Handling (No Redirect)
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // STOP the redirect
            
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    if(successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.classList.add('show');
                        // Scroll to message
                        successMessage.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    alert('Oops! There was a problem submitting your form. Please try again.');
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Oops! There was a network error. Please try again.');
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});


// ---------------------------------------------------------
// 3. Shopping Cart Logic
// ---------------------------------------------------------

let cart = JSON.parse(localStorage.getItem('eo_cart')) || [];

// Add to Cart
window.addToCart = function(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    setTimeout(() => btn.innerText = originalText, 1000);
}

function saveCart() {
    localStorage.setItem('eo_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
        // Optional: Hide badge if 0
        // cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Checkout Function
window.checkout = async function() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const checkoutBtn = document.querySelector('.checkout-btn') || document.getElementById('checkout-btn'); // adjustments for different calling locations
    if(checkoutBtn) checkoutBtn.innerText = 'Processing...';

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems: cart })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Checkout failed: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Something went wrong initiating checkout. Please try again.');
    } finally {
        if(checkoutBtn) checkoutBtn.innerText = 'Checkout';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    loadProducts(); // Load products on page load
});


// ---------------------------------------------------------
// 4. Load Products dynamically
// ---------------------------------------------------------
async function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; // Only run if we are on a page with a product grid

    try {
        productGrid.innerHTML = '<p style="color: #888;">Loading exclusive gear...</p>';
        
        const response = await fetch('/api/products');
        const products = await response.json();

        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p>No products available.</p>';
            return;
        }

        productGrid.innerHTML = ''; // Clear loading text

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card hidden'; // Add 'hidden' for animation
            productCard.innerHTML = `
                <div class="product-image" style="background-image: url('${product.image_url}')"></div>
                <h3>${product.name}</h3>
                <p class="price">$${(product.price_amount / 100).toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
            
            // Observe the new element for animation
            observer.observe(productCard);
        });

    } catch (error) {
        console.error('Failed to load products:', error);
        productGrid.innerHTML = '<p style="color: red;">Failed to load products.</p>';
    }
}
