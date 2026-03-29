// =============================================================
// hashing.js  –  Hash Table visualizer.
// Supports both Separate Chaining and Linear Probing.
// Hash function: sum of char codes % table_size.
// =============================================================

// ------ State ------
let tableSize = 11;
// For chaining: table[i] = array of keys
// For linear probing: table[i] = key | null | '__deleted__'
let hashTable  = [];
let itemCount  = 0;
let isRunning  = false;
const sleep    = ms => new Promise(r => setTimeout(r, ms));
const DELETED  = '__deleted__'; // tombstone for linear probing

// ------ Hash function ------
// Simple sum of char codes mod table size.
// Called with extra='show' to display the formula step-by-step.
function hashFn(key, size) {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % (size || tableSize);
}

// Show the live calculation as the user types
document.addEventListener('DOMContentLoaded', function() {
  const keyInput = document.getElementById('hash-key');
  if (keyInput) {
    keyInput.addEventListener('input', function() {
      const key  = this.value.trim();
      const lc   = document.getElementById('live-calc');
      if (!key) { lc.textContent = 'Type a key to see the hash computed live'; return; }
      const sum  = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const idx  = sum % tableSize;
      lc.innerHTML =
        'key="' + key + '" → '
        + [...key].map(ch => ch.charCodeAt(0)).join('+')
        + ' = ' + sum
        + ' % ' + tableSize
        + ' = <strong style="color:var(--blue)">' + idx + '</strong>';
    });
    keyInput.addEventListener('keydown', e => { if (e.key === 'Enter') hashInsert(); });
  }

  initTable(tableSize);
  showCode('insert');
  updateFill();
  document.getElementById('speed') && document.getElementById('speed').addEventListener('input', function() {
    document.getElementById('speed-val') && (document.getElementById('speed-val').textContent = this.value);
  });
});

// ------ Table init ------
function initTable(size) {
  const method = document.getElementById('collision-method').value;
  tableSize = size;
  hashTable = method === 'chaining'
    ? Array.from({ length: size }, () => [])   // chaining: array of arrays
    : new Array(size).fill(null);              // linear probing: flat array
  itemCount = 0;
  renderTable({});
  document.getElementById('tbl-size-label').textContent = size;
}

function resizeTable() {
  tableSize = parseInt(document.getElementById('table-size').value, 10);
  initTable(tableSize);
  setStatus('Table resized to ' + tableSize + ' buckets — all keys cleared');
}

// ------ Pseudocode ------
const HASH_CODE = {
  insert: [
    '<span class="kw">def</span> <span class="fn">insert</span>(self, key):',
    '  index = hash(key) % self.size',
    '  <span class="cm"># Chaining: just append to bucket list</span>',
    '  self.table[index].append(key)',
    '  <span class="cm"># Linear probing: find empty slot</span>',
    '  <span class="kw">while</span> self.table[index] <span class="kw">is not</span> None:',
    '    index = (index + 1) % self.size',
    '  self.table[index] = key',
  ],
  search: [
    '<span class="kw">def</span> <span class="fn">search</span>(self, key):',
    '  index = hash(key) % self.size',
    '  <span class="cm"># Chaining: scan the bucket list</span>',
    '  <span class="kw">for</span> item <span class="kw">in</span> self.table[index]:',
    '    <span class="kw">if</span> item == key: <span class="kw">return</span> index',
    '  <span class="cm"># Linear probing: scan until empty</span>',
    '  <span class="kw">while</span> self.table[index] != key:',
    '    index = (index + 1) % self.size',
    '  <span class="kw">return</span> index',
  ],
  delete: [
    '<span class="kw">def</span> <span class="fn">delete</span>(self, key):',
    '  index = hash(key) % self.size',
    '  <span class="cm"># Chaining: remove from list</span>',
    '  self.table[index].remove(key)',
    '  <span class="cm"># Linear probing: mark as deleted</span>',
    '  self.table[index] = DELETED  <span class="cm"># tombstone</span>',
  ],
};

function showCode(op, line) {
  const lines = HASH_CODE[op] || [];
  const hl    = (line === undefined) ? -1 : line;
  document.getElementById('hash-code').innerHTML = lines
    .map((l, i) => `<div class="code-line${i === hl ? ' active' : ''}">${l}</div>`)
    .join('');
  document.getElementById('hash-op').textContent = op;
}

function setStatus(msg) { document.getElementById('hash-status').textContent = msg; }

function showFormula(key, sum, idx) {
  const chars = [...key].map(ch => ch.charCodeAt(0)).join(' + ');
  document.getElementById('hash-formula').innerHTML =
    'hash("' + key + '") = (' + chars + ') % ' + tableSize
    + ' = ' + sum + ' % ' + tableSize
    + ' = <strong style="color:var(--blue)">' + idx + '</strong>';
}

function updateFill() {
  const method = document.getElementById('collision-method').value;
  const filled = method === 'chaining'
    ? hashTable.filter(b => b.length > 0).length
    : hashTable.filter(v => v !== null && v !== DELETED).length;
  document.getElementById('hash-fill').textContent = itemCount + ' items, ' + filled + '/' + tableSize + ' buckets used';
}

// ------ Render ------
// highlights = { bucketIndex: 'inserting'|'found'|'deleting'|'collision' }
function renderTable(highlights) {
  const grid   = document.getElementById('hash-grid');
  const method = document.getElementById('collision-method').value;
  grid.innerHTML = '';
  highlights = highlights || {};

  for (let i = 0; i < tableSize; i++) {
    const row = document.createElement('div');
    row.className = 'hash-bucket';

    // Index label
    const idx = document.createElement('div');
    idx.className = 'bucket-index';
    idx.textContent = i;
    row.appendChild(idx);

    if (method === 'chaining') {
      const chain = hashTable[i];
      if (chain.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'bucket-slot empty';
        empty.textContent = '—';
        row.appendChild(empty);
      } else {
        chain.forEach((key, j) => {
          if (j > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'bucket-arrow';
            arrow.textContent = '→';
            row.appendChild(arrow);
          }
          const slot = document.createElement('div');
          slot.className = 'bucket-slot';
          if (highlights[i] === 'inserting' && j === chain.length - 1) slot.classList.add('inserting');
          else if (highlights[i] === 'found' && key === highlights._key)  slot.classList.add('found');
          else if (highlights[i] === 'deleting' && key === highlights._key) slot.classList.add('deleting');
          else if (j > 0) slot.classList.add('collision');
          slot.textContent = key;
          row.appendChild(slot);
        });
      }
    } else {
      // Linear probing — one slot per index
      const val  = hashTable[i];
      const slot = document.createElement('div');
      slot.className = 'bucket-slot';

      if (val === null) { slot.classList.add('empty'); slot.textContent = '—'; }
      else if (val === DELETED) { slot.classList.add('empty'); slot.textContent = '✗ deleted'; }
      else {
        slot.textContent = val;
        if (highlights[i] === 'inserting') slot.classList.add('inserting');
        else if (highlights[i] === 'found')    slot.classList.add('found');
        else if (highlights[i] === 'deleting') slot.classList.add('deleting');
        else if (highlights[i] === 'probe')    slot.classList.add('collision');
      }
      row.appendChild(slot);
    }

    grid.appendChild(row);
  }
  updateFill();
}

// =============================================================
// OPERATIONS
// =============================================================
async function hashInsert() {
  if (isRunning) return;
  const key = document.getElementById('hash-key').value.trim();
  if (!key) { setStatus('Please enter a key to insert'); return; }

  isRunning = true;
  showCode('insert', 1);
  const method = document.getElementById('collision-method').value;
  const sum    = [...key].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const idx    = sum % tableSize;
  showFormula(key, sum, idx);
  logProgress('hash insert');

  setStatus('Computing hash: "' + key + '" → index ' + idx);
  renderTable({ [idx]: 'inserting' });
  await sleep(600);

  if (method === 'chaining') {
    showCode('insert', 3);
    hashTable[idx].push(key);
    itemCount++;
    renderTable({ [idx]: 'inserting', _key: key });
    setStatus('Inserted "' + key + '" into bucket ' + idx + (hashTable[idx].length > 1 ? ' (collision — chained!)' : ''));
  } else {
    // Linear probing
    let probe = idx;
    let steps = 0;
    while (hashTable[probe] !== null && hashTable[probe] !== DELETED && hashTable[probe] !== key) {
      showCode('insert', 5);
      setStatus('Slot ' + probe + ' is occupied — probing next...');
      renderTable({ [probe]: 'probe' });
      await sleep(400);
      probe = (probe + 1) % tableSize;
      steps++;
      if (steps >= tableSize) { setStatus('Hash table is full!'); isRunning = false; return; }
    }
    hashTable[probe] = key;
    itemCount++;
    showCode('insert', 7);
    renderTable({ [probe]: 'inserting' });
    setStatus('Inserted "' + key + '" at slot ' + probe + (steps > 0 ? ' (after ' + steps + ' probe step' + (steps>1?'s':'') + ')' : ''));
  }

  await sleep(600);
  renderTable({});
  isRunning = false;
}

async function hashSearch() {
  if (isRunning) return;
  const key = document.getElementById('hash-key').value.trim();
  if (!key) { setStatus('Please enter a key to search for'); return; }

  isRunning = true;
  showCode('search', 1);
  const method = document.getElementById('collision-method').value;
  const sum    = [...key].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const idx    = sum % tableSize;
  showFormula(key, sum, idx);

  setStatus('Computed hash: bucket ' + idx + ' — looking for "' + key + '"...');
  renderTable({ [idx]: 'inserting' });
  await sleep(600);

  if (method === 'chaining') {
    const chain = hashTable[idx];
    let found   = false;
    showCode('search', 3);
    for (const item of chain) {
      if (item === key) { found = true; break; }
    }
    if (found) {
      renderTable({ [idx]: 'found', _key: key });
      setStatus('✅ Found "' + key + '" in bucket ' + idx);
    } else {
      setStatus('❌ "' + key + '" not found in bucket ' + idx);
      renderTable({});
    }
  } else {
    let probe = idx, steps = 0;
    while (hashTable[probe] !== null && steps < tableSize) {
      showCode('search', 6);
      if (hashTable[probe] === key) {
        renderTable({ [probe]: 'found' });
        setStatus('✅ Found "' + key + '" at slot ' + probe + (steps > 0 ? ' (' + steps + ' probes)' : ''));
        isRunning = false; await sleep(800); renderTable({}); return;
      }
      renderTable({ [probe]: 'probe' });
      await sleep(400);
      probe = (probe + 1) % tableSize; steps++;
    }
    setStatus('❌ "' + key + '" not found in the table');
    renderTable({});
  }

  await sleep(700);
  renderTable({});
  isRunning = false;
}

async function hashDelete() {
  if (isRunning) return;
  const key = document.getElementById('hash-key').value.trim();
  if (!key) { setStatus('Please enter a key to delete'); return; }

  isRunning = true;
  showCode('delete', 1);
  const method = document.getElementById('collision-method').value;
  const sum    = [...key].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const idx    = sum % tableSize;
  showFormula(key, sum, idx);

  renderTable({ [idx]: 'deleting', _key: key });
  await sleep(500);

  if (method === 'chaining') {
    const chain = hashTable[idx];
    const pos   = chain.indexOf(key);
    if (pos >= 0) {
      chain.splice(pos, 1);
      itemCount--;
      setStatus('Deleted "' + key + '" from bucket ' + idx);
      showCode('delete', 3);
    } else {
      setStatus('❌ "' + key + '" not found in bucket ' + idx + ' — cannot delete');
    }
  } else {
    let probe = idx, steps = 0;
    while (hashTable[probe] !== null && steps < tableSize) {
      if (hashTable[probe] === key) {
        hashTable[probe] = DELETED; // tombstone
        itemCount--;
        showCode('delete', 4);
        setStatus('Deleted "' + key + '" from slot ' + probe + ' (marked as tombstone)');
        renderTable({ [probe]: 'deleting' });
        isRunning = false; await sleep(800); renderTable({}); return;
      }
      probe = (probe + 1) % tableSize; steps++;
    }
    setStatus('❌ "' + key + '" not found');
  }

  await sleep(600);
  renderTable({});
  isRunning = false;
}

function hashReset() {
  isRunning = false;
  const method = document.getElementById('collision-method').value;
  initTable(tableSize);
  showCode('insert');
  showFormula('', 0, 0);
  document.getElementById('hash-formula').textContent = 'hash(key) = sum of char codes % table_size';
  setStatus('Table cleared. Try inserting some keys!');
}