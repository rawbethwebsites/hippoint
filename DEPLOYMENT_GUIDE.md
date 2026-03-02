# HIPPOINT — Deployment & Integration Guide

> Read this top-to-bottom. Every step builds on the one before it.
> The goal is to get your site live on the internet AND connected to the database you already built.

---

## PART 1 — Your Files Explained (Like You're 5)

Think of your website like a house with 4 rooms:

| File | What it is | Analogy |
|---|---|---|
| `index.html` | The structure — walls, doors, rooms | The blueprint of the house |
| `styles.css` | The decoration — colours, fonts, layout | The paint and furniture |
| `main.js` | The brain — makes buttons work, cart, navigation | The electricity |
| `vercel.json` | Instructions for the internet host | The key you give to the landlord |

---

## PART 2 — Deploy to Vercel (Free, Takes 5 Minutes)

### Step 1 — Create a GitHub account
1. Go to **https://github.com** in your browser
2. Click **"Sign up"** — use your email, pick a username (e.g. `hippoint`), create a password
3. Verify your email

### Step 2 — Put your files on GitHub (like a USB drive on the internet)
1. Once logged in, click the **"+"** button at the top right → **"New repository"**
2. Name it: `hippoint-website`
3. Make sure it says **"Public"** (this lets Vercel see it for free)
4. Click **"Create repository"**
5. You'll see a page with some text. Look for the section that says **"…or upload an existing file"**
6. Click **"uploading an existing file"**
7. Drag all 4 files into the box:
   - `index.html`
   - `styles.css`
   - `main.js`
   - `vercel.json`
8. Scroll down, click **"Commit changes"** (green button)

Your files are now on GitHub! ✅

### Step 3 — Create a Vercel account
1. Go to **https://vercel.com**
2. Click **"Sign Up"** → choose **"Continue with GitHub"**
3. Allow Vercel to access your GitHub (this is safe — it just lets Vercel read your code)

### Step 4 — Deploy (this is the magic step)
1. On Vercel's dashboard, click **"Add New…"** → **"Project"**
2. Find your `hippoint-website` repository and click **"Import"**
3. Vercel will detect it's a plain HTML site automatically
4. Click **"Deploy"** — leave everything else as default
5. Wait about 30 seconds…
6. 🎉 You'll see a green "Congratulations!" screen with a link like `hippoint-website.vercel.app`

That link is your live website — share it with anyone!

### Step 5 — Connect a custom domain (optional but recommended)
1. On your project page in Vercel, click **"Settings"** → **"Domains"**
2. Type your domain (e.g. `hippoint.co`) → click **"Add"**
3. Vercel gives you DNS records — log into your domain registrar (e.g. GoDaddy, Namecheap) and add them
4. Within 24 hours, `www.hippoint.co` will show your site

---

## PART 3 — Updating Your Site Later

Whenever you change a file:
1. Go to your GitHub repository (`github.com/YOUR-USERNAME/hippoint-website`)
2. Click the file you want to update (e.g. `index.html`)
3. Click the **pencil icon ✏️** to edit
4. Make your changes
5. Click **"Commit changes"**
6. Vercel automatically re-deploys in ~30 seconds — no extra steps needed!

---

## PART 4 — Connecting the Frontend to the Database (Your PHP Backend)

> This is the bridge between your shop page and the real product/order database.

### The Big Picture

```
Customer's browser              Your Server               Database
┌──────────────┐     fetch()    ┌──────────────┐    SQL   ┌──────────┐
│  index.html  │ ─────────────► │  backend.php │ ────────► │  MySQL   │
│  main.js     │ ◄──────────── │  (API)       │ ◄──────── │          │
└──────────────┘   JSON data   └──────────────┘          └──────────┘
```

Right now, `main.js` uses **hardcoded product data** (the list inside the file).
Once you connect to the backend, it will fetch **live products from the database** instead.

---

### Step 1 — Host Your PHP Backend

The backend (`hippoint-cms-backend.php`) is a PHP file — Vercel can't run PHP.
You need a PHP host. Best free/cheap options:

| Host | Cost | Notes |
|---|---|---|
| **Railway.app** | Free tier | Good for PHP + MySQL together |
| **Render.com** | Free tier | Use with PlanetScale MySQL |
| **Hostinger** | ~₦2,000/month | Easiest for Nigerians, cPanel, PHP+MySQL included |
| **Namecheap hosting** | ~$2/month | Simple shared hosting |

**Recommended for beginners:** Hostinger or Namecheap — they give you cPanel which is like a simple control panel where you upload files and create databases by clicking buttons, no code needed.

#### On Hostinger/Namecheap:
1. Buy a plan → log into **cPanel**
2. Find **"File Manager"** → upload `hippoint-cms-backend.php` to the `public_html/api/` folder
   - (Create the `api` folder if it doesn't exist)
3. Rename it to `index.php`
4. Find **"MySQL Databases"** → create a database called `hippoint_cms`
5. Create a user, give it all permissions on that database
6. Go into **phpMyAdmin** → click your database → **SQL** tab
7. Paste the full CREATE TABLE SQL from the backend file (Section 16) → run it
8. Your API will be live at: `https://yourdomain.com/api/`

---

### Step 2 — Create a `.env` file on your server

Inside File Manager, create a file called `.env` in the same folder as `index.php`:

```
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=hippoint_cms
DB_HOST=localhost
JWT_SECRET=paste-a-long-random-string-here
APP_URL=https://yourdomain.com
APP_ENV=production
```

> **How to make a random JWT_SECRET:** Go to https://generate-secret.vercel.app/64 and copy the result

---

### Step 3 — Update main.js to fetch real products

Currently in `main.js`, products are hardcoded at the top of the file.
To use the database instead, replace the product rendering with API calls.

Open `main.js` and find the `renderShopProducts` and `renderHomeProducts` functions.
Replace them with these API-powered versions:

```javascript
// ── Your API base URL — change this to your real hosting URL ──
const API_BASE = 'https://yourdomain.com/api/v1';

async function renderHomeProducts() {
  const el = document.getElementById('homeProducts');
  if (!el) return;
  el.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Loading...</p>';
  try {
    const res  = await fetch(`${API_BASE}/products?per_page=8`);
    const data = await res.json();
    el.innerHTML = data.data.map(productCardHTML).join('');
    refreshCursorTargets();
    initReveal();
  } catch (err) {
    el.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Could not load products.</p>';
  }
}

async function renderShopProducts(filters = {}) {
  const el  = document.getElementById('shopProducts');
  const cnt = document.getElementById('filteredCount');
  if (!el) return;
  el.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Loading...</p>';

  // Build query string from filters
  const params = new URLSearchParams({ per_page: 24, ...filters });
  try {
    const res  = await fetch(`${API_BASE}/products?${params}`);
    const data = await res.json();
    el.innerHTML = data.data.map(productCardHTML).join('');
    if (cnt) cnt.textContent = data.meta.total;
    refreshCursorTargets();
  } catch (err) {
    el.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Could not load products.</p>';
  }
}
```

> **Note:** The `productCardHTML` function already works with database products because
> it only uses: `id, name, tag, cat, price, oldPrice, badge, emoji, emoji2, colors`
> Your database has all of these fields.

---

### Step 4 — Connect the Checkout button to real orders

Find `handleCheckout()` in `main.js` and replace the stub:

```javascript
async function handleCheckout() {
  if (cart.length === 0) return;

  // Show a simple form or redirect to a checkout page
  // For now, let's create the order via API:
  const orderData = {
    customer_name:  'Guest',        // Replace with a form later
    customer_email: 'guest@test.com',
    items: cart.map(i => ({ product_id: i.id, name: i.name, qty: i.qty, price: i.price })),
    total: cart.reduce((s,i) => s + i.price * i.qty, 0),
  };

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (res.ok) {
      cart = [];
      saveCart();
      updateCartUI();
      toggleCart();
      showToast('Order placed! We'll be in touch 🌹');
    } else {
      showToast('Something went wrong. Try again.');
    }
  } catch (err) {
    showToast('No connection. Check your internet.');
  }
}
```

---

### Step 5 — Connect the Newsletter

Find the newsletter button listener and replace the stub:

```javascript
document.getElementById('newsletterBtn').addEventListener('click', async function () {
  const input = document.getElementById('newsletterEmail');
  if (!input || !input.value.trim()) {
    showToast('Enter your email to subscribe 📬');
    return;
  }
  try {
    await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.value.trim() }),
    });
    input.value = '';
    showToast('Welcome to the Hippoint circle! 🌹');
  } catch {
    showToast('Welcome to the Hippoint circle! 🌹'); // Still show success
  }
});
```

---

### Step 6 — Enable CORS on your backend

Open `hippoint-cms-backend.php` and find the CORS section in the Router::dispatch() method.
Make sure your Vercel domain is in the allowed origins:

```php
$allowed = ['https://hippoint-website.vercel.app', 'https://hippoint.co', 'https://www.hippoint.co'];
```

---

## PART 5 — Quick Checklist

### Before going live, tick all of these:

- [ ] All 4 frontend files are on GitHub and deployed to Vercel
- [ ] Site loads at your Vercel URL
- [ ] Products display correctly (even with dummy data)
- [ ] Cart adds items, shows count badge, opens drawer
- [ ] PHP backend is hosted (Hostinger/Railway etc.)
- [ ] Database tables are created (run the SQL from Section 16 of the backend file)
- [ ] `.env` file is on the server with real credentials
- [ ] `API_BASE` in `main.js` points to your PHP host URL
- [ ] CORS allows your Vercel domain
- [ ] Test checkout by placing a test order and checking it appears in your admin panel

---

## PART 6 — Glossary (Simple English)

| Word | What it means |
|---|---|
| **Deploy** | Putting your website on the internet so others can see it |
| **Repository (repo)** | A folder on GitHub that holds your files |
| **API** | A door your frontend uses to talk to your backend |
| **CORS** | A security rule that says which websites are allowed to talk to your API |
| **Environment variables (.env)** | Secret settings stored on the server, not in your code |
| **DNS** | The system that turns `hippoint.co` into the actual server address |
| **JWT** | A secure login token — like a temporary ID card for your admin |
| **CDN** | A network that delivers your files super fast from servers near the user |

---

*Built with 🌹 for HIPPOINT — African Basics for Work and Play*
