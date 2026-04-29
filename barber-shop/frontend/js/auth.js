/**
 * Auth Module — Handles login, registration, session, and UI state.
 */

function showAuthModal(formType) {
  const modal = document.getElementById('authModal');
  modal.classList.add('active');
  switchAuthForm(formType);
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function switchAuthForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (formType === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    closeAuthModal();
    updateAuthUI();
    showToast('Login successful!', 'success');
    onAuthStateChange();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;

  try {
    const data = await API.post('/auth/register', { name, email, phone, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    closeAuthModal();
    updateAuthUI();
    showToast('Account created successfully!', 'success');
    onAuthStateChange();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthUI();
  showToast('Logged out', 'info');
  onAuthStateChange();
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function updateAuthUI() {
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');

  if (isLoggedIn()) {
    const user = getCurrentUser();
    authButtons.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userName.textContent = user.name;
  } else {
    authButtons.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

function onAuthStateChange() {
  updateBookingUI();
  updateLoyaltyUI();
}
