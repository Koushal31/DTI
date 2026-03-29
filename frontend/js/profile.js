// =============================================================
// profile.js  –  User profile, heatmap, progress tracking
// =============================================================

// ------ Badge definitions ------
const BADGE_LIST = [
  { id: 'first_run',  icon: '🚀', name: 'First Run',    desc: 'Ran your first algorithm' },
  { id: 'curious',    icon: '🔍', name: 'Curious',       desc: 'Reached 10 total runs' },
  { id: 'dedicated',  icon: '⚡', name: 'Dedicated',     desc: 'Reached 50 total runs' },
  { id: 'century',    icon: '💯', name: 'Century',       desc: 'Reached 100 total runs' },
  { id: 'explorer',   icon: '🗺️', name: 'Explorer',      desc: 'Tried 3 or more algorithms' },
  { id: 'allsorts',   icon: '🏆', name: 'Sort Master',   desc: 'Used all 5 sorting algorithms' },
  { id: 'streak3',    icon: '🔥', name: '3-Day Streak',  desc: 'Active 3 days in a row' },
  { id: 'streak7',    icon: '💎', name: 'Week Warrior',  desc: 'Active 7 days in a row' },
  { id: 'streak30',   icon: '👑', name: 'Month Master',  desc: 'Active 30 days in a row' },
  { id: 'solver_1',   icon: '🎯', name: 'First Blood',   desc: 'Solved your first practice problem' },
  { id: 'solver_10',  icon: '🧠', name: 'Grinder',       desc: 'Solved 10 practice problems' },
  { id: 'solver_50',  icon: '🦾', name: 'Problem Solver',desc: 'Solved 50 practice problems' },
];

// Floating tooltip div — created once, reused for all heatmap cells
const hmTooltip = document.createElement('div');
hmTooltip.id = 'hm-tooltip';
document.body.appendChild(hmTooltip);

// ------ Entry point ------
async function loadProfile() {
  const user  = getUser();
  const token = getToken();
  const page  = document.getElementById('profile-page');

  // Not logged in — show sign-in prompt
  if (!user || !token) {
    page.innerHTML = `
      <div class="login-prompt">
        <div style="font-size:40px;margin-bottom:16px">🔐</div>
        <h2>Sign in to track your progress</h2>
        <p>Create a free account to see your heatmap, streaks, badges and full history.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a href="login.html" class="btn btn-primary btn-lg">Login</a>
          <a href="login.html?tab=signup" class="btn btn-lg">Sign up free</a>
        </div>
      </div>`;
    return;
  }
  
  // Fetch local practice data
  let allProblems = [];
  try {
    const pRes = await fetch('data/problems.json');
    if (pRes.ok) allProblems = await pRes.json();
  } catch (e) { console.warn("Could not load problems.json", e); }
  const doneProblems = new Set(JSON.parse(localStorage.getItem('dsa_done_problems') || '[]'));

  // Fetch real data
  try {
    // Determine API path so that local file:// execution still works
    const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';
    const res  = await fetch(API_BASE + '/progress/profile', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    renderProfile(data, allProblems, doneProblems);
  } catch (err) {
    page.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <div style="font-size:40px;margin-bottom:16px">🔌</div>
        <h2 style="color:var(--red)">Connection Error</h2>
        <p style="color:var(--text-2); max-width: 400px; margin: 0 auto;">
          We couldn't connect to the backend server to load your progress. Please make sure the backend is running.
        </p>
        <div style="margin-top: 20px; font-family: var(--mono); font-size: 11px; color: var(--text-3);">
          Error: ${err.message}
        </div>
      </div>
    `;
  }
}

// ------ Render the full profile page ------
function renderProfile(data, allProblems, doneProblems) {
  const { user, stats, progress, heatmap, badges, recentActivity, activeDays } = data;
  const page = document.getElementById('profile-page');
  
  // Inject practice badges
  if (doneProblems.size >= 1) badges.push({ id: 'solver_1', icon: '🎯', name: 'First Blood', desc: 'Solved your first practice problem' });
  if (doneProblems.size >= 10) badges.push({ id: 'solver_10', icon: '🧠', name: 'Grinder', desc: 'Solved 10 practice problems' });
  if (doneProblems.size >= 50) badges.push({ id: 'solver_50', icon: '🦾', name: 'Problem Solver', desc: 'Solved 50 practice problems' });

  // Avatar initials (first letter of each word in name)
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const since    = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Count days where at least one run happened
  const activeDayCount = Object.keys(heatmap).length;

  page.innerHTML = `
    <!-- ── Profile header ── -->
    <div class="profile-header-card fade-in">
      <div class="profile-avatar">${initials}</div>
      <div class="profile-info">
        <div class="profile-name">${user.name}</div>
        <div class="profile-email">${user.email}</div>
        <div class="profile-since">Member since ${since}</div>
      </div>
      <div class="profile-stat-row">
        <div class="pstat">
          <div class="pstat-num">${stats.totalRuns}</div>
          <div class="pstat-lbl">Vis Runs</div>
        </div>
        <div class="pstat">
          <div class="pstat-num">${doneProblems.size} / ${allProblems.length || 185}</div>
          <div class="pstat-lbl">DSA Done</div>
        </div>
        <div class="pstat">
          <div class="pstat-num">${activeDayCount}</div>
          <div class="pstat-lbl">Active Days</div>
        </div>
        <div class="pstat">
          <div class="pstat-num">${user.streak}</div>
          <div class="pstat-lbl">🔥 Streak</div>
        </div>
      </div>
    </div>

    <!-- ── 1-year heatmap ── -->
    <div class="profile-section" id="progress">
      <div class="section-header">
        <span class="section-title">Activity — Last 12 Months</span>
        <span class="badge badge-green">${activeDayCount} active days</span>
      </div>
      <div class="heatmap-wrap" id="heatmap-wrap"></div>
    </div>
    
    <!-- ── DSA Practice Stats ── -->
    <div class="profile-section" id="dsa-practice-section" style="${allProblems.length ? '' : 'display:none;'}">
      <div class="section-header">
        <span class="section-title">DSA Practice Progress</span>
        <a href="practice.html" class="badge badge-blue">Continue Practice →</a>
      </div>
      <div class="progress-list" id="dsa-progress-list"></div>
    </div>

    

    <!-- ── Per-algorithm run counts ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Algorithm Runs</span>
        <span class="badge">${progress.length} algorithms</span>
      </div>
      <div class="progress-list" id="progress-list"></div>
    </div>

    <!-- ── Recent activity timeline ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Recent Activity</span>
      </div>
      <div class="timeline" id="timeline"></div>
    </div>

    <!-- ── Badges ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Badges</span>
        <span class="badge badge-blue">${badges.length} / ${BADGE_LIST.length} earned</span>
      </div>
      <div class="badges-grid" id="badges-grid"></div>
    </div>
    
    <!-- ── Account Settings ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Account Settings</span>
      </div>
      
      <!-- Preferences -->
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; margin-bottom: 16px;">
        <h3 style="margin:0 0 16px 0; font-size:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">Preferences</h3>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:600;">Theme Preference</h4>
            <div style="font-size:12px; color:var(--text-3)">Switch between light and dark backgrounds.</div>
          </div>
          <button class="btn btn-sm" onclick="toggleTheme()">Toggle Theme</button>
        </div>
      </div>

      <!-- Change Password -->
      <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; margin-bottom: 16px;">
        <h3 style="margin:0 0 16px 0; font-size:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">Security</h3>
        <div style="max-width: 400px;">
          <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:600;">Change Password</h4>
          <input type="password" id="cur-pwd" class="form-input" style="margin-bottom:12px;" placeholder="Current Password">
          <input type="password" id="new-pwd" class="form-input" style="margin-bottom:12px;" placeholder="New Password (min 6 chars)">
          <div style="display:flex; align-items:center; gap:12px;">
            <button class="btn btn-sm" id="btn-save-pwd" onclick="submitChangePwd(this)">Update Password</button>
            <span id="pwd-msg" style="font-size:12px; font-weight:500;"></span>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div style="background:var(--surface); border:1px solid var(--red-light); border-radius:var(--radius-lg); padding:20px;">
        <h3 style="margin:0 0 16px 0; font-size:16px; color:var(--red); border-bottom:1px solid var(--red-light); padding-bottom:8px;">Danger Zone</h3>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:600; color:var(--text)">Log Out</h4>
            <div style="font-size:12px; color:var(--text-3)">Sign out of your account on this device.</div>
          </div>
          <button class="btn btn-sm" style="border-color:var(--border); color:var(--text)" onclick="logout()">Logout</button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:600; color:var(--red)">Reset DSA Practice</h4>
            <div style="font-size:12px; color:var(--text-3)">Permanently erases your local "Mark as Done" progress.</div>
          </div>
          <button class="btn btn-sm" style="background:var(--red-light); color:var(--red); border-color:var(--red)" onclick="resetDsaProgress()">Reset Data</button>
        </div>
      </div>
    </div>
  `;

  // Populate each section
  drawHeatmap(heatmap);
  drawProgressBars(progress);
  drawTimeline(recentActivity || []);
  drawBadges(badges);
  if (allProblems.length > 0) drawPracticeStats(allProblems, doneProblems);
}

// =============================================================
// HEATMAP  –  LeetCode / GitHub contribution graph style
// =============================================================
function drawHeatmap(heatmap) {
  const container = document.getElementById('heatmap-wrap');
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const todayLocal = new Date();
  todayLocal.setHours(0, 0, 0, 0);
  const todayKey = dateKey(todayLocal);

  const CELL = 11;
  const GAP  = 3;
  let totalRuns = 0;

  // We want to show the last 12 months, ending in the current month.
  const monthsData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(todayLocal.getFullYear(), todayLocal.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    // 0 = Sunday, 1 = Monday, etc.
    const firstDayOfWeek = new Date(y, m, 1).getDay(); 

    const monthCells = [];
    
    // Add empty padding so the 1st falls on correct weekday row
    for (let pad = 0; pad < firstDayOfWeek; pad++) {
      monthCells.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(y, m, day);
      const key = dateKey(cellDate);
      const isFuture = cellDate > todayLocal;
      const isToday = key === todayKey;
      const runCount = (!isFuture && heatmap[key]) ? heatmap[key] : 0;
      totalRuns += runCount;
      monthCells.push({ key, runCount, isFuture, isToday, date: cellDate });
    }
    monthsData.push({ monthName: MONTH_NAMES[m], cells: monthCells });
  }

  // Build HTML
  let monthsHtml = '';
  monthsData.forEach((mData) => {
    let gridHtml = '';
    mData.cells.forEach(cell => {
      if (cell === null) {
        gridHtml += `<div style="width:${CELL}px; height:${CELL}px; pointer-events:none; border-radius:3px;"></div>`;
      } else if (cell.isFuture) {
        gridHtml += `<div style="width:${CELL}px; height:${CELL}px; pointer-events:none;"></div>`;
      } else {
        let level = 0;
        if      (cell.runCount >= 8) level = 4;
        else if (cell.runCount >= 5) level = 3;
        else if (cell.runCount >= 2) level = 2;
        else if (cell.runCount > 0)  level = 1;

        const classes = ['hm-cell', level > 0 ? 'l'+level : '', cell.isToday ? 'is-today' : ''].filter(Boolean).join(' ');
        
        const displayDate = cell.date.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
        const tipText = (cell.runCount === 0 ? `No activity on ${displayDate}` : `${cell.runCount} run${cell.runCount > 1 ? 's' : ''} on ${displayDate}`);
        gridHtml += `<div class="${classes}" data-tip="${tipText}" style="width:${CELL}px; height:${CELL}px; border-radius:3px;"></div>`;
      }
    });

    monthsHtml += `
      <div style="display:flex; flex-direction:column; gap:4px;">
        <span style="font-size:12px; height:16px; color:var(--text-3); font-weight:500; display:flex; align-items:flex-end; justify-content:center; padding-left:2px;">${mData.monthName}</span>
        <div style="display:grid; grid-template-rows:repeat(7, ${CELL}px); grid-auto-flow:column; gap:${GAP}px;">
          ${gridHtml}
        </div>
      </div>
    `;
  });

  const rowHeight = CELL;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:8px;">
      
      <!-- Graph Wrapper -->
      <div style="display:flex; gap:8px; overflow-x:auto; padding:16px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); align-items:flex-end;">
        
        <!-- Day Labels -->
        <div style="display:flex; flex-direction:column; gap:4px;">
          <span style="height:16px; display:block;"></span> <!-- exact height match for month string -->
          <div style="display:flex; flex-direction:column; gap:${GAP}px; text-align:right;">
            <div style="height:${rowHeight}px; font-size:10px; color:var(--text-3); line-height:${rowHeight}px; font-weight:500; font-family:var(--font);"></div>
            <div style="height:${rowHeight}px; font-size:10px; color:var(--text-3); line-height:${rowHeight}px; font-weight:500; font-family:var(--font);">Mon</div>
            <div style="height:${rowHeight}px; font-size:10px; color:var(--text-3); line-height:${rowHeight}px; font-weight:500; font-family:var(--font);"></div>
            <div style="height:${rowHeight}px; font-size:10px; color:var(--text-3); line-height:${rowHeight}px; font-weight:500; font-family:var(--font);">Wed</div>
            <div style="height:${rowHeight}px; font-size:10px; color:var(--text-3); line-height:${rowHeight}px; font-weight:500; font-family:var(--font);"></div>
            <div style="height:${rowHeight}px; font-size:10px; color:var(--text-3); line-height:${rowHeight}px; font-weight:500; font-family:var(--font);">Fri</div>
            <div style="height:${rowHeight}px; font-size:10px; color:var(--text-3); line-height:${rowHeight}px; font-weight:500; font-family:var(--font);"></div>
          </div>
        </div>
        
        <!-- Months Grids Container -->
        <div style="display:flex; gap:8px;">
          ${monthsHtml}
        </div>

      </div>
      
      <!-- Footer Area -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; font-size:12px; color:var(--text-2); padding: 0 4px;">
        <div style="font-weight:500; color:var(--text-2);">
          ${totalRuns} algorithm runs in the past year
        </div>
        
        <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:var(--text-3);">
          <span style="margin-right:2px">Less</span>
          <div style="width:${CELL}px; height:${CELL}px; border-radius:3px; background:var(--hm-0)"></div>
          <div style="width:${CELL}px; height:${CELL}px; border-radius:3px; background:var(--hm-1)"></div>
          <div style="width:${CELL}px; height:${CELL}px; border-radius:3px; background:var(--hm-2)"></div>
          <div style="width:${CELL}px; height:${CELL}px; border-radius:3px; background:var(--hm-3)"></div>
          <div style="width:${CELL}px; height:${CELL}px; border-radius:3px; background:var(--hm-4)"></div>
          <span style="margin-left:2px">More</span>
        </div>
      </div>
      
    </div>
  `;

  // Tooltip wiring
  container.querySelectorAll('.hm-cell[data-tip]').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      const tip = cell.dataset.tip;
      if (!tip) return;
      hmTooltip.textContent = tip;
      hmTooltip.classList.add('show');
    });
    cell.addEventListener('mousemove', e => {
      hmTooltip.style.left = (e.clientX + 14) + 'px';
      hmTooltip.style.top  = (e.clientY - 36) + 'px';
    });
    cell.addEventListener('mouseleave', () => {
      hmTooltip.classList.remove('show');
    });
  });
}


// =============================================================
// 30-DAY CALENDAR
// =============================================================
function drawCalendar(activeDays) {
  const el         = document.getElementById('cal-grid');
  const todayLocal = new Date();
  todayLocal.setHours(0, 0, 0, 0);
  const activeSet  = new Set(activeDays); // set of "days ago" values (0 = today)
  let html = '';

  // Render oldest day first (i = 29 means 29 days ago)
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const d = new Date(todayLocal);
    d.setDate(d.getDate() - daysAgo);

    let cls = 'cal-day';
    if (activeSet.has(daysAgo))   cls += ' was-active';
    else if (daysAgo === 0)        cls += ' is-today';

    const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    html += `<div class="${cls}" title="${fullDate}">${d.getDate()}</div>`;
  }
  el.innerHTML = html;
}

// =============================================================
// ALGORITHM PROGRESS BARS
// =============================================================
function drawProgressBars(progress) {
  const el = document.getElementById('progress-list');

  if (!progress.length) {
    el.innerHTML = '<p style="padding:18px;text-align:center;font-size:13px;color:var(--text-3)">No runs yet — open any algorithm page and hit Run!</p>';
    return;
  }

  const maxRuns = Math.max(...progress.map(p => p.runCount), 1);

  el.innerHTML = progress.map(item => {
    const barPct = Math.round((item.runCount / maxRuns) * 100);
    const name   = item.algorithm
      .replace(/-/g, ' ')
      .replace(/\b\w/g, ch => ch.toUpperCase());

    return `
      <div class="progress-item">
        <div style="min-width:150px">
          <div class="progress-name">${name}</div>
          <div class="progress-sub">${item.runCount} run${item.runCount !== 1 ? 's' : ''}</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${barPct}%"></div>
        </div>
        <div class="progress-date">${friendlyDate(item.lastRun)}</div>
      </div>`;
  }).join('');
}

// =============================================================
// DSA PRACTICE PROGRESS BARS
// =============================================================
function drawPracticeStats(allProblems, doneProblems) {
  const el = document.getElementById('dsa-progress-list');
  
  // Group by category
  const categories = {};
  allProblems.forEach(p => {
    if(!categories[p.category]) categories[p.category] = { total: 0, done: 0 };
    categories[p.category].total++;
    if(doneProblems.has(p.id)) {
      categories[p.category].done++;
    }
  });
  
  // Sort categories by most progress (ratio)
  const catArr = Object.entries(categories).map(([name, stats]) => ({
    name, 
    ...stats, 
    pct: Math.round((stats.done / stats.total) * 100)
  })).sort((a,b) => b.pct - a.pct); // Highest percent first
  
  el.innerHTML = catArr.map(cat => {
    // Only show categories where they have made at least some progress, or show all? 
    // Let's just show top 6 categories or all if less. Or all of them.
    return `
      <div class="progress-item">
        <div style="min-width:150px">
          <div class="progress-name">${cat.name}</div>
          <div class="progress-sub">${cat.done} / ${cat.total} solved</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${cat.pct}%; background:var(--blue)"></div>
        </div>
        <div class="progress-date" style="font-weight:600; color:var(--text); width:40px; text-align:right">${cat.pct}%</div>
      </div>`;
  }).join('');
}

// =============================================================
// RECENT ACTIVITY TIMELINE
// =============================================================
function drawTimeline(activity) {
  const el = document.getElementById('timeline');

  if (!activity.length) {
    el.innerHTML = '<p style="padding:12px 0;font-size:13px;color:var(--text-3)">Nothing yet — start visualizing!</p>';
    return;
  }

  el.innerHTML = activity.slice(0, 8).map((item, idx) => `
    <div class="tl-item">
      <div class="tl-dot${idx < 2 ? ' recent' : ''}"></div>
      <div style="flex:1">
        <div class="tl-algo">${item.algorithm}</div>
        <div class="tl-action">${item.action || 'Ran'}</div>
      </div>
      <div class="tl-time">${friendlyDate(item.time)}</div>
    </div>`).join('');
}

// =============================================================
// BADGES GRID
// =============================================================
function drawBadges(earned) {
  const el        = document.getElementById('badges-grid');
  const earnedSet = new Set(earned.map(b => b.id));

  el.innerHTML = BADGE_LIST.map(badge => {
    const isEarned = earnedSet.has(badge.id);
    return `
      <div class="badge-card ${isEarned ? 'earned' : 'locked'}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
        ${!isEarned ? '<div class="badge-locked-text">🔒 locked</div>' : ''}
      </div>`;
  }).join('');
}

// =============================================================
// HELPERS
// =============================================================
window.resetDsaProgress = function() {
  if (confirm("Are you sure you want to permanently erase all your 'Mark as Done' checkboxes? This cannot be undone.")) {
    localStorage.removeItem('dsa_done_problems');
    loadProfile(); // Refresh page
  }
};

window.submitChangePwd = async function(btn) {
  const currentPassword = document.getElementById('cur-pwd').value;
  const newPassword = document.getElementById('new-pwd').value;
  const msgLabel = document.getElementById('pwd-msg');
  msgLabel.style.color = 'var(--red)';
  
  if (!currentPassword || !newPassword) {
    msgLabel.textContent = 'Please fill out both fields.';
    return;
  }
  if (newPassword.length < 6) {
    msgLabel.textContent = 'New password must be at least 6 characters.';
    return;
  }
  
  btn.disabled = true;
  btn.textContent = 'Saving...';
  
  try {
    const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';
    const res = await fetch(API_BASE + '/auth/change-password', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update password');
    
    msgLabel.style.color = 'var(--green)';
    msgLabel.textContent = 'Password updated successfully!';
    
    setTimeout(() => {
      document.getElementById('cur-pwd').value = '';
      document.getElementById('new-pwd').value = '';
      msgLabel.textContent = '';
      btn.disabled = false;
      btn.textContent = 'Update Password';
    }, 2500);
    
  } catch (err) {
    msgLabel.textContent = err.message;
    btn.disabled = false;
    btn.textContent = 'Save Password';
  }
};

// Returns "YYYY-MM-DD" in LOCAL time (avoids UTC offset surprises)
function dateKey(d) {
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

// Build the activeDays array from heatmap when the backend doesn't supply it
function activeDaysFromMap(heatmap) {
  const todayLocal = new Date();
  todayLocal.setHours(0, 0, 0, 0);
  const result = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(todayLocal);
    d.setDate(d.getDate() - i);
    if (heatmap[dateKey(d)]) result.push(i);
  }
  return result;
}

// Human-readable relative time: "just now", "3m ago", "yesterday", "Mar 5"
function friendlyDate(isoString) {
  const then = new Date(isoString);
  const now  = new Date();
  const diffMs   = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1)   return 'just now';
  if (diffMins < 60)  return diffMins + 'm ago';
  if (diffDays === 0) return Math.floor(diffMins / 60) + 'h ago';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7)   return diffDays + ' days ago';
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Boot
document.addEventListener('DOMContentLoaded', loadProfile);