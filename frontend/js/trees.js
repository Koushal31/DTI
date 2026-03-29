// =============================================================
// trees.js  –  Binary Search Tree visualizer.
// Renders the tree as SVG, supports insert / search / delete
// and four traversals: inorder, preorder, postorder, level-order.
// Layout algorithm inspired by Reingold–Tilford (simplified).
// =============================================================

// ------ BST Node ------
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left  = null;
    this.right = null;
    // Visual position (set during layout)
    this.x = 0;
    this.y = 0;
  }
}

// ------ BST ------
class BST {
  constructor() { this.root = null; this.size = 0; }

  insert(value) {
    const node = new BSTNode(value);
    if (!this.root) { this.root = node; this.size++; return true; }
    let cur = this.root;
    while (true) {
      if (value === cur.value) return false; // duplicate — skip
      if (value < cur.value) {
        if (!cur.left)  { cur.left  = node; this.size++; return true; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; this.size++; return true; }
        cur = cur.right;
      }
    }
  }

  // Returns the path of nodes visited while searching for `value`
  searchPath(value) {
    const path = [];
    let cur = this.root;
    while (cur) {
      path.push(cur);
      if (value === cur.value) return { path, found: cur };
      cur = value < cur.value ? cur.left : cur.right;
    }
    return { path, found: null };
  }

  delete(value) {
    this.root = this._deleteNode(this.root, value);
  }
  _deleteNode(node, value) {
    if (!node) return null;
    if (value < node.value)      node.left  = this._deleteNode(node.left, value);
    else if (value > node.value) node.right = this._deleteNode(node.right, value);
    else {
      this.size--;
      if (!node.left)  return node.right;
      if (!node.right) return node.left;
      // Two children: replace with inorder successor
      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.value = successor.value;
      this.size++;
      node.right = this._deleteNode(node.right, successor.value);
    }
    return node;
  }

  inorder()    { const r = []; this._in(this.root, r);    return r; }
  preorder()   { const r = []; this._pre(this.root, r);   return r; }
  postorder()  { const r = []; this._post(this.root, r);  return r; }
  levelorder() {
    if (!this.root) return [];
    const result = [], queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      result.push(node);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }
  _in  (n, r) { if (!n) return; this._in(n.left, r);  r.push(n); this._in(n.right, r);  }
  _pre (n, r) { if (!n) return; r.push(n); this._pre(n.left, r); this._pre(n.right, r);  }
  _post(n, r) { if (!n) return; this._post(n.left, r); this._post(n.right, r); r.push(n);}
}

// ------ State ------
const bst      = new BST();
let   running  = false;
const sleep    = ms => new Promise(r => setTimeout(r, ms));
const getDelay = () => Math.max(300, 1200 - parseInt(document.getElementById('speed').value, 10) * 100);

// ------ Pseudocode ------
const TREE_CODE = {
  insert: [
    '<span class="kw">def</span> <span class="fn">insert</span>(self, value):',
    '  <span class="kw">if not</span> self.root: self.root = Node(value); <span class="kw">return</span>',
    '  cur = self.root',
    '  <span class="kw">while True</span>:',
    '    <span class="kw">if</span> value < cur.value:',
    '      <span class="kw">if not</span> cur.left: cur.left = Node(value); <span class="kw">return</span>',
    '      cur = cur.left',
    '    <span class="kw">else</span>:',
    '      <span class="kw">if not</span> cur.right: cur.right = Node(value); <span class="kw">return</span>',
    '      cur = cur.right',
  ],
  search: [
    '<span class="kw">def</span> <span class="fn">search</span>(self, value):',
    '  cur = self.root',
    '  <span class="kw">while</span> cur:',
    '    <span class="kw">if</span>   value == cur.value: <span class="kw">return</span> cur',
    '    <span class="kw">elif</span> value < cur.value:  cur = cur.left',
    '    <span class="kw">else</span>:                    cur = cur.right',
    '  <span class="kw">return</span> None',
  ],
  delete: [
    '<span class="kw">def</span> <span class="fn">delete</span>(self, value):',
    '  <span class="cm"># Find the node and its parent</span>',
    '  <span class="kw">if</span> node has no children: remove it',
    '  <span class="kw">if</span> node has one child: replace with child',
    '  <span class="kw">if</span> node has two children:',
    '    successor = min(node.right subtree)',
    '    node.value = successor.value',
    '    delete successor from right subtree',
  ],
  inorder: [
    '<span class="kw">def</span> <span class="fn">inorder</span>(node):',
    '  <span class="kw">if</span> node <span class="kw">is</span> None: <span class="kw">return</span>',
    '  inorder(node.left)   <span class="cm"># go left first</span>',
    '  visit(node)          <span class="cm"># then visit</span>',
    '  inorder(node.right)  <span class="cm"># then right</span>',
  ],
  preorder: [
    '<span class="kw">def</span> <span class="fn">preorder</span>(node):',
    '  <span class="kw">if</span> node <span class="kw">is</span> None: <span class="kw">return</span>',
    '  visit(node)          <span class="cm"># visit first</span>',
    '  preorder(node.left)',
    '  preorder(node.right)',
  ],
  postorder: [
    '<span class="kw">def</span> <span class="fn">postorder</span>(node):',
    '  <span class="kw">if</span> node <span class="kw">is</span> None: <span class="kw">return</span>',
    '  postorder(node.left)',
    '  postorder(node.right)',
    '  visit(node)          <span class="cm"># visit last</span>',
  ],
  levelorder: [
    '<span class="kw">def</span> <span class="fn">level_order</span>(root):',
    '  queue = [root]',
    '  <span class="kw">while</span> queue:',
    '    node = queue.pop(0)',
    '    visit(node)',
    '    <span class="kw">if</span> node.left:  queue.append(node.left)',
    '    <span class="kw">if</span> node.right: queue.append(node.right)',
  ],
};

function showCode(op, line) {
  const lines = TREE_CODE[op] || [];
  const hl    = (line === undefined) ? -1 : line;
  document.getElementById('tree-code').innerHTML = lines
    .map((l, i) => `<div class="code-line${i === hl ? ' active' : ''}">${l}</div>`)
    .join('');
  document.getElementById('tree-op-badge').textContent = op;
}

function setStatus(msg) { document.getElementById('tree-status').textContent = msg; }
function setSize()      { document.getElementById('tree-size').textContent = bst.size + ' node' + (bst.size !== 1 ? 's' : ''); }

function setActiveTab(id) {
  document.querySelectorAll('.op-tab').forEach(t => t.classList.remove('active'));
  const el = document.getElementById('tab-' + id);
  if (el) el.classList.add('active');
}

// =============================================================
// SVG TREE RENDERING
// =============================================================
const NODE_R   = 22;   // circle radius
const H_GAP    = 50;   // horizontal space between sibling subtrees
const V_GAP    = 60;   // vertical distance between levels

// Assigns (x, y) to every node using a simple recursive width algorithm.
// Returns the total width of the subtree rooted at `node`.
function layoutTree(node, depth, leftOffset) {
  if (!node) return 0;

  const leftWidth  = layoutTree(node.left,  depth + 1, leftOffset);
  const rightWidth = layoutTree(node.right, depth + 1, leftOffset + leftWidth + (leftWidth > 0 ? H_GAP : 0));

  // Centre this node over its children
  const myX = leftOffset + leftWidth + (leftWidth > 0 ? H_GAP / 2 : 0);
  node.x = myX;
  node.y = depth * V_GAP + NODE_R + 30; // +30 for top padding

  return leftWidth + (leftWidth > 0 ? H_GAP : 0) + rightWidth + (rightWidth > 0 ? H_GAP : 0);
}

// Simpler layout that gives each leaf its own slot, then centres parents.
function computeLayout(root) {
  if (!root) return;

  // Inorder position counter
  let counter = 0;
  function assignX(node, depth) {
    if (!node) return;
    assignX(node.left,  depth + 1);
    node.x = counter * (NODE_R * 2 + H_GAP) + NODE_R + 10;
    node.y = depth * V_GAP + NODE_R + 30;
    counter++;
    assignX(node.right, depth + 1);
  }
  assignX(root, 0);
}

function renderTree(highlightMap) {
  const svg = document.getElementById('tree-svg');
  svg.innerHTML = '';
  if (!bst.root) return;
  highlightMap = highlightMap || {};

  computeLayout(bst.root);

  // Figure out bounding box
  let maxX = 0, maxY = 0;
  function dims(n) {
    if (!n) return;
    maxX = Math.max(maxX, n.x + NODE_R + 10);
    maxY = Math.max(maxY, n.y + NODE_R + 10);
    dims(n.left); dims(n.right);
  }
  dims(bst.root);
  svg.setAttribute('viewBox', '0 0 ' + Math.max(maxX, 400) + ' ' + Math.max(maxY, 200));
  svg.style.height = Math.max(maxY + 20, 200) + 'px';

  // Draw edges first (behind nodes)
  function drawEdges(node) {
    if (!node) return;
    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x); line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x); line.setAttribute('y2', node.left.y);
      line.setAttribute('class', 'tree-edge' + (highlightMap[node.left.value] === 'path' ? ' active' : ''));
      svg.appendChild(line);
      drawEdges(node.left);
    }
    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x); line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x); line.setAttribute('y2', node.right.y);
      line.setAttribute('class', 'tree-edge' + (highlightMap[node.right.value] === 'path' ? ' active' : ''));
      svg.appendChild(line);
      drawEdges(node.right);
    }
  }
  drawEdges(bst.root);

  // Draw nodes on top
  function drawNodes(node) {
    if (!node) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'tree-node ' + (highlightMap[node.value] || ''));

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r',  NODE_R);
    g.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y);
    text.textContent = node.value;
    g.appendChild(text);

    svg.appendChild(g);
    drawNodes(node.left);
    drawNodes(node.right);
  }
  drawNodes(bst.root);
}

// =============================================================
// OPERATIONS
// =============================================================

async function bstInsert() {
  if (running) return;
  const val = parseInt(document.getElementById('node-val').value, 10);
  if (isNaN(val)) { setStatus('Enter a number to insert'); return; }

  setActiveTab('insert');
  showCode('insert');

  // Animate the search path before inserting
  let cur = bst.root;
  const visited = {};
  showCode('insert', 2);

  while (cur) {
    visited[cur.value] = 'path';
    renderTree({ ...visited });
    setStatus('Traversing: ' + val + ' vs ' + cur.value + ' → go ' + (val < cur.value ? 'left' : 'right'));
    await sleep(getDelay());

    if (val === cur.value) {
      setStatus(val + ' already exists in the tree'); running = false; return;
    }
    showCode('insert', val < cur.value ? 4 : 7);
    cur = val < cur.value ? cur.left : cur.right;
  }

  bst.insert(val);
  setSize();
  const newVisited = { ...visited };
  newVisited[val] = 'found';
  renderTree(newVisited);
  setStatus('Inserted ' + val + ' into the BST ✅');
  await sleep(getDelay());
  renderTree({});
}

async function bstSearch() {
  if (running) return;
  const val = parseInt(document.getElementById('node-val').value, 10);
  if (isNaN(val)) { setStatus('Enter a number to search for'); return; }

  setActiveTab('search');
  showCode('search');
  running = true;

  const highlight = {};
  let cur = bst.root;

  while (cur) {
    highlight[cur.value] = 'visiting';
    renderTree({ ...highlight });
    showCode('search', 2);
    setStatus('Checking node ' + cur.value + ' … ' + (val === cur.value ? 'found!' : val < cur.value ? 'go left' : 'go right'));
    await sleep(getDelay());

    if (val === cur.value) {
      highlight[cur.value] = 'found';
      renderTree({ ...highlight });
      showCode('search', 3);
      setStatus('✅ Found ' + val + ' in the BST!');
      running = false;
      await sleep(getDelay() * 2);
      renderTree({});
      return;
    }
    highlight[cur.value] = 'path';
    cur = val < cur.value ? cur.left : cur.right;
  }

  showCode('search', 6);
  setStatus('❌ ' + val + ' is not in the BST');
  running = false;
  await sleep(getDelay());
  renderTree({});
}

async function bstDelete() {
  if (running) return;
  const val = parseInt(document.getElementById('node-val').value, 10);
  if (isNaN(val)) { setStatus('Enter a number to delete'); return; }

  setActiveTab('delete');
  showCode('delete');
  running = true;

  // Animate search first
  const highlight = {};
  let cur = bst.root;
  while (cur) {
    highlight[cur.value] = 'visiting';
    renderTree({ ...highlight });
    setStatus('Looking for ' + val + ' — at node ' + cur.value);
    await sleep(getDelay());
    if (val === cur.value) break;
    highlight[cur.value] = 'path';
    cur = val < cur.value ? cur.left : cur.right;
  }

  if (!cur) {
    setStatus('❌ ' + val + ' not found — cannot delete');
    renderTree({});
    running = false;
    return;
  }

  // Mark it for deletion
  highlight[cur.value] = 'found';
  renderTree({ ...highlight });
  setStatus('Deleting ' + val + '...');
  await sleep(getDelay());

  bst.delete(val);
  setSize();
  renderTree({});
  setStatus('Deleted ' + val + ' from the BST ✅');
  running = false;
}

async function bstTraverse(type) {
  if (running || !bst.root) {
    if (!bst.root) setStatus('Tree is empty — insert some nodes first');
    return;
  }
  running = true;
  setActiveTab('traversal');
  showCode(type);

  const order = type === 'levelorder'
    ? bst.levelorder()
    : type === 'inorder'    ? bst.inorder()
    : type === 'preorder'   ? bst.preorder()
    : bst.postorder();

  // Show traversal result boxes
  const resultEl = document.getElementById('traversal-result');
  const valEl    = document.getElementById('trav-values');
  const labelEl  = document.getElementById('trav-label');
  resultEl.style.display = 'flex';
  labelEl.textContent    = type.charAt(0).toUpperCase() + type.slice(1) + ' order:';

  valEl.innerHTML = order.map(n =>
    `<div class="trav-val" data-v="${n.value}">${n.value}</div>`
  ).join('');

  const highlight = {};
  for (let i = 0; i < order.length; i++) {
    const node = order[i];
    highlight[node.value] = 'visiting';
    renderTree({ ...highlight });

    // Highlight current result box
    document.querySelectorAll('.trav-val').forEach((el, idx) => {
      el.className = 'trav-val' + (idx < i ? ' done' : idx === i ? ' current' : '');
    });

    setStatus('Visiting ' + node.value + ' (' + type + ': step ' + (i+1) + ' of ' + order.length + ')');
    await sleep(getDelay());
    highlight[node.value] = 'path';
  }

  renderTree({});
  document.querySelectorAll('.trav-val').forEach(el => el.className = 'trav-val done');
  setStatus(type.charAt(0).toUpperCase() + type.slice(1) + ' traversal complete!');
  running = false;
}

function bstReset() {
  running = false;
  bst.root = null; bst.size = 0;
  renderTree({});
  setSize();
  document.getElementById('traversal-result').style.display = 'none';
  setStatus('Tree cleared. Insert some values to start — try: 50, 30, 70, 20, 40, 60, 80');
  showCode('insert');
  setActiveTab('insert');
}

// Default tree on load
document.addEventListener('DOMContentLoaded', function() {
  [50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));
  setSize();
  renderTree({});
  showCode('insert');
  setStatus('Default tree loaded. Try inserting, searching or running a traversal!');
  document.getElementById('speed').addEventListener('input', function() {
    document.getElementById('speed-val').textContent = this.value;
  });
  document.getElementById('node-val').addEventListener('keydown', e => {
    if (e.key === 'Enter') bstInsert();
  });
});