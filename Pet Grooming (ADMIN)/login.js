const $ = (s) => document.querySelector(s);

// --- Helpers ---
function getAdmins() {
  return JSON.parse(localStorage.getItem('pg_admins') || '[]');
}

function saveAdmins(admins) {
  localStorage.setItem('pg_admins', JSON.stringify(admins));
}

// --- Default Admin Account ---
if (getAdmins().length === 0) {
  saveAdmins([{
    id: 'a_001',
    name: 'Super Admin',
    email: 'admin@petmalu.com',
    password: 'admin123',
    role: 'admin'
  }]);
}

// --- Login Logic ---
function loginAdmin(email, password) {
  const admins = getAdmins();
  const found = admins.find(
    a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );

  if (!found) return { ok: false, msg: 'Invalid admin credentials.' };

  localStorage.setItem('pg_current_admin', JSON.stringify({
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role
  }));

  return { ok: true, admin: found };
}

// --- DOM Loaded ---
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = $('#admin-login-form');

  // ✅ Only run login form script if on login.html
  if (loginForm) {
    // If already logged in → redirect to index.html
    if (localStorage.getItem('pg_current_admin')) {
      window.location.href = 'index.html';
      return;
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#admin-email').value.trim();
      const pass = $('#admin-password').value;
      if (!email || !pass) return alert('Please fill all fields.');

      const r = loginAdmin(email, pass);
      if (!r.ok) return alert(r.msg);

      alert(`Welcome, ${r.admin.name}!`);
      window.location.href = 'index.html'; // ✅ Redirect to dashboard
    });

    // --- Password Toggle ---
    const togglePwd = $('#toggle-admin-password');
    const pwdInput = $('#admin-password');
    if (togglePwd && pwdInput) {
      togglePwd.addEventListener('click', () => {
        const isHidden = pwdInput.type === 'password';
        pwdInput.type = isHidden ? 'text' : 'password';
        togglePwd.innerHTML = isHidden
          ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
               <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0114.12 14.12M6.742 6.742C4.892 8.295 3.74 10.09 3.458 12c1.274 4.057 5.064 7 10.542 7 1.174 0 2.302-.145 3.37-.417M9.88 9.88l4.24 4.24" />
             </svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
               <path stroke-linecap="round" stroke-linejoin="round" d="M1.458 12C2.732 7.943 6.523 5 12 5c5.478 0 9.268 2.943 10.542 7-1.274 4.057-5.064 7-10.542 7-5.477 0-9.268-2.943-10.542-7z" />
               <circle cx="12" cy="12" r="3" />
             </svg>`;
      });
    }
  }

  // ✅ If on index.html → block access if not logged in
  if (window.location.pathname.includes('index.html')) {
    const currentAdmin = JSON.parse(localStorage.getItem('pg_current_admin') || 'null');
    if (!currentAdmin) {
      alert('Please log in first!');
      window.location.href = 'login.html';
    }
  }
});

// --- Logout Function ---
function logout() {
  localStorage.removeItem('pg_current_admin');
  alert('Logged out successfully!');
  window.location.href = 'login.html';
}
