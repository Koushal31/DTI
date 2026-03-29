// =============================================================
// main.js  –  Loaded on every page.
// Handles: dark/light theme, login state, navbar, progress logging.
// =============================================================

// ------ Theme management ------
function getTheme() {
  // Check saved preference first, then fall back to OS setting
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '🌙';
}

function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// ------ Auth helpers ------
// We store the user object and JWT token in localStorage after login.

function getUser() {
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  window.location.href = 'login.html';
}

// ------ Navbar ------
function buildNav() {
  const user    = getUser();
  const navSlot = document.getElementById('nav-right');
  if (!navSlot) return;

  if (user) {
    // Show avatar with initials + dropdown menu
    const initials = user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const firstName = user.name.split(' ')[0];

    navSlot.innerHTML = `
      <div class="nav-user">
        <div class="nav-avatar-btn" onclick="toggleDropdown()">
          <div class="avatar-circle">${initials}</div>
          <span class="nav-username">${firstName}</span>
          <span style="font-size:10px;color:var(--text-3)">▾</span>
        </div>
        <div class="nav-dropdown" id="nav-dropdown">
          <a href="profile.html">👤 Profile</a>
          <a href="profile.html#progress">📊 My Progress</a>
          <div class="dropdown-divider"></div>
          <button onclick="logout()">🚪 Logout</button>
        </div>
      </div>`;
  } else {
    // Not logged in — show login and signup buttons
    navSlot.innerHTML = `
      <a href="login.html" class="btn btn-sm">Login</a>
      <a href="login.html?tab=signup" class="btn btn-sm btn-primary">Sign up</a>`;
  }
}

function toggleDropdown() {
  document.getElementById('nav-dropdown')?.classList.toggle('open');
}

// Close dropdown when user clicks anywhere outside it
document.addEventListener('click', function(e) {
  const userEl = document.querySelector('.nav-user');
  if (userEl && !userEl.contains(e.target)) {
    document.getElementById('nav-dropdown')?.classList.remove('open');
  }
});

// ------ Active nav link highlighting ------
function markActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    const isCurrentPage = link.getAttribute('href') === currentPage;
    link.classList.toggle('active', isCurrentPage);
  });
}

// ------ Progress logging ------
// Called each time the user runs an algorithm.
// Silently ignored if the backend is offline or user is not logged in.
async function logProgress(algorithmName) {
  const token = getToken();
  if (!token) return; // user not logged in, skip

  try {
    const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';
    await fetch(API_BASE + '/progress/log', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ algorithm: algorithmName })
    });
  } catch (_networkError) {
    // Backend not running — that's fine, just ignore
  }
}

// ------ Related Practice Problems Widget ------
async function loadRelatedProblems() {
  const pageMap = {
    'sorting.html': ['ARRAYS'],
    'searching.html': ['BINARY SEARCH'],
    'trees.html': ['BINARY TREES', 'BST', 'TRIE'],
    'graphs.html': ['GRAPH'],
    'hashing.html': ['STRINGS', 'ARRAYS'],
    'linked-list.html': ['LINKED LIST'],
    'stack.html': ['STACK & QUEUE'],
    'queue.html': ['STACK & QUEUE']
  };
  
  const currentPage = window.location.pathname.split('/').pop();
  const relatedCats = pageMap[currentPage];
  if (!relatedCats) return; // Not a topic page
  
  const rightColumn = document.querySelector('.right');
  if (!rightColumn) return;

  try {
    const res = await fetch('data/problems.json');
    if (!res.ok) return;
    const allProblems = await res.json();
    
    // Filter by topic and grab up to 5
    const related = allProblems.filter(p => relatedCats.includes(p.category)).slice(0, 5);
    if (related.length === 0) return;
    
    const doneProblems = new Set(JSON.parse(localStorage.getItem('dsa_done_problems') || '[]'));
    
    const widget = document.createElement('div');
    widget.className = 'card mt-16';
    widget.innerHTML = `
      <div class="card-header">
        <span class="card-title">Practice ${relatedCats.join(', ')}</span>
        <a href="practice.html" class="badge">View all →</a>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; padding:12px 14px;">
        ${related.map(p => {
          const isDone = doneProblems.has(p.id);
          let diffColor = 'var(--orange)';
          const pDiffLC = p.difficulty.toLowerCase();
          if(pDiffLC.includes('easy')) diffColor = 'var(--green)';
          if(pDiffLC.includes('hard') && !pDiffLC.includes('medium')) diffColor = 'var(--red)';
          
          const safeLink = p.link ? p.link.replace(/&amp;/g, '&') : '#';
          
          return `
            <div style="font-size:13px; display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
              <div style="opacity: ${isDone ? 0.5 : 1}; text-decoration: ${isDone ? 'line-through' : 'none'}">
                <a href="${safeLink}" target="_blank" style="color:var(--text); font-weight:500">${p.title}</a>
              </div>
              <span style="font-size:10px; font-family:var(--mono); color:${diffColor}">${p.difficulty}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    rightColumn.appendChild(widget);
  } catch (e) {
    console.error("Failed to load related problems", e);
  }
}

// ------ Page initialisation ------
document.addEventListener('DOMContentLoaded', function() {
  applyTheme(getTheme());
  buildNav();
  markActiveLink();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  
  loadRelatedProblems();
});