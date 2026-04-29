/**
 * App Module — Entry point, initializes all modules and shared UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  initBooking();
  initLoyalty();
  loadServices();
  loadOffers();
  setupMobileMenu();
  setupNavbarScroll();
});

// ---- Services ----
const SERVICES = [
  { name: 'Haircut', price: 25, icon: 'fas fa-cut', desc: 'Classic or modern cuts tailored to your style.' },
  { name: 'Classic Shave', price: 20, icon: 'fas fa-razor', desc: 'Hot towel shave with premium products.' },
  { name: 'Beard Trim', price: 15, icon: 'fas fa-user', desc: 'Shape and maintain your beard perfectly.' },
  { name: 'Hair Color', price: 45, icon: 'fas fa-palette', desc: 'Professional coloring with top-grade dyes.' },
  { name: 'Combo Package', price: 40, icon: 'fas fa-crown', desc: 'Haircut + shave for the complete look.' },
  { name: 'Premium Package', price: 65, icon: 'fas fa-star', desc: 'Full service: cut, shave, facial, and styling.' },
];

function loadServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map(
    (s) => `
    <div class="service-card">
      <div class="icon"><i class="${s.icon}"></i></div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="price">$${s.price}</div>
    </div>
  `
  ).join('');
}

// ---- Offers ----
async function loadOffers() {
  const grid = document.getElementById('offersGrid');
  if (!grid) return;

  try {
    const data = await API.get('/offers');
    if (data.offers && data.offers.length > 0) {
      grid.innerHTML = data.offers
        .map(
          (o) => `
        <div class="offer-card">
          <h3>${o.title}</h3>
          <p>${o.description}</p>
          <div class="discount">${o.discountType === 'percentage' ? o.discountValue + '%' : '$' + o.discountValue} OFF</div>
          ${o.code ? `<span class="code">${o.code}</span>` : ''}
        </div>
      `
        )
        .join('');
    } else {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-soft);grid-column:1/-1;">No active offers right now. Check back soon!</p>';
    }
  } catch {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-soft);grid-column:1/-1;">No active offers right now. Check back soon!</p>';
  }
}

// ---- Mobile Menu ----
function setupMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('active'));
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('active'))
    );
  }
}

// ---- Sticky Navbar ----
function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.15)' : 'var(--shadow)';
  });
}

// ---- Toast Helper ----
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
