let allProblems = [];
let doneProblems = new Set(JSON.parse(localStorage.getItem('dsa_done_problems') || '[]'));

// DOM Elements
const tbody = document.getElementById('problems-tbody');
const searchInput = document.getElementById('search-input');
const statTotal = document.getElementById('stat-total');
const statDone = document.getElementById('stat-done');
const topicFiltersContainer = document.getElementById('topic-filters');

async function fetchProblems() {
  try {
    const res = await fetch('data/problems.json');
    allProblems = await res.json();
    initFilters();
    renderTable();
  } catch (err) {
    console.error('Failed to load problems:', err);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color:var(--red)">Failed to load problem database. Please check console.</td></tr>`;
  }
}

function initFilters() {
  // Extract unique categories using a standard loop
  let categories = [];
  for (let i = 0; i < allProblems.length; i++) {
    let cat = allProblems[i].category;
    let found = false;
    for (let j = 0; j < categories.length; j++) {
      if (categories[j] === cat) {
        found = true;
        break;
      }
    }
    if (!found) {
      categories.push(cat);
    }
  }
  categories.sort();
  
  categories.forEach(cat => {
    const label = document.createElement('label');
    label.className = 'filter-opt';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'cat-filter';
    input.value = cat;
    input.checked = false; // Start unchecked
    
    // Add event listener directly to this input instead of querying later
    input.addEventListener('change', renderTable);
    
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + cat));
    topicFiltersContainer.appendChild(label);
  });
  
  // Attach event listeners to static filter inputs
  document.querySelectorAll('.dif-filter, input[name="status"]').forEach(input => {
    input.addEventListener('change', renderTable);
  });
  
  searchInput.addEventListener('input', () => {
    renderTable(); // We can debounce this if it's too slow
  });
}

function renderTable() {
  // Get active filters
  const selectedDiffs = Array.from(document.querySelectorAll('.dif-filter:checked')).map(cb => cb.value.toLowerCase());
  const selectedCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
  const statusFilter = document.querySelector('input[name="status"]:checked').value; // all, todo, done
  const searchQuery = searchInput.value.trim().toLowerCase();
  
  // Filter array using a classic loop
  let filtered = [];
  for (let i = 0; i < allProblems.length; i++) {
    let p = allProblems[i];
    let isDone = doneProblems.has(p.id);
    let shouldKeep = true;
    
    // Status check
    if (statusFilter === 'done' && isDone === false) {
      shouldKeep = false;
    }
    if (statusFilter === 'todo' && isDone === true) {
      shouldKeep = false;
    }
    
    // Difficulty check
    let pDiff = p.difficulty.toLowerCase();
    let diffMatch = false;
    if (selectedDiffs.length > 0) {
      for (let j = 0; j < selectedDiffs.length; j++) {
        if (pDiff.indexOf(selectedDiffs[j]) !== -1) {
          diffMatch = true;
          break;
        }
      }
      if (diffMatch === false) {
        shouldKeep = false;
      }
    }
    
    // Category check
    let catMatch = false;
    if (selectedCats.length > 0) {
      for (let j = 0; j < selectedCats.length; j++) {
        if (selectedCats[j] === p.category) {
          catMatch = true;
          break;
        }
      }
      if (catMatch === false) {
        shouldKeep = false;
      }
    }
    
    // Search check
    if (searchQuery !== "") {
      if (p.title.toLowerCase().indexOf(searchQuery) === -1) {
        shouldKeep = false;
      }
    }
    
    if (shouldKeep === true) {
      filtered.push(p);
    }
  }
  
  // Stats
  statTotal.textContent = `${filtered.length} Problems`;
  statDone.textContent = `${doneProblems.size} Solved`;
  
  // Render
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color:var(--text-3)">No problems found matching filters.</td></tr>`;
    return;
  }
  
  let tableHTML = "";
  for (let i = 0; i < filtered.length; i++) {
    let p = filtered[i];
    let isDone = doneProblems.has(p.id);
    
    let diffClass = 'diff-medium';
    let pDiffLC = p.difficulty.toLowerCase();
    if (pDiffLC.indexOf('easy') !== -1) {
      diffClass = 'diff-easy';
    } else if (pDiffLC.indexOf('hard') !== -1 && pDiffLC.indexOf('medium') === -1) {
      diffClass = 'diff-hard';
    }
    
    let safeLink = '#';
    if (p.link) {
      safeLink = p.link.split('&amp;').join('&');
    }
    
    let safeVid = '';
    if (p.video) {
      safeVid = p.video.split('&amp;').join('&');
    }
    
    let checkedHTML = "";
    if (isDone) {
      checkedHTML = "checked";
    }
    
    let rowClass = "";
    if (isDone) {
      rowClass = "row-done";
    }
    
    let companiesHTML = "";
    if (p.companies && p.companies.length > 0) {
      let comps = [];
      for (let c = 0; c < p.companies.length && c < 3; c++) {
        comps.push(p.companies[c]);
      }
      let dotdot = "";
      if (p.companies.length > 3) {
        dotdot = "...";
      }
      companiesHTML = `<div style="font-size:10px; color:var(--text-3); margin-top:4px">${comps.join(', ')}${dotdot}</div>`;
    }
    
    let videoHTML = `<span style="color:var(--border-2)">—</span>`;
    if (p.video) {
      videoHTML = `<a href="${safeVid}" target="_blank" style="color:var(--text-3); font-size:16px" title="Video Solution">📺</a>`;
    }

    tableHTML += `
      <tr class="${rowClass}">
        <td style="text-align:center">
          <input type="checkbox" class="done-cb" data-id="${p.id}" ${checkedHTML} onchange="toggleDone('${p.id}')"/>
        </td>
        <td>
          <a href="${safeLink}" target="_blank" class="q-title">${p.title}</a>
          ${companiesHTML}
        </td>
        <td><span class="topic-pill">${p.category}</span></td>
        <td><span class="diff-badge ${diffClass}">${p.difficulty}</span></td>
        <td>
          ${videoHTML}
        </td>
      </tr>
    `;
  }
  
  tbody.innerHTML = tableHTML;
}

window.toggleDone = function(id) {
  if (doneProblems.has(id)) {
    doneProblems.delete(id);
  } else {
    doneProblems.add(id);
  }
  localStorage.setItem('dsa_done_problems', JSON.stringify([...doneProblems]));
  renderTable(); // re-render to update strike-through styles
};

window.resetFilters = function() {
  document.querySelectorAll('.dif-filter').forEach(cb => cb.checked = false);
  document.querySelectorAll('.cat-filter').forEach(cb => cb.checked = false);
  document.querySelector('input[name="status"][value="all"]').checked = true;
  searchInput.value = '';
  renderTable();
};

// Start
document.addEventListener('DOMContentLoaded', fetchProblems);
