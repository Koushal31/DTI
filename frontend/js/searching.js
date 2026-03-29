// =============================================================
// searching.js  –  Linear, Binary, and Jump Search visualizer.
// Inspired by VisuAlgo and algorithm-visualizer.org approaches.
// =============================================================

const SEARCH_ALGOS = {
  linear: {
    label: 'Linear Search',
    timeComplexity: 'O(n)', spaceCmplx: 'O(1)',
    best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)',
    needsSorted: false,
    code: [
      '<span class="kw">def</span> <span class="fn">linear_search</span>(arr, target):',
      '  <span class="kw">for</span> i <span class="kw">in</span> range(len(arr)):',
      '    <span class="kw">if</span> arr[i] == target:   <span class="cm"># check each element</span>',
      '      <span class="kw">return</span> i            <span class="cm"># found — return index</span>',
      '  <span class="kw">return</span> -1               <span class="cm"># not found</span>',
    ],
    explain: {
      summary: 'Linear Search checks every element one by one from the start. It is the simplest search algorithm and works on both sorted and unsorted arrays. The trade-off is efficiency — it must look at up to every element.',
      steps: [
        ['Start at index 0', 'Look at the first element. If it equals the target, we are done.'],
        ['Move forward', 'If not a match, move to the next index and check again.'],
        ['Repeat', 'Keep going until either we find the target or we reach the end.'],
        ['Not found', 'If we exhaust every element without a match, return -1.'],
      ]
    }
  },
  binary: {
    label: 'Binary Search',
    timeComplexity: 'O(log n)', spaceCmplx: 'O(1)',
    best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)',
    needsSorted: true,
    code: [
      '<span class="kw">def</span> <span class="fn">binary_search</span>(arr, target):',
      '  low, high = 0, len(arr) - 1',
      '  <span class="kw">while</span> low <= high:',
      '    mid = (low + high) // 2',
      '    <span class="kw">if</span> arr[mid] == target:',
      '      <span class="kw">return</span> mid          <span class="cm"># found!</span>',
      '    <span class="kw">elif</span> arr[mid] < target:',
      '      low = mid + 1       <span class="cm"># search right half</span>',
      '    <span class="kw">else</span>:',
      '      high = mid - 1      <span class="cm"># search left half</span>',
      '  <span class="kw">return</span> -1',
    ],
    explain: {
      summary: 'Binary Search works on sorted arrays. It eliminates half of the remaining search space with every comparison — by looking at the middle element and deciding whether to go left or right. This gives it O(log n) time, far faster than linear search for large arrays.',
      steps: [
        ['Set boundaries', 'Start with low = 0 and high = last index.'],
        ['Pick the middle', 'Calculate mid = (low + high) / 2. Check arr[mid].'],
        ['Compare', 'If arr[mid] == target, done. If target is bigger, move low up. If smaller, move high down.'],
        ['Repeat', 'Keep halving the search space until found or low > high.'],
      ]
    }
  },
  jump: {
    label: 'Jump Search',
    timeComplexity: 'O(√n)', spaceCmplx: 'O(1)',
    best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', space: 'O(1)',
    needsSorted: true,
    code: [
      '<span class="kw">import</span> math',
      '<span class="kw">def</span> <span class="fn">jump_search</span>(arr, target):',
      '  n = len(arr)',
      '  step = int(math.sqrt(n))  <span class="cm"># block size = √n</span>',
      '  prev = 0',
      '  <span class="kw">while</span> arr[min(step, n)-1] < target:',
      '    prev = step; step += int(math.sqrt(n))',
      '    <span class="kw">if</span> prev >= n: <span class="kw">return</span> -1',
      '  <span class="kw">while</span> arr[prev] < target:  <span class="cm"># linear in block</span>',
      '    prev += 1',
      '    <span class="kw">if</span> prev == min(step, n): <span class="kw">return</span> -1',
      '  <span class="kw">if</span> arr[prev] == target: <span class="kw">return</span> prev',
      '  <span class="kw">return</span> -1',
    ],
    explain: {
      summary: 'Jump Search sits between Linear and Binary Search in performance. It jumps ahead in fixed blocks of size √n to find the block that might contain the target, then does a linear scan inside that block. This gives O(√n) — better than O(n) but simpler to implement than binary search.',
      steps: [
        ['Calculate step size', 'Block size = √n. For an array of 16 elements, step = 4.'],
        ['Jump through blocks', 'Compare the end of each block with the target. Jump forward until arr[block_end] >= target.'],
        ['Linear scan in block', 'Once the right block is found, scan linearly from the block start.'],
        ['Found or not', 'If the element is found in the block, return its index. Otherwise return -1.'],
      ]
    }
  }
};

let searchArr  = [];
let isRunning  = false;
let shouldStop = false;
let compCount  = 0;

const sleep    = ms => new Promise(r => setTimeout(r, ms));
const getDelay = () => Math.max(300, 1200 - parseInt(document.getElementById('speed').value, 10) * 100);

document.getElementById('speed').addEventListener('input', function() {
  document.getElementById('speed-val').textContent = this.value;
});

// ------ Array helpers ------
function readArray() {
  const raw    = document.getElementById('arr-input').value;
  const parsed = raw.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
  return parsed.length >= 2 ? parsed : [3,7,11,15,18,22,27,35,42,50];
}

function randomArray() {
  const algoKey = document.getElementById('algo-select').value;
  // For binary/jump, array must be sorted
  const size = 10;
  let arr = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
  if (algoKey !== 'linear') arr.sort((a, b) => a - b);
  // Remove duplicates for cleaner visualization
  arr = [...new Set(arr)];
  document.getElementById('arr-input').value = arr.join(',');
  searchArr = [...arr];
  drawSearchArray(searchArr, {});
}

function applyArray() {
  shouldStop = true;
  setTimeout(() => {
    searchArr = readArray();
    compCount = 0;
    drawSearchArray(searchArr, {});
    setStatus('Ready — press ▶ Search');
  }, 60);
}

// ------ Rendering ------
// states = { index: 'checking' | 'found' | 'eliminated' | 'range-active' }
// pointers = { low: idx, mid: idx, high: idx, cur: idx }
function drawSearchArray(arr, states, pointers) {
  const container = document.getElementById('search-array');
  container.innerHTML = '';
  states   = states   || {};
  pointers = pointers || {};

  arr.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'search-cell';
    if (states[i]) cell.classList.add(states[i]);

    cell.textContent = val;

    // Index label below the cell
    const idxSpan = document.createElement('div');
    idxSpan.className   = 'cell-idx';
    idxSpan.textContent = i;
    cell.appendChild(idxSpan);

    // Pointer labels above the cell (low / mid / high / cur)
    const ptrLabels = [];
    if (pointers.cur  === i) ptrLabels.push({ text: 'i',    cls: 'ptr-low' });
    if (pointers.low  === i) ptrLabels.push({ text: 'low',  cls: 'ptr-low' });
    if (pointers.mid  === i) ptrLabels.push({ text: 'mid',  cls: 'ptr-mid' });
    if (pointers.high === i) ptrLabels.push({ text: 'high', cls: 'ptr-high' });
    if (pointers.prev === i) ptrLabels.push({ text: 'prev', cls: 'ptr-low' });
    if (pointers.jump === i) ptrLabels.push({ text: 'jump', cls: 'ptr-mid' });

    if (ptrLabels.length) {
      const ptrSpan = document.createElement('div');
      ptrSpan.className   = 'cell-ptr';
      ptrSpan.innerHTML   = ptrLabels.map(p => `<span class="${p.cls}">${p.text}</span>`).join('/');
      cell.appendChild(ptrSpan);
    }

    container.appendChild(cell);
  });

  document.getElementById('viz-ops').textContent = compCount + ' comparisons';
}

function setStatus(msg) { document.getElementById('status-line').textContent = msg; }

function showCode(algoKey, activeLine) {
  const lines = SEARCH_ALGOS[algoKey].code;
  const hl    = (activeLine === undefined) ? -1 : activeLine;
  document.getElementById('code-block').innerHTML = lines
    .map((l, i) => `<div class="code-line${i === hl ? ' active' : ''}">${l}</div>`)
    .join('');
}

function showComplexity(key) {
  const a = SEARCH_ALGOS[key];
  document.getElementById('complexity-grid').innerHTML = `
    <div class="complexity-item"><div class="complexity-label">Best Case</div><div class="complexity-value">${a.best}</div></div>
    <div class="complexity-item"><div class="complexity-label">Average</div><div class="complexity-value">${a.avg}</div></div>
    <div class="complexity-item"><div class="complexity-label">Worst Case</div><div class="complexity-value">${a.worst}</div></div>
    <div class="complexity-item"><div class="complexity-label">Space</div><div class="complexity-value">${a.space}</div></div>`;
}

function showExplanation(key) {
  const ex = SEARCH_ALGOS[key].explain;
  document.getElementById('how-title').textContent = 'How ' + SEARCH_ALGOS[key].label + ' Works';
  document.getElementById('how-summary').textContent = ex.summary;
  document.getElementById('how-list').innerHTML = ex.steps
    .map((s, i) =>
      `<div class="how-item"><div class="how-num">${i+1}</div><div class="how-text"><strong>${s[0]}:</strong> ${s[1]}</div></div>`
    ).join('');
}

function updateHeader(key) {
  const a = SEARCH_ALGOS[key];
  document.getElementById('hdr-algo').textContent       = a.label;
  document.getElementById('hdr-complexity').textContent = 'Time: ' + a.timeComplexity;
  document.getElementById('hdr-space').textContent      = 'Space: ' + a.spaceCmplx;
  document.getElementById('viz-title').textContent      = a.label;
  document.querySelectorAll('.bigo-table tr[data-algo]').forEach(r => {
    r.classList.toggle('highlight', r.dataset.algo === key);
  });
}

function onAlgoChange() {
  const key = document.getElementById('algo-select').value;
  searchArr = readArray();
  compCount = 0;
  drawSearchArray(searchArr, {});
  showCode(key);
  showComplexity(key);
  showExplanation(key);
  updateHeader(key);

  // Show a note if array needs to be sorted
  const note = SEARCH_ALGOS[key].needsSorted
    ? 'Note: ' + SEARCH_ALGOS[key].label + ' requires a sorted array. Sort your array before searching!'
    : 'Ready — press ▶ Search';
  setStatus(note);
}

function resetSearch() {
  shouldStop = true; isRunning = false;
  setTimeout(() => {
    searchArr = readArray(); compCount = 0;
    drawSearchArray(searchArr, {});
    setStatus('Ready');
    document.getElementById('btn-run').disabled = false;
  }, 60);
}

// ------ Run dispatcher ------
async function runSearch() {
  if (isRunning) return;
  searchArr  = readArray();
  compCount  = 0;
  shouldStop = false;
  isRunning  = true;
  document.getElementById('btn-run').disabled = true;

  const key    = document.getElementById('algo-select').value;
  const target = parseInt(document.getElementById('target-input').value, 10);

  if (isNaN(target)) { setStatus('Please enter a valid number to search for'); isRunning = false; document.getElementById('btn-run').disabled = false; return; }

  logProgress(SEARCH_ALGOS[key].label);

  drawSearchArray(searchArr, {});
  setStatus('Searching for ' + target + '...');
  await sleep(400);

  let result = -1;
  if      (key === 'linear') result = await doLinearSearch(searchArr, target);
  else if (key === 'binary') result = await doBinarySearch(searchArr, target);
  else if (key === 'jump')   result = await doJumpSearch(searchArr, target);

  isRunning = false;
  document.getElementById('btn-run').disabled = false;

  if (!shouldStop) {
    if (result >= 0) {
      setStatus('✅ Found ' + target + ' at index [' + result + '] after ' + compCount + ' comparisons!');
    } else {
      setStatus('❌ ' + target + ' is not in the array (' + compCount + ' comparisons)');
    }
  }
}

// =============================================================
// LINEAR SEARCH
// =============================================================
async function doLinearSearch(arr, target) {
  const states = {};

  for (let i = 0; i < arr.length && !shouldStop; i++) {
    compCount++;
    states[i] = 'checking';
    drawSearchArray(arr, { ...states }, { cur: i });
    showCode('linear', 2);
    setStatus('Checking index [' + i + ']: arr[' + i + '] = ' + arr[i] + ' … == ' + target + '?');
    await sleep(getDelay());

    if (arr[i] === target) {
      states[i] = 'found';
      drawSearchArray(arr, { ...states }, {});
      showCode('linear', 3);
      return i;
    } else {
      states[i] = 'eliminated';
    }
  }
  drawSearchArray(arr, { ...states }, {});
  showCode('linear', 4);
  return -1;
}

// =============================================================
// BINARY SEARCH
// =============================================================
async function doBinarySearch(arr, target) {
  let low  = 0;
  let high = arr.length - 1;

  while (low <= high && !shouldStop) {
    const mid = Math.floor((low + high) / 2);
    compCount++;

    // Build visual state: eliminated zones shown dimmed
    const states = {};
    for (let k = 0; k < low; k++)  states[k] = 'eliminated';
    for (let k = high + 1; k < arr.length; k++) states[k] = 'eliminated';
    states[mid] = 'checking';

    drawSearchArray(arr, states, { low, mid, high });
    showCode('binary', 3);
    setStatus('low=' + low + '  mid=' + mid + '  high=' + high + ' → checking arr[' + mid + '] = ' + arr[mid]);
    await sleep(getDelay());

    if (arr[mid] === target) {
      states[mid] = 'found';
      drawSearchArray(arr, states, {});
      showCode('binary', 5);
      return mid;
    } else if (arr[mid] < target) {
      showCode('binary', 7);
      setStatus('arr[' + mid + ']=' + arr[mid] + ' < ' + target + ' → search right half (low = ' + (mid+1) + ')');
      low = mid + 1;
    } else {
      showCode('binary', 9);
      setStatus('arr[' + mid + ']=' + arr[mid] + ' > ' + target + ' → search left half (high = ' + (mid-1) + ')');
      high = mid - 1;
    }
    await sleep(getDelay() / 2);
  }
  showCode('binary', 10);
  return -1;
}

// =============================================================
// JUMP SEARCH
// =============================================================
async function doJumpSearch(arr, target) {
  const n    = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev   = 0;
  let curr   = step;

  setStatus('Step size = √' + n + ' = ' + step + ' — jumping through blocks...');
  await sleep(getDelay());

  // Phase 1: jump through blocks until we find the right block
  while (curr <= n && arr[Math.min(curr, n) - 1] < target && !shouldStop) {
    compCount++;
    const jumpIdx = Math.min(curr, n) - 1;
    const states  = {};
    for (let k = 0; k < prev; k++) states[k] = 'eliminated';
    states[jumpIdx] = 'checking';

    drawSearchArray(arr, states, { prev, jump: jumpIdx });
    showCode('jump', 5);
    setStatus('Block end arr[' + jumpIdx + '] = ' + arr[jumpIdx] + ' < ' + target + ' — jump forward');
    await sleep(getDelay());

    prev = curr;
    curr += step;
  }

  if (shouldStop) return -1;

  // Phase 2: linear scan within the identified block
  const blockEnd = Math.min(curr, n);
  setStatus('Target should be in block [' + prev + ' … ' + (blockEnd - 1) + '] — scanning linearly...');
  await sleep(getDelay() / 2);

  while (prev < blockEnd && !shouldStop) {
    compCount++;
    const states = {};
    for (let k = 0; k < prev; k++) states[k] = 'eliminated';
    states[prev] = 'checking';

    drawSearchArray(arr, states, { prev, jump: Math.min(curr, n) - 1 });
    showCode('jump', 8);
    setStatus('Linear scan: checking arr[' + prev + '] = ' + arr[prev] + ' … == ' + target + '?');
    await sleep(getDelay());

    if (arr[prev] === target) {
      states[prev] = 'found';
      drawSearchArray(arr, states, {});
      showCode('jump', 11);
      return prev;
    }

    if (arr[prev] > target) break; // passed it — not in array
    prev++;
  }
  showCode('jump', 12);
  return -1;
}

// ------ Init ------
document.addEventListener('DOMContentLoaded', function() {
  searchArr = readArray();
  const key = document.getElementById('algo-select').value;
  drawSearchArray(searchArr, {});
  showCode(key);
  showComplexity(key);
  showExplanation(key);
  updateHeader(key);
});