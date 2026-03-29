// =============================================================
// graphs.js  –  BFS and DFS graph traversal visualizer.
// The graph is rendered as an SVG. Node positions are fixed
// for each preset so the layout is always clear and readable.
// =============================================================

// ------ Graph presets ------
// Each preset defines node positions (x, y) and an adjacency list.
const PRESETS = {
  default: {
    nodes: {
      A: { x: 300, y: 40 },
      B: { x: 150, y: 120 },
      C: { x: 450, y: 120 },
      D: { x: 80,  y: 220 },
      E: { x: 230, y: 220 },
      F: { x: 380, y: 220 },
      G: { x: 520, y: 220 },
    },
    edges: [['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['C','G'],['E','F']]
  },
  tree: {
    nodes: {
      A: { x: 300, y: 40 },
      B: { x: 170, y: 120 },
      C: { x: 430, y: 120 },
      D: { x: 100, y: 210 },
      E: { x: 240, y: 210 },
      F: { x: 360, y: 210 },
      G: { x: 490, y: 210 },
    },
    edges: [['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['C','G']]
  },
  dense: {
    nodes: {
      A: { x: 300, y: 50 },
      B: { x: 150, y: 150 },
      C: { x: 450, y: 150 },
      D: { x: 100, y: 280 },
      E: { x: 300, y: 280 },
      F: { x: 500, y: 280 },
      G: { x: 300, y: 180 },
    },
    edges: [['A','B'],['A','C'],['A','G'],['B','D'],['B','G'],['C','F'],['C','G'],['D','E'],['E','F'],['E','G'],['G','F']]
  },
  linear: {
    nodes: {
      A: { x: 60,  y: 160 },
      B: { x: 160, y: 160 },
      C: { x: 260, y: 160 },
      D: { x: 360, y: 160 },
      E: { x: 460, y: 160 },
      F: { x: 360, y: 260 },
      G: { x: 460, y: 260 },
    },
    edges: [['A','B'],['B','C'],['C','D'],['D','E'],['D','F'],['E','G'],['F','G']]
  }
};

// Build adjacency list (undirected)
function buildAdjList(edges) {
  const adj = {};
  edges.forEach(([u, v]) => {
    if (!adj[u]) adj[u] = [];
    if (!adj[v]) adj[v] = [];
    adj[u].push(v);
    adj[v].push(u);
  });
  return adj;
}

// ------ State ------
let currentGraph = PRESETS.default;
let adjList      = buildAdjList(currentGraph.edges);
let isRunning    = false;
const sleep      = ms => new Promise(r => setTimeout(r, ms));
const getDelay   = () => Math.max(300, 1400 - parseInt(document.getElementById('speed').value, 10) * 120);

// ------ Pseudocode ------
const GRAPH_CODE = {
  bfs: [
    '<span class="kw">def</span> <span class="fn">bfs</span>(graph, start):',
    '  visited = set()',
    '  queue   = [start]',
    '  visited.add(start)',
    '  <span class="kw">while</span> queue:',
    '    node = queue.pop(0)  <span class="cm"># dequeue from front</span>',
    '    process(node)',
    '    <span class="kw">for</span> neighbour <span class="kw">in</span> graph[node]:',
    '      <span class="kw">if</span> neighbour <span class="kw">not in</span> visited:',
    '        visited.add(neighbour)',
    '        queue.append(neighbour)',
  ],
  dfs: [
    '<span class="kw">def</span> <span class="fn">dfs</span>(graph, start):',
    '  visited = set()',
    '  stack   = [start]',
    '  <span class="kw">while</span> stack:',
    '    node = stack.pop()   <span class="cm"># pop from top</span>',
    '    <span class="kw">if</span> node <span class="kw">not in</span> visited:',
    '      visited.add(node)',
    '      process(node)',
    '      <span class="kw">for</span> neighbour <span class="kw">in</span> graph[node]:',
    '        <span class="kw">if</span> neighbour <span class="kw">not in</span> visited:',
    '          stack.append(neighbour)',
  ],
};

function showCode(algo, line) {
  const lines = GRAPH_CODE[algo] || [];
  const hl    = (line === undefined) ? -1 : line;
  document.getElementById('graph-code').innerHTML = lines
    .map((l, i) => `<div class="code-line${i === hl ? ' active' : ''}">${l}</div>`)
    .join('');
}

function setStatus(msg) { document.getElementById('graph-status').textContent = msg; }

function onAlgoChange() {
  const algo = document.getElementById('algo-select').value;
  document.getElementById('hdr-algo').textContent      = algo.toUpperCase();
  document.getElementById('graph-title').textContent   = algo === 'bfs' ? 'BFS — Breadth-First Search' : 'DFS — Depth-First Search';
  document.getElementById('ds-label').textContent      = algo === 'bfs' ? 'Queue:' : 'Stack:';
  showCode(algo);
  renderGraph({}, {});
}

// ------ SVG Rendering ------
const NODE_R = 22;

// states = { nodeName: 'visiting'|'visited'|'queued'|'start'|'unvisited' }
// edgeStates = { 'A-B': 'traversed' }
function renderGraph(nodeStates, edgeStates) {
  const svg    = document.getElementById('graph-svg');
  const nodes  = currentGraph.nodes;
  const edges  = currentGraph.edges;
  nodeStates   = nodeStates  || {};
  edgeStates   = edgeStates  || {};
  svg.innerHTML = '';

  // Draw edges
  edges.forEach(([u, v]) => {
    const key = [u,v].sort().join('-');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', nodes[u].x); line.setAttribute('y1', nodes[u].y);
    line.setAttribute('x2', nodes[v].x); line.setAttribute('y2', nodes[v].y);
    line.setAttribute('class', 'g-edge' + (edgeStates[key] ? ' ' + edgeStates[key] : ''));
    svg.appendChild(line);
  });

  // Draw nodes
  Object.entries(nodes).forEach(([name, pos]) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'g-node ' + (nodeStates[name] || 'unvisited'));
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => {
      if (!isRunning) {
        document.getElementById('start-node').value = name;
        renderGraph({ [name]: 'start' }, {});
        setStatus('Start node set to ' + name + ' — press ▶ Run');
      }
    });

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r',  NODE_R);
    g.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y);
    text.textContent = name;
    g.appendChild(text);

    svg.appendChild(g);
  });
}

function updateDsDisplay(items, activeIdx) {
  const el = document.getElementById('ds-items');
  el.innerHTML = items.map((item, i) =>
    `<div class="ds-item${i === activeIdx ? ' active' : ''}">${item}</div>`
  ).join('');
}

function updateVisitOrder(visited) {
  document.getElementById('visit-order').innerHTML = visited.map((n, i) =>
    `<div class="trav-val done" style="background:var(--green-light);border:1px solid var(--green);color:var(--green);padding:2px 8px;border-radius:var(--radius);font-family:var(--mono);font-size:12px;font-weight:600">${n}</div>`
  ).join('');
}

// ------ Run ------
async function runTraversal() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById('btn-run').disabled = true;
  document.getElementById('visit-order').innerHTML = '';

  const algo      = document.getElementById('algo-select').value;
  const startNode = document.getElementById('start-node').value;
  logProgress('graph ' + algo);

  if (algo === 'bfs') await doBFS(startNode);
  else                await doDFS(startNode);

  isRunning = false;
  document.getElementById('btn-run').disabled = false;
}

// =============================================================
// BFS
// =============================================================
async function doBFS(start) {
  const visited    = new Set();
  const queue      = [start];
  const visitOrder = [];
  const nodeStates = {};
  const edgeStates = {};
  visited.add(start);
  nodeStates[start] = 'start';

  showCode('bfs', 2);
  renderGraph({ ...nodeStates }, {});
  setStatus('BFS started from node ' + start + ' — queue: [' + start + ']');
  await sleep(getDelay());

  while (queue.length > 0) {
    // Dequeue
    const node = queue.shift();
    visitOrder.push(node);

    nodeStates[node] = 'visiting';
    renderGraph({ ...nodeStates }, { ...edgeStates });
    updateDsDisplay(queue, -1);
    showCode('bfs', 5);
    setStatus('Processing node ' + node + ' — ' + (queue.length ? 'queue: [' + queue.join(', ') + ']' : 'queue empty'));
    await sleep(getDelay());

    nodeStates[node] = 'visited';
    updateVisitOrder(visitOrder);

    // Visit neighbours in alphabetical order for consistency
    const neighbours = (adjList[node] || []).slice().sort();
    for (const nb of neighbours) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        nodeStates[nb] = 'queued';
        const key = [node, nb].sort().join('-');
        edgeStates[key] = 'traversed';
        renderGraph({ ...nodeStates }, { ...edgeStates });
        updateDsDisplay(queue, -1);
        showCode('bfs', 9);
        setStatus('Adding ' + nb + ' to queue — queue: [' + queue.join(', ') + ']');
        await sleep(getDelay() * 0.6);
      }
    }
    renderGraph({ ...nodeStates }, { ...edgeStates });
  }

  setStatus('BFS complete! Visited ' + visitOrder.length + ' nodes in order: ' + visitOrder.join(' → '));
  updateDsDisplay([], -1);
}

// =============================================================
// DFS
// =============================================================
async function doDFS(start) {
  const visited    = new Set();
  const stack      = [start];
  const visitOrder = [];
  const nodeStates = {};
  const edgeStates = {};
  nodeStates[start] = 'start';

  showCode('dfs', 2);
  renderGraph({ ...nodeStates }, {});
  setStatus('DFS started from node ' + start + ' — stack: [' + start + ']');
  await sleep(getDelay());

  while (stack.length > 0) {
    const node = stack.pop();

    if (visited.has(node)) continue;
    visited.add(node);
    visitOrder.push(node);

    nodeStates[node] = 'visiting';
    renderGraph({ ...nodeStates }, { ...edgeStates });
    updateDsDisplay([...stack].reverse(), -1);
    showCode('dfs', 6);
    setStatus('Visiting node ' + node + ' — stack: [' + [...stack].join(', ') + ']');
    await sleep(getDelay());

    nodeStates[node] = 'visited';
    updateVisitOrder(visitOrder);

    // Push neighbours in reverse alphabetical order so we go alphabetical
    const neighbours = (adjList[node] || []).slice().sort().reverse();
    for (const nb of neighbours) {
      if (!visited.has(nb)) {
        stack.push(nb);
        if (nodeStates[nb] !== 'visited') nodeStates[nb] = 'queued';
        const key = [node, nb].sort().join('-');
        edgeStates[key] = 'traversed';
      }
    }
    renderGraph({ ...nodeStates }, { ...edgeStates });
    updateDsDisplay([...stack].reverse(), -1);
    showCode('dfs', 9);
    await sleep(getDelay() * 0.4);
  }

  setStatus('DFS complete! Visited ' + visitOrder.length + ' nodes in order: ' + visitOrder.join(' → '));
  updateDsDisplay([], -1);
}

function resetGraph() {
  isRunning = false;
  document.getElementById('btn-run').disabled  = false;
  document.getElementById('visit-order').innerHTML = '';
  document.getElementById('ds-items').innerHTML = '';
  const algo  = document.getElementById('algo-select').value;
  const start = document.getElementById('start-node').value;
  renderGraph({ [start]: 'start' }, {});
  showCode(algo);
  setStatus('Reset. Press ▶ Run to start traversal.');
}

function loadPreset() {
  const key   = document.getElementById('graph-preset').value;
  currentGraph = PRESETS[key];
  adjList      = buildAdjList(currentGraph.edges);

  // Reset start node selector options to match preset nodes
  const startSel = document.getElementById('start-node');
  startSel.innerHTML = Object.keys(currentGraph.nodes).map(n => `<option>${n}</option>`).join('');

  const nodeCount = Object.keys(currentGraph.nodes).length;
  const edgeCount = currentGraph.edges.length;
  document.getElementById('graph-info').textContent = nodeCount + ' nodes, ' + edgeCount + ' edges';

  resetGraph();
}

document.addEventListener('DOMContentLoaded', function() {
  loadPreset();
  showCode('bfs');
  setStatus('Click any node to set it as the start, then press ▶ Run');
  document.getElementById('speed').addEventListener('input', function() {
    document.getElementById('speed-val').textContent = this.value;
  });
});