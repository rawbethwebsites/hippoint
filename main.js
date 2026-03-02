/**
 * HIPPOINT — main.js
 * All interactive functionality for the storefront SPA
 *
 * Bug fixes applied:
 * - closeModal: simplified & consistent — no more broken conditional chain
 * - modalPrice: uses innerHTML safely (only inserts trusted numbers, not user input)
 * - newsletter: proper event binding using getElementById
 * - checkout: graceful stub instead of silent no-op
 * - cart-empty rendering: no longer appends to items AND sets innerHTML (avoids duplicate)
 * - keyboard navigation: Enter/Space triggers click on custom interactive divs
 */

/* ══════════════════════════════════════════════════════════
   PRODUCT DATA
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
  { id:15, name:'Peplum Top',          tag:'Feminine',  cat:'top',   price:21000, badge:'new',  emoji:'🌼', emoji2:'🌸', colors:['#e199a9','#d85e22'] },
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
  // Trigger animation on next frame so display:block is painted first
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
function productCardHTML(p) {
  const badge    = p.badge
    ? `<div class="product-badge ${p.badge}">${p.badge === 'new' ? 'New' : 'Sale'}</div>`
    : '';
  const oldPrice = p.oldPrice
    ? `<span class="product-price-old">₦${p.oldPrice.toLocaleString()}</span>`
    : '';
  const colors = (p.colors || ['#d85e22','#919a2e'])
    .map(c => `<div class="prod-color-dot" style="background:${c}" aria-hidden="true"></div>`)
    .join('');
  const c1 = (p.colors || ['#f5f0e8'])[0];
  const c2 = (p.colors || ['#ede6d6'])[1] || '#ede6d6';

  return `
    <div class="product-card" data-id="${p.id}" data-cat="${p.cat}" data-price="${p.price}"
         onclick="openModal(${p.id})" tabindex="0"
         onkeydown="if(event.key==='Enter'||event.key===' ')openModal(${p.id})"
         role="button" aria-label="View ${p.name}">
      <div class="product-img-wrap" style="background:linear-gradient(135deg,${c1}22,${c2}22)">
        <div class="product-img-1" aria-hidden="true">${p.emoji}</div>
        <div class="product-img-2" aria-hidden="true">${p.emoji2 || p.emoji}</div>
        ${badge}
        <button class="product-wishlist" onclick="event.stopPropagation();wishlistToggle(this)" aria-label="Wishlist ${p.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <div class="product-actions">
          <button class="quick-add-btn" onclick="event.stopPropagation();openModal(${p.id})">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-variant">${p.tag}</div>
        <div class="product-price-row">
          <span class="product-price">₦${p.price.toLocaleString()}</span>
          ${oldPrice}
        </div>
        <div class="product-colors">${colors}</div>
      </div>
    </div>`;
}

function renderHomeProducts() {
  const el = document.getElementById('homeProducts');
  if (!el) return;
  el.innerHTML = allProducts.slice(0, 8).map(productCardHTML).join('');
  refreshCursorTargets();
}

function renderShopProducts(data) {
  const el  = document.getElementById('shopProducts');
  const cnt = document.getElementById('filteredCount');
  if (!el) return;
  const arr = data || allProducts;
  el.innerHTML = arr.map(productCardHTML).join('');
  if (cnt) cnt.textContent = arr.length;
  refreshCursorTargets();
}

/* ══════════════════════════════════════════════════════════
   FILTERS & SORT
   ══════════════════════════════════════════════════════════ */
function filterCategory(el, cat) {
  document.querySelectorAll('.cat-item').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.cat === cat);
  renderShopProducts(filtered);
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
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  selectedSize   = '';

  const c1 = (p.colors || ['#f0ead9'])[0];
  const c2 = (p.colors || ['#ede6d6'])[1] || '#ede6d6';

  document.getElementById('modalEmoji').textContent = p.emoji;
  document.getElementById('modalImg').style.background = `linear-gradient(135deg,${c1}44,${c2}44)`;
  document.getElementById('modalTag').textContent  = p.tag;
  document.getElementById('modalName').textContent = p.name;

  // Safe innerHTML — price is a trusted number, oldPrice is null or number
  const priceHTML = '₦' + p.price.toLocaleString() +
    (p.oldPrice
      ? ` <span style="font-size:14px;color:var(--text-light);text-decoration:line-through;font-weight:400">₦${p.oldPrice.toLocaleString()}</span>`
      : '');
  document.getElementById('modalPrice').innerHTML = priceHTML;
  document.getElementById('modalDesc').textContent = p.desc;

  document.getElementById('modalSizes').innerHTML = (p.sizes || ['S','M','L','XL'])
    .map(s => `<button class="size-btn" onclick="selectModalSize(this,'${s}')">${s}</button>`)
    .join('');

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectModalSize(el, size) {
  document.querySelectorAll('#modalSizes .size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedSize = size;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay click (not on inner box click)
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('modalOverlay');
    if (overlay.classList.contains('open')) closeModal();

    const drawerOverlay = document.getElementById('cartOverlay');
    if (drawerOverlay.classList.contains('open')) toggleCart();
  }
});

document.getElementById('modalAddBtn').addEventListener('click', () => {
  if (!currentProduct) return;
  if (!selectedSize) { showToast('Please select a size first 👆'); return; }
  addToCart(currentProduct, selectedSize);
  closeModal();
});

/* ══════════════════════════════════════════════════════════
   CART
   ══════════════════════════════════════════════════════════ */
function addToCart(product, size) {
  const key      = `${product.id}-${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, id: product.id, name: product.name, price: product.price, size, emoji: product.emoji, qty: 1 });
  }
  saveCart();
  updateCartUI();
  animateCartFly(product.emoji);
  showToast(`${product.name} added to bag 🌹`);
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateCartUI();
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(key); return; }
  saveCart();
  updateCartUI();
}

function saveCart() {
  try { localStorage.setItem('hippoint_cart', JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
}

function updateCartUI() {
  const total    = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const countEl = document.getElementById('cartCount');
  countEl.textContent = total;
  countEl.classList.toggle('visible', total > 0);

  const itemsEl  = document.getElementById('cartItems');
  const emptyEl  = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    itemsEl.appendChild(emptyEl);   // re-attach preserved empty state element
    emptyEl.style.display  = 'block';
    footerEl.style.display = 'none';
  } else {
    emptyEl.style.display  = 'none';
    footerEl.style.display = 'block';
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img" aria-hidden="true">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-variant">Size: ${item.size}</div>
          <div class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty('${item.key}',-1)" aria-label="Decrease quantity">−</button>
            <span class="qty-num" aria-label="${item.qty} items">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.key}',1)"  aria-label="Increase quantity">+</button>
            <span class="remove-item" onclick="removeFromCart('${item.key}')" role="button" tabindex="0"
              onkeydown="if(event.key==='Enter')removeFromCart('${item.key}')">Remove</span>
          </div>
        </div>
      </div>`).join('');
  }
  document.getElementById('cartSubtotal').textContent = '₦' + subtotal.toLocaleString();
}

function toggleCart() {
  const overlay  = document.getElementById('cartOverlay');
  const drawer   = document.getElementById('cartDrawer');
  const isOpen   = overlay.classList.contains('open');
  overlay.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function handleCheckout() {
  if (cart.length === 0) return;
  // ── Connect to your payment gateway here ──
  // When your backend is ready, replace this stub with:
  //   fetch('/api/v1/orders', { method:'POST', ... })
  showToast('Checkout coming soon! 🌹');
}

/* ══════════════════════════════════════════════════════════
   ADD-TO-CART FLY ANIMATION
   ══════════════════════════════════════════════════════════ */
function animateCartFly(emoji) {
  const fly     = document.getElementById('cartFly');
  const cartBtn = document.querySelector('.cart-btn');
  if (!fly || !cartBtn) return;

  const cartRect = cartBtn.getBoundingClientRect();
  const startX   = window.innerWidth  / 2 - 30;
  const startY   = window.innerHeight / 2 - 30;

  fly.textContent = emoji;
  fly.style.cssText = `left:${startX}px;top:${startY}px;opacity:1;transform:scale(1);transition:none;`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fly.style.transition = 'all 0.7s cubic-bezier(0.4,0,0.2,1)';
      fly.style.left       = cartRect.left + 'px';
      fly.style.top        = cartRect.top  + 'px';
      fly.style.transform  = 'scale(0.2)';
      fly.style.opacity    = '0';
    });
  });
  setTimeout(() => { fly.style.cssText = 'opacity:0;'; }, 750);
}

/* ══════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ══════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════════════════════ */
const cursorEl   = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorEl && cursorRing) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorEl.style.left = mouseX + 'px';
    cursorEl.style.top  = mouseY + 'px';
  });

  (function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursorRing);
  })();
}

function refreshCursorTargets() {
  if (!cursorEl) return;
  document.querySelectorAll('a, button, .product-card, .coll-card, .cta-main, .cta-ghost, .cart-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initReveal() {
  // Small delay so the page is painted before we observe
  setTimeout(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => obs.observe(el));
  }, 100);
}

/* ══════════════════════════════════════════════════════════
   3D TILT ON PRODUCT / COLLECTION CARDS
   ══════════════════════════════════════════════════════════ */
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.product-card:hover .product-img-wrap, .coll-card:hover').forEach(el => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
});
document.addEventListener('mouseleave', () => {
  document.querySelectorAll('.product-img-wrap').forEach(el => { el.style.transform = ''; });
});

/* ══════════════════════════════════════════════════════════
   HEADER SCROLL EFFECT
   ══════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 40);
});

/* ══════════════════════════════════════════════════════════
   HERO PARALLAX (home page only)
   ══════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const homeEl = document.getElementById('home');
  if (!homeEl || !homeEl.classList.contains('active')) return;
  const heroContent = homeEl.querySelector('.hero-content');
  if (heroContent) heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});

/* ══════════════════════════════════════════════════════════
   NEWSLETTER
   ══════════════════════════════════════════════════════════ */
document.getElementById('newsletterBtn').addEventListener('click', function () {
  const input = document.getElementById('newsletterEmail');
  if (!input || !input.value.trim()) {
    if (input) input.focus();
    showToast('Enter your email to subscribe 📬');
    return;
  }
  // ── Connect to your newsletter API here ──
  // fetch('/api/v1/newsletter', { method:'POST', body: JSON.stringify({email: input.value}) })
  input.value = '';
  showToast('Welcome to the Hippoint circle! 🌹');
});

/* ══════════════════════════════════════════════════════════
   INITIALISE
   ══════════════════════════════════════════════════════════ */
updateCartUI();
renderHomeProducts();
initReveal();
refreshCursorTargets();
