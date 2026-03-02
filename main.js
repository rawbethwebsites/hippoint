/**
 * HIPPOINT — main.js
 * All interactive functionality for the storefront SPA
 * 
 * SUPPBASE CONFIGURATION:
 * - Set SUPABASE_URL and SUPABASE_ANON_KEY below
 * - Products, orders, and newsletter will be fetched from Supabase
 * - Falls back to hardcoded data if Supabase is not configured
 */

/* ══════════════════════════════════════════════════════════
   SUPABASE CONFIGURATION
   ══════════════════════════════════════════════════════════ */
const SUPABASE_URL = 'https://asxqwynhxiooulythjvr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeHF3eW5oeGlvb3VseXRoanZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTYzNTgsImV4cCI6MjA4ODAzMjM1OH0.6TD2XEZSOeWZssG1hSdqrB0DFiDZTyecu8afnTH8lAg';

const supabase = SUPABASE_URL ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

/* ══════════════════════════════════════════════════════════
   PRODUCT DATA (FALLBACK)
   ══════════════════════════════════════════════════════════ */
const products = [
  { id:1,  name:'Ankara Wrap Dress',   tag:'Bestseller', cat:'dress', price:42000, oldPrice:null,  badge:'new',  emoji:'👗', emoji2:'✨', colors:['#d85e22','#919a2e','#2a1f14'], sizes:['XS','S','M','L','XL'],       desc:'A fluid wrap dress in bold Ankara print. Features a V-neckline, tie waist, and midi length. Perfect from morning meetings to evening outings.' },
  { id:2,  name:'Kente Blazer Set',    tag:'Workwear',   cat:'set',   price:68000, oldPrice:85000, badge:'sale', emoji:'🧥', emoji2:'💼', colors:['#919a2e','#a8b68e'],            sizes:['S','M','L','XL'],            desc:'A structured co-ord blazer and straight-leg trouser set in authentic kente-inspired woven fabric. Command every room.' },
  { id:3,  name:'Boubou Blouse',       tag:'Everyday',   cat:'top',   price:28000, oldPrice:null,  badge:null,   emoji:'👚', emoji2:'🌿', colors:['#e199a9','#f7cdec','#d85e22'], sizes:['XS','S','M','L','XL','2XL'], desc:'A relaxed, breezy blouse with traditional boubou-inspired silhouette. Pairs beautifully with tailored trousers or your favourite denim.' },
  { id:4,  name:'Adire Midi Skirt',    tag:'Statement',  cat:'skirt', price:35000, oldPrice:null,  badge:null,   emoji:'👘', emoji2:'🌺', colors:['#2a1f14','#d85e22'],            sizes:['XS','S','M','L'],            desc:'Hand-dyed adire fabric shaped into a flowing midi skirt with a concealed side zip. No two skirts are exactly alike.' },
  { id:5,  name:'Ankara Shirt Dress',  tag:'New',        cat:'dress', price:38000, oldPrice:null,  badge:'new',  emoji:'🥻', emoji2:'🦋', colors:['#e63a31','#d85e22'],            sizes:['S','M','L','XL'],            desc:'A button-down shirt dress reimagined in vibrant Ankara print. Roll up the sleeves for weekend ease or style it belted for work.' },
  { id:6,  name:'The Everyday Co-ord', tag:'Essential',  cat:'set',   price:54000, oldPrice:62000, badge:'sale', emoji:'👔', emoji2:'✦',  colors:['#a8b68e','#919a2e','#f7cdec'], sizes:['XS','S','M','L','XL'],       desc:'A boxy top and wide-leg trouser set in sage-toned fabric with subtle print detail. Comfortable enough to sleep in, polished enough for the office.' },
  { id:7,  name:'Rose Print Blouse',   tag:'Romantic',   cat:'top',   price:24000, oldPrice:null,  badge:null,   emoji:'🌹', emoji2:'🌸', colors:['#e199a9','#f7cdec'],            sizes:['XS','S','M','L','XL','2XL'], desc:'The Rose Touch in fabric form. A silk-feel blouse in our signature dusty rose with hand-printed rose motifs. The softest thing you will wear.' },
  { id:8,  name:'Wrap Skirt',          tag:'Versatile',  cat:'skirt', price:22000, oldPrice:null,  badge:null,   emoji:'🧣', emoji2:'🌿', colors:['#d85e22','#919a2e','#2a1f14'], sizes:['S','M','L','XL','2XL'],      desc:'One skirt, infinite ways to wear it. Our wrap skirt in geometric Ankara can be tied at different lengths and worn front-to-back.' },
];

/* Extend catalogue to 24 items */
const allProducts = [...products];
const extraItems = [
  { id:9,  name:'Fila Print Top',      tag:'Casual',    cat:'top',   price:18000, badge:'new',  emoji:'👕', emoji2:'🌿', colors:['#d85e22','#a8b68e'] },
  { id:10, name:'Aso-Oke Gown',        tag:'Statement', cat:'dress', price:95000, badge:null,   emoji:'👑', emoji2:'✨', colors:['#919a2e','#2a1f14'] },
  { id:11, name:'Print Mini Dress',    tag:'Playful',   cat:'dress', price:31000, badge:'new',  emoji:'🌸', emoji2:'🦋', colors:['#e199a9','#f7cdec'] },
  { id:12, name:'Kaftan Blouse',       tag:'Comfort',   cat:'top',   price:26000, badge:null,   emoji:'🌺', emoji2:'🌿', colors:['#e63a31','#d85e22'] },
  { id:13, name:'Wax Print Suit',      tag:'Power',     cat:'set',   price:78000, badge:null,   emoji:'💼', emoji2:'🦁', colors:['#2a1f14','#919a2e'] },
  { id:14, name:'Pleated Midi Skirt',  tag:'Elegant',   cat:'skirt', price:29000, badge:null,   emoji:'🥂', emoji2:'✨', colors:['#a8b68e','#f7cdec'] },
  { id:15, name:'Peplum Top',          tag:'Feminine',   cat:'top',   price:21000, badge:'new',  emoji:'🌼', emoji2:'🌸', colors:['#e199a9','#d85e22'] },
  { id:16, name:'Maxi Wrap Dress',     tag:'Flow',      cat:'dress', price:47000, badge:null,   emoji:'🌊', emoji2:'🦋', colors:['#919a2e','#a8b68e'] },
];
extraItems.forEach(p => {
  allProducts.push({
    ...p,
    oldPrice: null,
    sizes: ['XS','S','M','L','XL'],
    desc: 'Crafted in quality African fabric with attention to every detail. Designed for the woman who moves between worlds with ease and grace.',
  });
});

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('hippoint_cart') || '[]'); } catch (e) { cart = []; }
let currentProduct = null;
let selectedSize    = '';

/* ══════════════════════════════════════════════════════════
   SUPABASE API FUNCTIONS
   ══════════════════════════════════════════════════════════ */
async function fetchProductsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return null;
  }
}

async function createOrder(orderData) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone || null,
        items: JSON.stringify(orderData.items),
        total: orderData.total,
        status: 'pending'
      }])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase order error:', err);
    return { success: false, error: err.message };
  }
}

async function subscribeNewsletter(email) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase
      .from('newsletter')
      .insert([{ email }])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Supabase newsletter error:', err);
    return { success: false, error: err.message };
  }
}

/* ═, error: err═════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════ */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active', 'fade-in');
    p.style.display = 'none';
  });
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active-nav'));

  const target = document.getElementById(page);
  if (!target) return;
  target.style.display = 'block';
  requestAnimationFrame(() => target.classList.add('active', 'fade-in'));

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active-nav');

  if (page === 'shop') renderShopProducts();
  if (page === 'home') renderHomeProducts();
  initReveal();
}

/* ══════════════════════════════════════════════════════════
   RENDER PRODUCTS
   ══════════════════════════════════════════════════════════ */

// Map Supabase fields to local format
function normalizeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    tag: p.tag || '',
    cat: p.category || p.cat || 'general',
    price: Number(p.price) || 0,
    oldPrice: p.old_price || p.oldPrice || null,
    badge: p.badge || null,
    emoji: p.emoji || '👗',
    emoji2: p.emoji2 || p.emoji || '',
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (p.colors || ['#d85e22','#919a2e']),
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || ['XS','S','M','L','XL']),
    desc: p.description || p.desc || '',
  };
}

function productCardHTML(p) {
  // Normalize product data (handle both Supabase and fallback formats)
  const product = normalizeProduct(p);
  
  const badge    = product.badge
    ? `<div class="product-badge ${product.badge}">${product.badge === 'new' ? 'New' : 'Sale'}</div>`
    : '';
  const oldPrice = product.oldPrice
    ? `<span class="product-price-old">₦${product.oldPrice.toLocaleString()}</span>`
    : '';
  const colors = (product.colors || ['#d85e22','#919a2e'])
    .map(c => `<div class="prod-color-dot" style="background:${c}" aria-hidden="true"></div>`)
    .join('');
  const c1 = (product.colors || ['#f5f0e8'])[0];
  const c2 = (product.colors || ['#ede6d6'])[1] || '#ede6d6';

  return `
    <div class="product-card" data-id="${product.id}" data-cat="${product.cat}" data-price="${product.price}"
         onclick="openModal(${product.id})" tabindex="0"
         onkeydown="if(event.key==='Enter'||event.key===' ')openModal(${product.id})"
         role="button" aria-label="View ${product.name}">
      <div class="product-img-wrap" style="background:linear-gradient(135deg,${c1}22,${c2}22)">
        <div class="product-img-1" aria-hidden="true">${product.emoji}</div>
        <div class="product-img-2" aria-hidden="true">${product.emoji2 || product.emoji}</div>
        ${badge}
        <button class="product-wishlist" onclick="event.stopPropagation();wishlistToggle(this)" aria-label="Wishlist ${product.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <div class="product-actions">
          <button class="quick-add-btn" onclick="event.stopPropagation();openModal(${product.id})">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-variant">${product.tag}</div>
        <div class="product-price-row">
          <span class="product-price">₦${product.price.toLocaleString()}</span>
          ${oldPrice}
        </div>
        <div class="product-colors">${colors}</div>
      </div>
    </div>`;
}

function renderHomeProducts() {
  const el = document.getElementById('homeProducts');
  if (!el) return;
  
  if (USE_SUPABASE) {
    el.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Loading...</p>';
    fetchProductsFromSupabase().then(products => {
      if (products && products.length > 0) {
        el.innerHTML = products.slice(0, 8).map(p => productCardHTML(normalizeProduct(p))).join('');
      } else {
        el.innerHTML = allProducts.slice(0, 8).map(p => productCardHTML(normalizeProduct(p))).join('');
      }
      refreshCursorTargets();
    }).catch(() => {
      el.innerHTML = allProducts.slice(0, 8).map(p => productCardHTML(normalizeProduct(p))).join('');
      refreshCursorTargets();
    });
  } else {
    el.innerHTML = allProducts.slice(0, 8).map(p => productCardHTML(normalizeProduct(p))).join('');
    refreshCursorTargets();
  }
}

function renderShopProducts(data) {
  const el  = document.getElementById('shopProducts');
  const cnt = document.getElementById('filteredCount');
  if (!el) return;
  
  if (USE_SUPABASE && !data) {
    el.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Loading...</p>';
    fetchProductsFromSupabase().then(products => {
      if (products && products.length > 0) {
        el.innerHTML = products.map(p => productCardHTML(normalizeProduct(p))).join('');
        if (cnt) cnt.textContent = products.length;
      } else {
        el.innerHTML = allProducts.map(p => productCardHTML(normalizeProduct(p))).join('');
        if (cnt) cnt.textContent = allProducts.length;
      }
      refreshCursorTargets();
    }).catch(() => {
      el.innerHTML = allProducts.map(p => productCardHTML(normalizeProduct(p))).join('');
      if (cnt) cnt.textContent = allProducts.length;
      refreshCursorTargets();
    });
  } else {
    const arr = data || allProducts;
    el.innerHTML = arr.map(p => productCardHTML(normalizeProduct(p))).join('');
    if (cnt) cnt.textContent = arr.length;
    refreshCursorTargets();
  }
}

/* ══════════════════════════════════════════════════════════
   FILTERS & SORT
   ══════════════════════════════════════════════════════════ */
function filterCategory(el, cat) {
  document.querySelectorAll('.cat-item').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  
  if (USE_SUPABASE) {
    const el2 = document.getElementById('shopProducts');
    el2.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Loading...</p>';
    
    let query = supabase.from('products').select('*').eq('active', true);
    if (cat !== 'all') query = query.eq('category', cat);
    
    query.then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        const normalized = data.map(p => normalizeProduct(p));
        renderShopProducts(normalized);
      } else {
        const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.cat === cat);
        renderShopProducts(filtered.map(p => normalizeProduct(p)));
      }
    });
  } else {
    const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.cat === cat);
    renderShopProducts(filtered.map(p => normalizeProduct(p)));
  }
}

function toggleSize(el)   { el.classList.toggle('active'); }
function toggleSwatch(el) { el.classList.toggle('active'); }

function sortProducts(val) {
  let arr = [...allProducts];
  if (val === 'price-asc')  arr.sort((a, b) => a.price - b.price);
  if (val === 'price-desc') arr.sort((a, b) => b.price - a.price);
  if (val === 'new')        arr = arr.filter(p => p.badge === 'new').concat(arr.filter(p => p.badge !== 'new'));
  renderShopProducts(arr);
}

/* ══════════════════════════════════════════════════════════
   WISHLIST (UI-only toggle)
   ══════════════════════════════════════════════════════════ */
function wishlistToggle(btn) {
  const svg = btn.querySelector('svg');
  const filled = svg.getAttribute('data-filled') === 'true';
  svg.style.fill  = filled ? 'none'  : 'var(--red)';
  svg.style.stroke = filled ? 'var(--text-dark)' : 'var(--red)';
  svg.setAttribute('data-filled', filled ? 'false' : 'true');
}

/* ══════════════════════════════════════════════════════════
   QUICK VIEW MODAL
   ══════════════════════════════════════════════════════════ */
function openModal(id) {
  // First try to find in allProducts, then try Supabase
  let p = allProducts.find(x => x.id === id);
  
  if (!p && USE_SUPABASE) {
    // Fetch single product from Supabase
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          showModal(normalizeProduct(data));
        }
      });
    // Show loading or fallback
    p = allProducts.find(x => x.id === id);
  }
  
  if (!p) return;
  showModal(normalizeProduct(p));
}

function showModal(p) {
  // Normalize product data
  const product = normalizeProduct(p);
  currentProduct = product;
  selectedSize   = '';

  const c1 = (product.colors || ['#f0ead9'])[0];
  const c2 = (product.colors || ['#ede6d6'])[1] || '#ede6d6';

  document.getElementById('modalEmoji').textContent = product.emoji;
  document.getElementById('modalImg').style.background = `linear-gradient(135deg,${c1}44,${c2}44)`;
  document.getElementById('modalTag').textContent  = product.tag;
  document.getElementById('modalName').textContent = product.name;

  const priceHTML = '₦' + product.price.toLocaleString() +
    (product.oldPrice
      ? ` <span style="font-size:14px;color:var(--text-light);text-decoration:line-through;font-weight:400">₦${product.oldPrice.toLocaleString()}</span>`
      : '');
  document.getElementById('modalPrice').innerHTML = priceHTML;
  document.getElementById('modalDesc').textContent = product.desc;

  // Render sizes
  const sizeContainer = document.getElementById('modalSizes');
  if (sizeContainer) {
    const sizes = product.sizes || ['XS','S','M','L','XL'];
    sizeContainer.innerHTML = sizes.map(s => 
      `<div class="size-option ${s === selectedSize ? 'active' : ''}" onclick="selectSize(this,'${s}')">${s}</div>`
    ).join('');
  }

  // Render colors
  const colorContainer = document.getElementById('modalColors');
  if (colorContainer) {
    const colors = product.colors || ['#d85e22','#919a2e'];
    colorContainer.innerHTML = colors.map(c => 
      `<div class="color-swatch" style="background:${c}" onclick="toggleSwatch(this)"></div>`
    ).join('');
  }

  document.getElementById('quickViewModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function selectSize(el, size) {
  document.querySelectorAll('.size-option').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  selectedSize = size;
}

function closeModal() {
  document.getElementById('quickViewModal').style.display = 'none';
  document.body.style.overflow = '';
  currentProduct = null;
  selectedSize = '';
}

/* ══════════════════════════════════════════════════════════
   CART
   ══════════════════════════════════════════════════════════ */
function addToCart(id) {
  if (!currentProduct && !id) return;
  const p = currentProduct || allProducts.find(x => x.id === id);
  if (!p) return;
  
  const qtyInput = document.getElementById('modalQty');
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
  const size = selectedSize || 'M';
  
  const existing = cart.find(i => i.id === p.id && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, size, qty, emoji: p.emoji });
  }
  
  saveCart();
  updateCartUI();
  closeModal();
  showToast('Added to cart! 🛒');
}

function updateCartQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('hippoint_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartEl = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  
  if (!cartEl) return;
  
  if (cart.length === 0) {
    cartEl.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Your cart is empty</p>';
    if (countEl) countEl.textContent = '0';
    if (totalEl) totalEl.textContent = '₦0';
    return;
  }
  
  let total = 0;
  cartEl.innerHTML = cart.map((item, idx) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-variant">Size: ${item.size}</div>
          <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateCartQty(${idx},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty(${idx},1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})">×</button>
      </div>`;
  }).join('');
  
  if (countEl) countEl.textContent = cart.reduce((s,i) => s + i.qty, 0);
  if (totalEl) totalEl.textContent = '₦' + total.toLocaleString();
}

function toggleCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  if (!cartDrawer) return;
  
  const isOpen = cartDrawer.style.transform === 'translateX(0px)';
  cartDrawer.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0px)';
  document.getElementById('cartOverlay').style.display = isOpen ? 'none' : 'block';
}

function handleCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty! 🛒');
    return;
  }
  
  const orderData = {
    customer_name: 'Guest Customer',
    customer_email: 'guest@hippoint.com',
    items: cart.map(i => ({ product_id: i.id, name: i.name, qty: i.qty, price: i.price })),
    total: cart.reduce((s,i) => s + i.price * i.qty, 0),
  };
  
  if (USE_SUPABASE) {
    showToast('Processing order...');
    createOrder(orderData).then(result => {
      if (result.success) {
        cart = [];
        saveCart();
        updateCartUI();
        toggleCart();
        showToast('Order placed! We\'ll be in touch 🌹');
      } else {
        showToast('Order error. Please try again.');
      }
    });
  } else {
    // Demo mode - just show success
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
    showToast('Demo mode - Order placed! 🌹');
  }
}

/* ══════════════════════════════════════════════════════════
   NEWSLETTER
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  const newsletterBtn = document.getElementById('newsletterBtn');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', async function() {
      const input = document.getElementById('newsletterEmail');
      if (!input || !input.value.trim()) {
        showToast('Enter your email to subscribe 📬');
        return;
      }
      
      const email = input.value.trim();
      
      if (USE_SUPABASE) {
        const result = await subscribeNewsletter(email);
        if (result.success) {
          input.value = '';
          showToast('Welcome to the Hippoint circle! 🌹');
        } else {
          showToast('Something went wrong. Try again.');
        }
      } else {
        // Demo mode
        input.value = '';
        showToast('Welcome to the Hippoint circle! 🌹');
      }
    });
  }
});

/* ══════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════ */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--text-dark);color:#fff;padding:12px 24px;border-radius:8px;z-index:9999;font-size:14px';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 3000);
}

/* ══════════════════════════════════════════════════════════
   CURSOR EFFECTS
   ══════════════════════════════════════════════════════════ */
function refreshCursorTargets() {
  document.querySelectorAll('.product-card,nav a,button,.cat-item').forEach(el => {
    el.style.cursor = 'pointer';
  });
}

function initReveal() {
  setTimeout(() => {
    document.querySelectorAll('.product-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s, transform 0.4s';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 50);
    });
  }, 100);
}

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  renderHomeProducts();
  initReveal();
  
  // Modal close on overlay click
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  
  // Cart overlay click
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', toggleCart);
  }
  
  // Keyboard navigation for custom divs
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.classList.contains('product-card') || e.target.classList.contains('cat-item')) {
        e.preventDefault();
        e.target.click();
      }
    }
  });
});
