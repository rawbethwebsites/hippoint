/**
 * HIPPOINT — main.js
 * Premium storefront + lightweight CMS demo (Supabase-ready)
 */

/* ══════════════════════════════════════════════════════════
   SUPABASE CONFIGURATION (frontend/public)
   ══════════════════════════════════════════════════════════ */
const SUPABASE_URL = window.HIPPOINT_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.HIPPOINT_SUPABASE_ANON_KEY || '';

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
const USE_SUPABASE = !!supabase;

/* ══════════════════════════════════════════════════════════
   FALLBACK PRODUCT DATA
   ══════════════════════════════════════════════════════════ */
const baseProducts = [
  { id:1,name:'Ankara Wrap Dress',tag:'Bestseller',cat:'dress',price:42000,oldPrice:null,badge:'new',emoji:'👗',emoji2:'✨',colors:['#d85e22','#919a2e','#2a1f14'],sizes:['XS','S','M','L','XL'],desc:'A fluid wrap dress in bold Ankara print. From morning meetings to evening outings.' },
  { id:2,name:'Kente Blazer Set',tag:'Workwear',cat:'set',price:68000,oldPrice:85000,badge:'sale',emoji:'🧥',emoji2:'💼',colors:['#919a2e','#a8b68e'],sizes:['S','M','L','XL'],desc:'Structured blazer and trouser co-ord in kente-inspired weave.' },
  { id:3,name:'Boubou Blouse',tag:'Everyday',cat:'top',price:28000,oldPrice:null,badge:null,emoji:'👚',emoji2:'🌿',colors:['#e199a9','#f7cdec','#d85e22'],sizes:['XS','S','M','L','XL','2XL'],desc:'Relaxed boubou-inspired blouse for effortless comfort.' },
  { id:4,name:'Adire Midi Skirt',tag:'Statement',cat:'skirt',price:35000,oldPrice:null,badge:null,emoji:'👘',emoji2:'🌺',colors:['#2a1f14','#d85e22'],sizes:['XS','S','M','L'],desc:'Hand-dyed adire midi skirt; each piece has unique pattern movement.' },
  { id:5,name:'Ankara Shirt Dress',tag:'New',cat:'dress',price:38000,oldPrice:null,badge:'new',emoji:'🥻',emoji2:'🦋',colors:['#e63a31','#d85e22'],sizes:['S','M','L','XL'],desc:'Button-down shirt dress in vibrant Ankara for work and play.' },
  { id:6,name:'The Everyday Co-ord',tag:'Essential',cat:'set',price:54000,oldPrice:62000,badge:'sale',emoji:'👔',emoji2:'✦',colors:['#a8b68e','#919a2e','#f7cdec'],sizes:['XS','S','M','L','XL'],desc:'Boxy top + wide-leg trouser set in sage tones.' },
  { id:7,name:'Rose Print Blouse',tag:'Romantic',cat:'top',price:24000,oldPrice:null,badge:null,emoji:'🌹',emoji2:'🌸',colors:['#e199a9','#f7cdec'],sizes:['XS','S','M','L','XL','2XL'],desc:'The Rose Touch in fabric form with hand-printed rose motifs.' },
  { id:8,name:'Wrap Skirt',tag:'Versatile',cat:'skirt',price:22000,oldPrice:null,badge:null,emoji:'🧣',emoji2:'🌿',colors:['#d85e22','#919a2e','#2a1f14'],sizes:['S','M','L','XL','2XL'],desc:'Tie-to-fit wrap skirt in geometric Ankara.' }
];

const allProducts = [...baseProducts];
for (let i = 9; i <= 24; i += 1) {
  allProducts.push({
    id: i,
    name: `Hippoint Edit #${i}`,
    tag: i % 2 ? 'New Season' : 'Core',
    cat: ['dress', 'top', 'skirt', 'set'][i % 4],
    price: 18000 + (i * 2200),
    oldPrice: i % 5 === 0 ? 22000 + (i * 2200) : null,
    badge: i % 3 === 0 ? 'new' : (i % 7 === 0 ? 'sale' : null),
    emoji: ['👗', '🌿', '🧵', '🧥'][i % 4],
    emoji2: ['✨', '🌺', '🌹', '🦋'][i % 4],
    colors: [['#d85e22','#919a2e'],['#e199a9','#f7cdec'],['#a8b68e','#2a1f14'],['#e63a31','#d85e22']][i % 4],
    sizes: ['XS','S','M','L','XL'],
    desc: 'Crafted in quality African fabric with attention to movement, comfort, and culture.'
  });
}

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('hippoint_cart') || '[]'); } catch { cart = []; }

const state = {
  page: 'home',
  currentProduct: null,
  selectedSize: '',
  products: [...allProducts],
  visibleCount: 12,
  filters: {
    category: 'all',
    sizes: new Set(),
    colors: new Set(),
    price: 80000,
    sort: 'featured'
  },
  cms: {
    user: null,
    role: null,
    selectedPane: 'pages',
    blocks: [
      { id: crypto.randomUUID(), title: 'Hero Headline', body: 'AFRICAN BASICS FOR EVERYDAY COMFORT.' },
      { id: crypto.randomUUID(), title: 'Rose Touch', body: 'Crafted with intention, rooted in African heritage.' }
    ],
    autosaveAt: null,
    media: []
  }
};

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */
const money = (n) => `₦${Number(n || 0).toLocaleString()}`;

function normalizeProduct(p) {
  const parseMaybe = (v, fallback) => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return fallback; }
    }
    return fallback;
  };

  return {
    id: Number(p.id),
    name: p.name,
    tag: p.tag || 'Collection',
    cat: p.category || p.cat || 'general',
    price: Number(p.price || 0),
    oldPrice: p.old_price || p.oldPrice || null,
    badge: p.badge || null,
    emoji: p.emoji || '👗',
    emoji2: p.emoji2 || p.emoji || '✨',
    colors: parseMaybe(p.colors, ['#d85e22','#919a2e']),
    sizes: parseMaybe(p.sizes, ['XS','S','M','L','XL']),
    desc: p.description || p.desc || ''
  };
}

async function fetchProductsFromSupabase() {
  if (!supabase) return null;
  const { data, error } = await supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return null;
  }
  return data.map(normalizeProduct);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgNode = document.getElementById('toastMsg');
  if (!toast || !msgNode) return;
  msgNode.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION + TRANSITIONS
   ══════════════════════════════════════════════════════════ */
function navigate(page) {
  const target = document.getElementById(page);
  if (!target) return;

  document.querySelectorAll('.page').forEach((p) => {
    p.classList.remove('active', 'fade-in');
    p.style.display = 'none';
  });
  document.querySelectorAll('nav a').forEach((a) => a.classList.remove('active-nav'));

  target.style.display = 'block';
  requestAnimationFrame(() => target.classList.add('active', 'fade-in'));
  state.page = page;

  const nav = document.getElementById(`nav-${page}`);
  if (nav) nav.classList.add('active-nav');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'shop') renderShopProducts();
  if (page === 'home') {
    renderHomeProducts();
    renderNewArrivalsCarousel();
  }
  if (page === 'cms') renderCMS();
}
window.navigate = navigate;

/* ══════════════════════════════════════════════════════════
   RENDER: STOREFRONT
   ══════════════════════════════════════════════════════════ */
function productCardHTML(p) {
  const badge = p.badge ? `<div class="product-badge ${p.badge}">${p.badge === 'new' ? 'New' : 'Sale'}</div>` : '';
  const oldPrice = p.oldPrice ? `<span class="product-price-old">${money(p.oldPrice)}</span>` : '';
  const colors = p.colors.map((c) => `<div class="prod-color-dot" style="background:${c}" aria-hidden="true"></div>`).join('');
  const c1 = p.colors[0] || '#f5f0e8';
  const c2 = p.colors[1] || '#ede6d6';

  return `
    <article class="product-card" data-id="${p.id}" data-cat="${p.cat}" data-price="${p.price}" tabindex="0" role="button" aria-label="View ${p.name}"
      onclick="openModal(${p.id})" onmousemove="tiltCard(event,this)" onmouseleave="resetTilt(this)"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openModal(${p.id});}">
      <div class="product-img-wrap" style="background:linear-gradient(135deg,${c1}22,${c2}22)">
        <div class="product-img-1" aria-hidden="true">${p.emoji}</div>
        <div class="product-img-2" aria-hidden="true">${p.emoji2}</div>
        ${badge}
        <div class="product-actions"><button class="quick-add-btn" onclick="event.stopPropagation();openModal(${p.id})">Quick View</button></div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-variant">${p.tag}</div>
        <div class="product-price-row"><span class="product-price">${money(p.price)}</span>${oldPrice}</div>
        <div class="product-colors">${colors}</div>
      </div>
    </article>`;
}

function getFilteredProducts() {
  let arr = [...state.products];
  const f = state.filters;

  if (f.category !== 'all') arr = arr.filter((p) => p.cat === f.category);
  if (f.sizes.size) arr = arr.filter((p) => p.sizes.some((s) => f.sizes.has(s)));
  if (f.colors.size) arr = arr.filter((p) => p.colors.some((c) => f.colors.has(c.toLowerCase())));
  arr = arr.filter((p) => p.price <= f.price);

  if (f.sort === 'price-asc') arr.sort((a,b) => a.price - b.price);
  if (f.sort === 'price-desc') arr.sort((a,b) => b.price - a.price);
  if (f.sort === 'new') arr.sort((a,b) => (b.badge === 'new') - (a.badge === 'new'));

  return arr;
}

function renderHomeProducts() {
  const el = document.getElementById('homeProducts');
  if (!el) return;
  el.innerHTML = state.products.slice(0, 8).map(productCardHTML).join('');
}

function renderNewArrivalsCarousel() {
  const el = document.getElementById('newArrivalsTrack');
  if (!el) return;
  el.innerHTML = state.products.slice(0, 10).map((p) => `
    <div class="arrival-slide">
      <div class="arrival-icon">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>${money(p.price)}</p>
      <button onclick="openModal(${p.id})">Quick Add</button>
    </div>`).join('');
}

function renderShopProducts() {
  const el = document.getElementById('shopProducts');
  const cnt = document.getElementById('filteredCount');
  if (!el) return;

  const filtered = getFilteredProducts();
  if (cnt) cnt.textContent = filtered.length;

  const visible = filtered.slice(0, state.visibleCount);
  el.innerHTML = visible.map(productCardHTML).join('');

  const moreBtn = document.getElementById('loadMoreBtn');
  if (moreBtn) {
    moreBtn.style.display = visible.length < filtered.length ? 'inline-flex' : 'none';
  }
}

/* ══════════════════════════════════════════════════════════
   FILTERS / SORT / PAGINATION
   ══════════════════════════════════════════════════════════ */
function filterCategory(el, cat) {
  document.querySelectorAll('.cat-item').forEach((n) => n.classList.remove('active'));
  if (el) el.classList.add('active');
  state.filters.category = cat;
  state.visibleCount = 12;
  renderShopProducts();
}
window.filterCategory = filterCategory;

function toggleSize(el) {
  const size = el.textContent.trim();
  el.classList.toggle('active');
  if (state.filters.sizes.has(size)) state.filters.sizes.delete(size);
  else state.filters.sizes.add(size);
  state.visibleCount = 12;
  renderShopProducts();
}
window.toggleSize = toggleSize;

function toggleSwatch(el) {
  const color = rgbToHex(getComputedStyle(el).backgroundColor).toLowerCase();
  el.classList.toggle('active');
  if (state.filters.colors.has(color)) state.filters.colors.delete(color);
  else state.filters.colors.add(color);
  state.visibleCount = 12;
  renderShopProducts();
}
window.toggleSwatch = toggleSwatch;

function sortProducts(val) {
  state.filters.sort = val;
  renderShopProducts();
}
window.sortProducts = sortProducts;

function updatePriceFilter(value) {
  state.filters.price = Number(value);
  state.visibleCount = 12;
  const label = document.getElementById('priceVal');
  if (label) label.textContent = money(value);
  renderShopProducts();
}
window.updatePriceFilter = updatePriceFilter;

function loadMoreProducts() {
  state.visibleCount += 12;
  renderShopProducts();
}
window.loadMoreProducts = loadMoreProducts;

function rgbToHex(rgb) {
  const values = rgb.match(/\d+/g);
  if (!values) return rgb;
  return `#${values.slice(0, 3).map((v) => Number(v).toString(16).padStart(2, '0')).join('')}`;
}

/* ══════════════════════════════════════════════════════════
   QUICK VIEW MODAL
   ══════════════════════════════════════════════════════════ */
function openModal(id) {
  const p = state.products.find((x) => Number(x.id) === Number(id));
  if (!p) return;
  state.currentProduct = p;
  state.selectedSize = '';

  const c1 = p.colors[0] || '#f0ead9';
  const c2 = p.colors[1] || '#ede6d6';

  document.getElementById('modalEmoji').textContent = p.emoji;
  document.getElementById('modalImg').style.background = `linear-gradient(135deg,${c1}44,${c2}44)`;
  document.getElementById('modalTag').textContent = p.tag;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalPrice').innerHTML = `${money(p.price)}${p.oldPrice ? ` <span style="font-size:14px;color:var(--text-light);text-decoration:line-through;font-weight:400">${money(p.oldPrice)}</span>` : ''}`;
  document.getElementById('modalDesc').textContent = p.desc;

  const sizeContainer = document.getElementById('modalSizes');
  sizeContainer.innerHTML = p.sizes.map((s) => `<button type="button" class="size-option" onclick="selectSize(this,'${s}')">${s}</button>`).join('');

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openModal = openModal;

function selectSize(el, size) {
  document.querySelectorAll('#modalSizes .size-option').forEach((n) => n.classList.remove('active'));
  el.classList.add('active');
  state.selectedSize = size;
}
window.selectSize = selectSize;

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
window.closeModal = closeModal;

function addToCart() {
  const p = state.currentProduct;
  if (!p) return;
  const size = state.selectedSize || 'M';
  const existing = cart.find((i) => i.id === p.id && i.size === size);
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, name: p.name, price: p.price, size, qty: 1, emoji: p.emoji });
  persistCart();
  updateCartUI();
  closeModal();
  showToast('Added to bag 🌹');
}
window.addToCart = addToCart;

/* ══════════════════════════════════════════════════════════
   CART DRAWER
   ══════════════════════════════════════════════════════════ */
function persistCart() {
  localStorage.setItem('hippoint_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartEl = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('cartSubtotal');
  const footer = document.getElementById('cartFooter');
  const empty = document.getElementById('cartEmpty');
  if (!cartEl || !countEl || !subtotalEl || !footer || !empty) return;

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = String(count);
  countEl.classList.toggle('visible', count > 0);

  if (!cart.length) {
    empty.style.display = 'block';
    footer.style.display = 'none';
    cartEl.querySelectorAll('.cart-item').forEach((n) => n.remove());
    subtotalEl.textContent = money(0);
    return;
  }

  empty.style.display = 'none';
  footer.style.display = 'block';

  cartEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">Size: ${item.size}</div>
        <div class="cart-item-price">${money(item.price)}</div>
      </div>
      <div class="cart-item-qty">
        <button onclick="updateCartQty(${idx},-1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateCartQty(${idx},1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">×</button>
    </div>`).join('');

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  subtotalEl.textContent = money(subtotal);
}

function updateCartQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  persistCart();
  updateCartUI();
}
window.updateCartQty = updateCartQty;

function removeFromCart(idx) {
  cart.splice(idx, 1);
  persistCart();
  updateCartUI();
}
window.removeFromCart = removeFromCart;

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}
window.toggleCart = toggleCart;

async function handleCheckout() {
  if (!cart.length) {
    showToast('Your bag is empty 🛍️');
    return;
  }
  const orderData = {
    customer_name: 'Guest Customer',
    customer_email: 'guest@hippoint.com',
    items: cart,
    total: cart.reduce((sum, i) => sum + (i.qty * i.price), 0)
  };

  if (USE_SUPABASE) {
    const { error } = await supabase.from('orders').insert([{ ...orderData, status: 'pending' }]);
    if (error) {
      showToast('Checkout failed. Try again.');
      return;
    }
  }

  cart = [];
  persistCart();
  updateCartUI();
  toggleCart();
  showToast('Order placed. With care, from Hippoint 🌹');
}
window.handleCheckout = handleCheckout;

/* ══════════════════════════════════════════════════════════
   CMS DEMO SYSTEM
   ══════════════════════════════════════════════════════════ */
function openCMS() {
  navigate('cms');
}
window.openCMS = openCMS;

function cmsLogin(event) {
  event.preventDefault();
  const email = document.getElementById('cmsEmail')?.value.trim();
  const password = document.getElementById('cmsPassword')?.value || '';
  if (!email || password.length < 6) {
    showToast('Use a valid admin email and password (min 6 chars).');
    return;
  }
  state.cms.user = email;
  state.cms.role = email.includes('owner') ? 'Owner' : 'Editor';
  localStorage.setItem('hippoint_cms_user', JSON.stringify({ email: state.cms.user, role: state.cms.role }));
  renderCMS();
}
window.cmsLogin = cmsLogin;

function cmsLogout() {
  state.cms.user = null;
  state.cms.role = null;
  localStorage.removeItem('hippoint_cms_user');
  renderCMS();
}
window.cmsLogout = cmsLogout;

function selectCMSPane(pane) {
  state.cms.selectedPane = pane;
  renderCMS();
}
window.selectCMSPane = selectCMSPane;

function addCMSBlock() {
  state.cms.blocks.push({ id: crypto.randomUUID(), title: 'New Block', body: 'Editable content...' });
  scheduleCMSSave();
  renderCMS();
}
window.addCMSBlock = addCMSBlock;

function updateCMSBlock(id, field, value) {
  const block = state.cms.blocks.find((b) => b.id === id);
  if (!block) return;
  block[field] = value;
  scheduleCMSSave();
}
window.updateCMSBlock = updateCMSBlock;

function removeCMSBlock(id) {
  state.cms.blocks = state.cms.blocks.filter((b) => b.id !== id);
  scheduleCMSSave();
  renderCMS();
}
window.removeCMSBlock = removeCMSBlock;

function scheduleCMSSave() {
  localStorage.setItem('hippoint_cms_blocks', JSON.stringify(state.cms.blocks));
  state.cms.autosaveAt = new Date();
  const stamp = document.getElementById('cmsAutosave');
  if (stamp) stamp.textContent = `Autosaved at ${state.cms.autosaveAt.toLocaleTimeString()}`;
}

function handleMediaUpload(e) {
  const files = Array.from(e.target.files || []);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      state.cms.media.push({ id: crypto.randomUUID(), name: file.name, src: reader.result });
      localStorage.setItem('hippoint_cms_media', JSON.stringify(state.cms.media));
      renderCMS();
    };
    reader.readAsDataURL(file);
  });
}
window.handleMediaUpload = handleMediaUpload;

function renderCMS() {
  const root = document.getElementById('cmsRoot');
  if (!root) return;

  if (!state.cms.user) {
    root.innerHTML = `
      <div class="cms-login-wrap">
        <form class="cms-login-card" onsubmit="cmsLogin(event)">
          <p class="cms-kicker">HIPPOINT CMS</p>
          <h2>Sign in to Dashboard</h2>
          <p>Secure role-based access for content and commerce operations.</p>
          <input id="cmsEmail" type="email" placeholder="admin@hippoint.com" required>
          <input id="cmsPassword" type="password" placeholder="••••••••" minlength="6" required>
          <button type="submit">Login</button>
        </form>
      </div>`;
    return;
  }

  const navItems = [
    ['pages','Pages'],['products','Products'],['media','Media'],['orders','Orders']
  ].map(([key,label]) => `<button class="cms-nav-btn ${state.cms.selectedPane===key?'active':''}" onclick="selectCMSPane('${key}')">${label}</button>`).join('');

  const blocks = state.cms.blocks.map((b) => `
    <div class="cms-block" draggable="true">
      <div class="cms-block-head">
        <strong>⋮⋮ ${b.title}</strong>
        <button onclick="removeCMSBlock('${b.id}')">Delete</button>
      </div>
      <input value="${b.title.replace(/"/g,'&quot;')}" oninput="updateCMSBlock('${b.id}','title',this.value)">
      <textarea oninput="updateCMSBlock('${b.id}','body',this.value)">${b.body}</textarea>
    </div>`).join('');

  const mediaGrid = state.cms.media.map((m) => `<figure class="cms-media-item"><img src="${m.src}" alt="${m.name}"><figcaption>${m.name}</figcaption></figure>`).join('');

  root.innerHTML = `
    <div class="cms-layout">
      <aside class="cms-sidebar">
        <div>
          <h3>HIPPOINT Admin</h3>
          <p>${state.cms.user}<br><small>${state.cms.role}</small></p>
        </div>
        <nav>${navItems}</nav>
        <button class="cms-logout" onclick="cmsLogout()">Logout</button>
      </aside>
      <section class="cms-main">
        <header class="cms-header">
          <div>
            <h2>${state.cms.selectedPane[0].toUpperCase()+state.cms.selectedPane.slice(1)}</h2>
            <p id="cmsAutosave">${state.cms.autosaveAt ? `Autosaved at ${state.cms.autosaveAt.toLocaleTimeString()}` : 'Autosave enabled'}</p>
          </div>
          <button onclick="addCMSBlock()">+ Add Block</button>
        </header>

        <div class="cms-content-grid">
          <div class="cms-builder">
            <h4>Drag-and-Drop Page Builder</h4>
            ${blocks || '<p>No blocks yet</p>'}
          </div>
          <aside class="cms-preview">
            <h4>Live Preview</h4>
            ${state.cms.blocks.map((b) => `<article><h5>${b.title}</h5><p>${b.body}</p></article>`).join('')}
            <div class="cms-upload">
              <label for="cmsUpload">Media Library Upload</label>
              <input id="cmsUpload" type="file" multiple accept="image/*" onchange="handleMediaUpload(event)">
              <div class="cms-media-grid">${mediaGrid || '<p>No uploads yet.</p>'}</div>
            </div>
          </aside>
        </div>
      </section>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   EFFECTS
   ══════════════════════════════════════════════════════════ */
function tiltCard(event, card) {
  const r = card.getBoundingClientRect();
  const x = (event.clientX - r.left) / r.width;
  const y = (event.clientY - r.top) / r.height;
  card.style.transform = `rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-6px)`;
}
window.tiltCard = tiltCard;

function resetTilt(card) {
  card.style.transform = '';
}
window.resetTilt = resetTilt;

function moveCarousel(dir) {
  const track = document.getElementById('newArrivalsTrack');
  if (!track) return;
  track.scrollBy({ left: dir * 320, behavior: 'smooth' });
}
window.moveCarousel = moveCarousel;

function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   NEWSLETTER
   ══════════════════════════════════════════════════════════ */
async function handleNewsletterSignup() {
  const input = document.getElementById('newsletterEmail');
  if (!input || !input.value.trim()) {
    showToast('Enter your email to subscribe 📬');
    return;
  }

  const email = input.value.trim();
  if (USE_SUPABASE) {
    const { error } = await supabase.from('newsletter').insert([{ email }]);
    if (error) {
      showToast('Subscription failed. Try again.');
      return;
    }
  }
  input.value = '';
  showToast('With care, from Hippoint 🌹');
}

/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  const cmsUser = localStorage.getItem('hippoint_cms_user');
  if (cmsUser) {
    try {
      const parsed = JSON.parse(cmsUser);
      state.cms.user = parsed.email;
      state.cms.role = parsed.role;
    } catch {
      localStorage.removeItem('hippoint_cms_user');
    }
  }

  const savedBlocks = localStorage.getItem('hippoint_cms_blocks');
  if (savedBlocks) {
    try { state.cms.blocks = JSON.parse(savedBlocks); } catch { /* noop */ }
  }
  const savedMedia = localStorage.getItem('hippoint_cms_media');
  if (savedMedia) {
    try { state.cms.media = JSON.parse(savedMedia); } catch { /* noop */ }
  }

  if (USE_SUPABASE) {
    const fetched = await fetchProductsFromSupabase();
    if (fetched?.length) state.products = fetched;
  }

  document.getElementById('modalAddBtn')?.addEventListener('click', addToCart);
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.getElementById('cartOverlay')?.addEventListener('click', toggleCart);
  document.getElementById('newsletterBtn')?.addEventListener('click', handleNewsletterSignup);
  document.getElementById('priceSlider')?.addEventListener('input', (e) => updatePriceFilter(e.target.value));

  updateCartUI();
  renderHomeProducts();
  renderNewArrivalsCarousel();
  renderShopProducts();
  renderCMS();
  initRevealObserver();
});
