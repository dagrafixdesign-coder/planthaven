// ── PWA: Service Worker Registration ──
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/planthaven/service-worker.js")
    .then(() => console.log("✅ Service Worker registered"))
    .catch((e) => console.error("❌ SW failed:", e));
}

// Capture the install prompt for later use
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show the install banner
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.style.display = 'flex';
});

// Install button clicked
document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('pwaInstallBtn');
    const dismissBtn = document.getElementById('pwaDismissBtn');
    const banner    = document.getElementById('pwaInstallBanner');

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('✅ App installed!');
            }
            deferredPrompt = null;
            if (banner) banner.style.display = 'none';
        });
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            if (banner) banner.style.display = 'none';
        });
    }
});

// State
let cart = JSON.parse(localStorage.getItem('plantHavenCart')) || [];
let productsList = JSON.parse(localStorage.getItem('plantHavenProducts')) || [];
let storyData = JSON.parse(localStorage.getItem('plantHavenStory')) || {
    mission: 'At Plant Haven, we treat plants as living art. Our mission is to bridge the gap between urban living and the profound tranquility of the natural world.',
    quote: '"To plant a garden is to believe in tomorrow."',
    author: 'Audrey Hepburn'
};
let socialLinks = JSON.parse(localStorage.getItem('plantHavenSocial')) || {
    facebook: '#',
    tiktok: '#',
    whatsapp: '#',
    youtube: '#'
};
let adminCreds = JSON.parse(localStorage.getItem('plantHavenCreds')) || {
    user: 'admin',
    pass: '46c64dfb7353df8ddd6d94295703cb5e8fa70076fa85023690bd71601c540997' // Hash of 'botany2026'
};
// Sync with hardcoded products to ensure new additions appear
products.forEach(p => {
    if (!productsList.find(pl => pl.id === p.id)) {
        productsList.push(p);
    }
});
let isAdmin = JSON.parse(sessionStorage.getItem('plantHavenAdmin')) || false;
let adminCategoryFilter = 'all';

async function hashPassword(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Ensure cart is an array
if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(productsList)) productsList = [];

// GLOBAL CART FUNCTION (Fixed for absolute reliability)
window.addToCart = function(productId) {
    const id = parseInt(productId);
    const p = productsList.find(item => item.id === id);
    if (!p) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...p, quantity: 1 });
    }
    
    localStorage.setItem('plantHavenCart', JSON.stringify(cart));
    
    // Force immediate UI update
    if (typeof updateCartUI === 'function') updateCartUI();
    if (typeof showSuccessToast === 'function') showSuccessToast(`${p.name} added to your pot!`);
    if (typeof openCart === 'function') openCart();
};

let currentView = 'home';
let currentFilter = 'all';

// Elements (Now queried dynamically to prevent null refs)
function getEl(id) { return document.getElementById(id); }

const views = {
    home: 'homeView',
    accessories: 'accessoriesView',
    gifts: 'giftsView',
    bestSellers: 'bestSellersView',
    careGuides: 'careGuidesView',
    about: 'aboutView',
    admin: 'adminView'
};

const navLinks = {
    home: document.getElementById('navHome'),
    accessories: document.getElementById('navAccessories'),
    bestSellers: document.getElementById('navBestSellers'),
    careGuides: document.getElementById('navCareGuides')
};

// Initialize
function init() {
    renderHeroButtons();
    refreshAllViews();
    updateCartUI();
    updateAdminUI();
    renderStory();
    renderSocialLinks();
    setupEventListeners();
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then(reg => {
                console.log('ServiceWorker registered with scope:', reg.scope);
            }).catch(err => {
                console.error('ServiceWorker registration failed:', err);
            });
        });
    }
}

function renderHeroButtons() {
    const container = getEl('heroBtnContainer');
    if (!container) return;

    container.innerHTML = `
        <button class="btn btn-secondary btn-icon-flex" onclick="window.showView('gifts')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
            GIFT ITEMS
        </button>
        <button class="btn btn-secondary btn-icon-flex" onclick="document.getElementById('featured').scrollIntoView({behavior: 'smooth'})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-10 10Z"></path><path d="M11 20c-4 0-6-3-6-8s2-5 6-5 2 2 2 5-2 8-2 8Z"></path></svg>
            PLANTS
        </button>
    `;
}

function renderSocialLinks() {
    const footer = getEl('socialFooter');
    if (!footer) return;

    const icons = {
        facebook: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`,
        tiktok: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`,
        whatsapp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3.5l-1 5.5Z"></path><path d="M11 11h.01M15 11h.01"></path></svg>`,
        youtube: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`
    };

    footer.innerHTML = Object.keys(socialLinks).map(key => {
        let url = (socialLinks[key] || '').trim();
        if (!url || url === '#') return '';
        
        // Remove leading # and ensure one https://
        url = url.replace(/^#+/, '');
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        
        return `
            <a href="${url}" target="_blank" class="social-text-link">
                ${icons[key]} <span>${key.toUpperCase()}</span>
            </a>
        `;
    }).filter(html => html !== '').join('<span class="social-divider">|</span>');
}

function renderStory() {
    const storyText = document.getElementById('displayStoryText');
    const quoteText = document.getElementById('displayQuoteText');
    const quoteAuthor = document.getElementById('displayQuoteAuthor');
    if (storyText) storyText.textContent = storyData.mission;
    if (quoteText) quoteText.textContent = storyData.quote;
    if (quoteAuthor) quoteAuthor.textContent = `— ${storyData.author}`;
}

function refreshAllViews() {
    const plants = productsList.filter(p => p.type !== 'Accessory' && p.type !== 'Gift');
    const filtered = currentFilter === 'all' 
        ? plants 
        : plants.filter(p => p.type.toLowerCase() === currentFilter.toLowerCase());
    
    renderProducts(filtered, getEl('productGrid'));
    renderAccessories();
    renderGifts();
    renderCareGuides();
    renderBestSellers();
    if (isAdmin) renderAdminDashboard();
}

function renderAccessories() {
    const items = productsList.filter(p => p.type === 'Accessory');
    renderProducts(items, getEl('accessoriesGrid'));
}

function renderGifts() {
    const items = productsList.filter(p => p.type === 'Gift');
    renderProducts(items, getEl('giftsGrid'));
}

// Render Products
function renderProducts(items, container) {
    if (!container) return;
    const topSellers = productsList.sort((a, b) => b.sales - a.sales).slice(0, 3).map(p => p.id);

    container.innerHTML = items.map(product => {
        const isOutOfStock = product.stock <= 0;
        
        return `
            <div class="product-card product-card-clickable ${isOutOfStock ? 'out-of-stock' : ''}" data-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='assets/placeholder.png'; this.onerror=null;">
                    <div class="price-tag">Rs.${product.price.toLocaleString()}</div>
                    ${topSellers.includes(product.id) ? '<div class="best-seller-badge">Best Seller</div>' : ''}
                    ${isOutOfStock ? '<div class="out-of-stock-badge">SOLD OUT</div>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <span class="scientific-name">${product.scientificName}</span>
                    <div class="product-footer">
                        <span class="price">Rs.${product.price.toLocaleString()}</span>
                        <button class="btn ${isOutOfStock ? 'btn-disabled' : 'btn-outline'} add-to-cart-btn" 
                                ${isOutOfStock ? 'disabled' : ''}
                                onclick="event.stopPropagation(); window.addToCart(${product.id})">
                            ${isOutOfStock ? 'SOLD OUT' : 'ADD TO POT'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderBestSellers() {
    const sorted = [...productsList].sort((a, b) => b.sales - a.sales);
    renderProducts(sorted, getEl('bestSellersGrid'));
}

function renderCareGuides() {
    const grid = getEl('careGuidesGrid');
    if (!grid) return;
    grid.innerHTML = productsList.map(product => `
        <div class="care-card">
            <img src="${product.image}" alt="${product.name}" class="care-card-img" onerror="this.src='assets/placeholder.png'; this.onerror=null;">
            <div class="care-card-content">
                <h3>${product.name} Guide</h3>
                <div class="care-item">
                    <span class="care-icon">☀️</span>
                    <span class="care-label">Light</span>
                    <span>${product.care ? product.care.light : 'Bright indirect light'}</span>
                </div>
                <div class="care-item">
                    <span class="care-icon">💧</span>
                    <span class="care-label">Water</span>
                    <span>${product.care ? product.care.water : 'Water once a week'}</span>
                </div>
                <div class="care-item">
                    <span class="care-icon">☁️</span>
                    <span class="care-label">Humidity</span>
                    <span>${product.care ? product.care.humidity : 'Moderate humidity'}</span>
                </div>
                <button class="btn btn-outline full-width add-to-cart-btn" onclick="window.addToCart(${product.id})" style="margin-top: 20px">SHOP Rs.${product.price.toLocaleString()}</button>
            </div>
        </div>
    `).join('');
}

function renderAdminDashboard() {
    const grid = getEl('adminGrid');
    const tabs = getEl('adminTabsContainer');
    if (!grid) return;
    
    const totalSalesValue = productsList.reduce((sum, p) => sum + (p.sales * p.price), 0);
    const totalUnitsSold = productsList.reduce((sum, p) => sum + p.sales, 0);
    const inventoryValue = productsList.reduce((sum, p) => sum + (p.stock * p.price), 0);

    getEl('statTotalSales').textContent = `Rs.${totalSalesValue.toLocaleString()}`;
    getEl('statUnitsSold').textContent = totalUnitsSold.toLocaleString();
    getEl('statInventoryValue').textContent = `Rs.${inventoryValue.toLocaleString()}`;

    // Filter products - MAIN GRID ONLY SHOWS PLANTS NOW
    const filteredProducts = productsList.filter(p => p.type === 'Indoor' || p.type === 'Outdoor');

    const heroEditorHtml = `
        <div class="admin-section" style="background: #fff; padding: 25px; border-radius: 15px; border: 1px solid #eee;">
            <h3 style="margin-bottom: 20px; font-size: 1.2rem; color: #1a3a3a;">Social Media Presence</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                ${Object.keys(socialLinks).map(key => `
                    <div class="form-group" style="margin:0">
                        <label style="font-size: 0.7rem; color: #999; font-weight: 700; text-transform: uppercase;">${key}</label>
                        <div style="display: flex; gap: 5px;">
                            <input type="text" id="social-${key}" class="admin-input" value="${socialLinks[key]}" placeholder="Enter ${key} URL">
                            <button class="btn btn-outline" style="padding: 5px 10px;" onclick="window.copySocialLink('${key}')">📋</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" style="margin-top: 20px; padding: 10px 30px;" onclick="window.saveSocialLinks()">SAVE SOCIAL LINKS</button>
        </div>

        <div class="admin-card" style="margin-top: 40px; margin-bottom: 40px; padding: 30px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05)">
            <h3 style="margin-bottom: 20px; color: #0D2F2F; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                SECURITY SETTINGS
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group" style="margin:0">
                    <label style="font-size: 0.7rem; color: #999; font-weight: 700;">CURATOR USERNAME</label>
                    <input type="text" id="new-admin-user" class="admin-input" value="${adminCreds.user}">
                </div>
                <div class="form-group" style="margin:0">
                    <label style="font-size: 0.7rem; color: #999; font-weight: 700;">SET NEW PASSWORD</label>
                    <input type="password" id="new-admin-pass" class="admin-input" placeholder="Enter new password">
                </div>
            </div>
            <button class="btn btn-primary" style="margin-top: 20px; padding: 10px 30px;" onclick="window.saveSecuritySettings()">UPDATE CREDENTIALS</button>
        </div>
    `;

    grid.innerHTML = heroEditorHtml + filteredProducts.map(product => renderAdminItemCard(product)).join('');
}

function renderAdminItemCard(product) {
    const isPlant = product.type === 'Indoor' || product.type === 'Outdoor';
    return `
        <div class="admin-item-card">
            <div class="admin-card-header">
                <img src="${product.image}" alt="${product.name}" class="admin-item-img">
                <div class="admin-item-details">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start">
                        <h4>${product.name}</h4>
                        <button class="delete-btn" onclick="window.deletePlant(${product.id})">DELETE</button>
                    </div>
                    <span style="font-size: 0.8rem; color: #999">${product.sales} Units Sold | ${product.type}</span>
                </div>
            </div>
            <div class="admin-card-body">
                <div class="form-group" style="margin:0">
                    <label style="font-size: 0.7rem; color: #999; font-weight: 700">PRICE (Rs.)</label>
                    <input type="number" id="price-${product.id}" class="admin-input" value="${product.price}">
                </div>
                <div class="form-group" style="margin:0">
                    <label style="font-size: 0.7rem; color: #999; font-weight: 700">STOCK (QTY)</label>
                    <input type="number" id="stock-${product.id}" class="admin-input" value="${product.stock}">
                </div>
                ${isPlant ? `
                    <div class="form-group" style="grid-column: span 2; margin:0">
                        <label style="font-size: 0.7rem; color: #999; font-weight: 700">LIGHT</label>
                        <input type="text" id="light-${product.id}" class="admin-input" value="${product.care ? product.care.light : ''}">
                    </div>
                    <div class="form-group" style="grid-column: span 2; margin:0">
                        <label style="font-size: 0.7rem; color: #999; font-weight: 700">WATER</label>
                        <input type="text" id="water-${product.id}" class="admin-input" value="${product.care ? product.care.water : ''}">
                    </div>
                ` : ''}
                <button class="admin-update-btn" onclick="window.updatePlant(${product.id})">UPDATE ${product.type.toUpperCase()}</button>
            </div>
        </div>
    `;
}

// Admin CRUD
window.openAddPlantModal = (requestedType) => {
    const title = getEl('addModalTitle');
    const submitBtn = getEl('addSubmitBtn');
    const typeSelect = getEl('addType');
    
    // Default visibility
    getEl('groupAddScientific').classList.remove('form-group-hidden');
    getEl('groupAddLight').classList.remove('form-group-hidden');
    getEl('groupAddWater').classList.remove('form-group-hidden');
    getEl('groupAddHumidity').classList.remove('form-group-hidden');

    if (requestedType === 'Accessory') {
        title.textContent = 'Add New Accessory';
        submitBtn.textContent = 'ADD ACCESSORY';
        typeSelect.value = 'Accessory';
        getEl('groupAddScientific').classList.add('form-group-hidden');
        getEl('groupAddLight').classList.add('form-group-hidden');
        getEl('groupAddWater').classList.add('form-group-hidden');
        getEl('groupAddHumidity').classList.add('form-group-hidden');
    } else if (requestedType === 'Gift') {
        title.textContent = 'Add Gift Item';
        submitBtn.textContent = 'ADD GIFT';
        typeSelect.value = 'Gift';
        getEl('groupAddScientific').classList.add('form-group-hidden');
        getEl('groupAddLight').classList.add('form-group-hidden');
        getEl('groupAddWater').classList.add('form-group-hidden');
        getEl('groupAddHumidity').classList.add('form-group-hidden');
    } else {
        title.textContent = 'Add New Plant';
        submitBtn.textContent = 'ADD TO COLLECTION';
        typeSelect.value = 'Indoor';
    }

    addPlantModal.classList.add('active');
    overlay.classList.add('active');
};

window.openCategoryManager = (category) => {
    const title = getEl('categoryManagerTitle');
    const grid = getEl('categoryManagerGrid');
    
    title.textContent = `Manage ${category}s`;
    const items = productsList.filter(p => p.type === category);
    
    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No ${category.toLowerCase()}s found in the collection.</p>`;
    } else {
        grid.innerHTML = items.map(product => renderAdminItemCard(product)).join('');
    }

    getEl('categoryManagerModal').classList.add('active');
    getEl('overlay').classList.add('active');
};

window.deletePlant = (id) => {
    if (confirm('Are you sure you want to remove this plant from the collection?')) {
        const index = productsList.findIndex(p => p.id === id);
        if (index !== -1) {
            productsList.splice(index, 1);
            saveProducts();
            showSuccessToast('Plant removed successfully');
            refreshAllViews();
        }
    }
};

window.updatePlant = (id) => {
    const product = productsList.find(p => p.id === id);
    const newPrice = document.getElementById(`price-${id}`).value;
    const newStock = document.getElementById(`stock-${id}`).value;
    
    if (product) {
        product.price = parseFloat(newPrice);
        product.stock = parseInt(newStock);
        
        const lightEl = document.getElementById(`light-${id}`);
        const waterEl = document.getElementById(`water-${id}`);
        const humEl = document.getElementById(`humidity-${id}`);

        if (lightEl) {
            if (!product.care) product.care = {};
            product.care.light = lightEl.value;
            product.care.water = waterEl.value;
            product.care.humidity = humEl ? humEl.value : '';
        }

        saveProducts();
        showSuccessToast(`${product.name} updated successfully!`);
        refreshAllViews();
    }
};

function handleAddPlant(e) {
    e.preventDefault();
    const newPlant = {
        id: Date.now(),
        name: document.getElementById('addName').value,
        scientificName: document.getElementById('addScientific').value,
        price: parseFloat(document.getElementById('addPrice').value),
        stock: parseInt(document.getElementById('addStock').value),
        type: document.getElementById('addType').value,
        image: document.getElementById('addImage').value,
        description: document.getElementById('addDesc').value,
        sales: 0,
        category: 'Foliage',
        care: {
            light: document.getElementById('addLight').value,
            water: document.getElementById('addWater').value,
            humidity: document.getElementById('addHumidity').value,
            temp: '65-75°F'
        }
    };
    productsList.push(newPlant);
    saveProducts();
    showSuccessToast(`${newPlant.name} added to collection!`);
    addPlantForm.reset();
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('previewPlaceholder').classList.remove('hidden');
    closeAllDrawers();
    refreshAllViews();
}

function saveProducts() {
    localStorage.setItem('plantHavenProducts', JSON.stringify(productsList));
}

window.openStoryModal = () => {
    document.getElementById('editStoryText').value = storyData.mission;
    document.getElementById('editQuoteText').value = storyData.quote;
    document.getElementById('editQuoteAuthor').value = storyData.author;
    storyModal.classList.add('active');
    overlay.classList.add('active');
};

function handleStoryUpdate(e) {
    e.preventDefault();
    storyData = {
        mission: document.getElementById('editStoryText').value,
        quote: document.getElementById('editQuoteText').value,
        author: document.getElementById('editQuoteAuthor').value
    };
    localStorage.setItem('plantHavenStory', JSON.stringify(storyData));
    showSuccessToast('Brand story updated successfully');
    renderStory();
    closeAllDrawers();
}

function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'update-success';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Auth
async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const hashedPass = await hashPassword(pass);
    if (user === adminCreds.user && hashedPass === adminCreds.pass) {
        isAdmin = true;
        sessionStorage.setItem('plantHavenAdmin', true);
        updateAdminUI();
        closeAllDrawers();
        showView('admin');
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
}

function handleForgotPassword() {
    if (confirm("Forgot your credentials? Click OK to reset them to the defaults (admin / botany2026).")) {
        localStorage.removeItem('plantHavenCreds');
        showSuccessToast('Credentials reset to defaults. Page will reload.');
        setTimeout(() => location.reload(), 1500);
    }
}

window.saveSecuritySettings = async () => {
    const newUser = getEl('new-admin-user').value.trim();
    const newPass = getEl('new-admin-pass').value.trim();
    
    if (!newUser || !newPass) {
        alert('Credentials cannot be empty.');
        return;
    }
    
    const hashedPass = await hashPassword(newPass);
    adminCreds = { user: newUser, pass: hashedPass };
    localStorage.setItem('plantHavenCreds', JSON.stringify(adminCreds));
    showSuccessToast('Security credentials updated successfully!');
    getEl('new-admin-pass').value = ''; // clear field
    renderAdminDashboard();
};

function logout() {
    isAdmin = false;
    sessionStorage.removeItem('plantHavenAdmin');
    updateAdminUI();
    showView('home');
}

function updateAdminUI() {
    const status = getEl('adminStatus');
    const btn = getEl('adminLoginBtn');
    if (!btn) return;

    if (isAdmin) {
        if (status) status.classList.remove('hidden');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span style="font-size: 0.8rem; font-weight: 600; margin-left: 8px;">LOGOUT</span>
        `;
    } else {
        if (status) status.classList.add('hidden');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span style="font-size: 0.8rem; font-weight: 600; margin-left: 8px;">ADMIN ACCESS</span>
        `;
    }
}

function showView(viewName) {
    Object.keys(views).forEach(v => {
        const el = getEl(views[v]);
        if (!el) return;
        if (v === viewName) el.classList.remove('hidden');
        else el.classList.add('hidden');
    });
    Object.keys(navLinks).forEach(v => {
        const el = navLinks[v];
        if (el) {
            if (v === viewName) el.classList.add('active');
            else el.classList.remove('active');
        }
    });
    currentView = viewName;
    if (viewName === 'admin') renderAdminDashboard();
    window.scrollTo(0, 0);
}

// Cart functions moved to global scope
function saveCart() {
    localStorage.setItem('plantHavenCart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) return alert('Your pot is empty.');
    openCheckout();
}

function openCheckout() {
    // Reset to step 1
    document.getElementById('shippingStep').classList.remove('hidden');
    document.getElementById('paymentStep').classList.add('hidden');
    document.getElementById('checkoutSteps').classList.remove('hidden');
    document.getElementById('checkoutSuccess').classList.add('hidden');
    document.getElementById('checkoutStepTitle').textContent = 'Shipping Details';
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
    if (getEl('qrDisplaySection')) getEl('qrDisplaySection').classList.add('hidden');
    
    checkoutModal.classList.add('active');
    overlay.classList.add('active');
}

window.nextCheckoutStep = () => {
    // Basic validation
    const name = document.getElementById('shipName').value;
    const phone = document.getElementById('shipPhone').value;
    const addr = document.getElementById('shipAddress').value;
    
    if (!name || !phone || !addr) return alert('Please complete all shipping details.');
    
    document.getElementById('shippingStep').classList.add('hidden');
    document.getElementById('paymentStep').classList.remove('hidden');
    document.getElementById('checkoutStepTitle').textContent = 'Payment & Summary';
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    
    updateOrderSummary();
};

window.prevCheckoutStep = () => {
    document.getElementById('shippingStep').classList.remove('hidden');
    document.getElementById('paymentStep').classList.add('hidden');
    document.getElementById('checkoutStepTitle').textContent = 'Shipping Details';
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
};

function updateOrderSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.05;
    const shipping = 50;
    
    orderSummary.innerHTML = `
        <h4>Order Summary</h4>
        ${cart.map(item => `
            <div class="summary-row">
                <span>${item.name} x${item.quantity}</span>
                <span>Rs.${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('')}
        <div class="summary-row" style="margin-top: 15px; border-top: 1px dashed #DDD; padding-top: 10px;">
            <span>Subtotal</span>
            <span>Rs.${total.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>GST (5%)</span>
            <span>Rs.${tax.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Botanical Courier</span>
            <span>Rs.${shipping.toLocaleString()}</span>
        </div>
        <div class="summary-total">
            <span>Total Adoption Fee</span>
            <span>Rs.${(total + tax + shipping).toLocaleString()}</span>
        </div>
    `;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Process inventory
    cart.forEach(item => {
        const product = productsList.find(p => p.id === item.id);
        if (product) {
            product.sales += item.quantity;
            product.stock -= item.quantity;
        }
    });
    
    saveProducts();
    cart = [];
    saveCart();
    updateCartUI();
    
    // Show success
    document.getElementById('checkoutSteps').classList.add('hidden');
    document.getElementById('checkoutSuccess').classList.remove('hidden');
    refreshAllViews();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(el => el.textContent = totalCount);
    
    const container = getEl('cartItems');
    if (!container) return;
    
    container.innerHTML = cart.length === 0 
        ? '<p style="text-align:center; padding: 60px 0; color: #999; font-style: italic">Your shopping pot is empty.</p>' 
        : cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rs.${item.price.toLocaleString()}</p>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="window.updateQty(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="window.updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="icon-btn" onclick="window.removeItem(${item.id})" style="color: #c00">&times;</button>
            </div>
        `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalEl = getEl('cartTotal');
    if (totalEl) totalEl.textContent = `Rs.${total.toLocaleString()}`;
}

function openCart() {
    const drawer = getEl('cartDrawer');
    const overlay = getEl('overlay');
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function closeAllDrawers() {
    const overlay = getEl('overlay');
    document.querySelectorAll('.modal, .cart-drawer, .mobile-sidebar').forEach(el => el.classList.remove('active'));
    if (overlay) overlay.classList.remove('active');
}

function openProductDetail(productId) {
    const product = productsList.find(p => p.id === productId);
    if (!product) return;
    modalBody.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-img" onerror="this.src='assets/placeholder.png'; this.onerror=null;">
        <div class="modal-info">
            <h2>${product.name}</h2>
            <p class="scientific-name">${product.scientificName} | ${product.type}</p>
            <p class="price" style="font-size: 1.5rem">Rs.${product.price.toLocaleString()}</p>
            <p style="margin: 15px 0; font-size: 0.95rem; color: #666; line-height: 1.5">${product.description}</p>
            <button class="btn btn-primary full-width add-to-cart-btn" onclick="window.addToCart(${product.id})">ADD TO POT</button>
        </div>
    `;
    productModal.classList.add('active');
    overlay.classList.add('active');
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    if (currentView !== 'home') showView('home');
    const filtered = productsList.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered, productGrid);
}

function setupEventListeners() {
    const get = (id) => getEl(id);
    
    get('cartToggle')?.addEventListener('click', openCart);
    get('closeCart')?.addEventListener('click', closeAllDrawers);
    get('closeModal')?.addEventListener('click', closeAllDrawers);
    get('closeLogin')?.addEventListener('click', closeAllDrawers);
    get('closeAddPlant')?.addEventListener('click', closeAllDrawers);
    get('closeStory')?.addEventListener('click', closeAllDrawers);
    get('closeCategoryManager')?.addEventListener('click', closeAllDrawers);
    get('closeCheckout')?.addEventListener('click', closeAllDrawers);
    get('overlay')?.addEventListener('click', closeAllDrawers);
    
    get('mobileMenuBtn')?.addEventListener('click', () => {
        get('mobileSidebar')?.classList.add('active');
        get('overlay')?.classList.add('active');
    });
    
    get('closeMenuBtn')?.addEventListener('click', () => {
        get('mobileSidebar')?.classList.remove('active');
        get('overlay')?.classList.remove('active');
    });
    
    get('searchInput')?.addEventListener('input', handleSearch);
    get('loginForm')?.addEventListener('submit', handleLogin);
    get('addPlantForm')?.addEventListener('submit', handleAddPlant);
    get('storyForm')?.addEventListener('submit', handleStoryUpdate);
    get('checkoutForm')?.addEventListener('submit', handleCheckoutSubmit);
    get('forgotPassword')?.addEventListener('click', handleForgotPassword);
    document.querySelector('.logo')?.addEventListener('click', () => {
        location.reload();
    });

    // Payment method toggle logic
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const qrSection = getEl('qrDisplaySection');
            if (e.target.value === 'mobile_banking') {
                qrSection?.classList.remove('hidden');
            } else {
                qrSection?.classList.add('hidden');
            }
        });
    });

    // Image Preview logic
    const imageInput = document.getElementById('addImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    
    imageInput.addEventListener('input', (e) => {
        const url = e.target.value;
        if (url) {
            imagePreview.src = url;
            imagePreview.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
            imagePreview.onerror = () => {
                imagePreview.src = 'assets/placeholder.png';
                imagePreview.onerror = null;
            };
        } else {
            imagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
        }
    });

    // Category Filter logic
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.type;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            refreshAllViews();
        });
    });

    navLinks.home.addEventListener('click', (e) => { e.preventDefault(); showView('home'); closeAllDrawers(); });
    navLinks.accessories.addEventListener('click', (e) => { e.preventDefault(); showView('accessories'); closeAllDrawers(); });
    navLinks.bestSellers.addEventListener('click', (e) => { e.preventDefault(); showView('bestSellers'); closeAllDrawers(); });
    navLinks.careGuides.addEventListener('click', (e) => { e.preventDefault(); showView('careGuides'); closeAllDrawers(); });

    // Mobile nav links
    get('mobNavHome')?.addEventListener('click', (e) => { e.preventDefault(); showView('home'); closeAllDrawers(); });
    get('mobNavAccessories')?.addEventListener('click', (e) => { e.preventDefault(); showView('accessories'); closeAllDrawers(); });
    get('mobNavBestSellers')?.addEventListener('click', (e) => { e.preventDefault(); showView('bestSellers'); closeAllDrawers(); });
    get('mobNavCareGuides')?.addEventListener('click', (e) => { e.preventDefault(); showView('careGuides'); closeAllDrawers(); });

    // Master Delegate for Admin and UI
    document.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('.add-to-cart-btn');
        const productCard = e.target.closest('.product-card-clickable');
        const loginBtn = e.target.closest('#adminLoginBtn');

        if (cartBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = cartBtn.dataset.id;
            window.addToCart(id);
        } else if (productCard) {
            const id = productCard.dataset.id;
            openProductDetail(parseInt(id));
        } else if (loginBtn) {
            if (isAdmin) {
                isAdmin = false;
                sessionStorage.removeItem('plantHavenAdmin');
                showView('home');
                updateAdminUI();
                showSuccessToast('Logged out successfully.');
            } else {
                getEl('loginModal')?.classList.add('active');
                getEl('overlay')?.classList.add('active');
            }
        }
    });

    window.updateQty = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
            saveCart();
            updateCartUI();
        }
    };
    window.removeItem = (id) => {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        updateCartUI();
    };
    window.addToCart = addToCart;
    window.openProductDetail = openProductDetail;
    window.showView = showView;
    window.checkout = checkout;
    window.saveSocialLinks = () => {
        Object.keys(socialLinks).forEach(key => {
            socialLinks[key] = getEl(`social-${key}`).value;
        });
        localStorage.setItem('plantHavenSocial', JSON.stringify(socialLinks));
        renderSocialLinks();
        showSuccessToast('Social links updated successfully!');
    };

    window.copySocialLink = (key) => {
        const url = getEl(`social-${key}`).value;
        navigator.clipboard.writeText(url).then(() => {
            showSuccessToast(`${key} link copied to clipboard!`);
        });
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
