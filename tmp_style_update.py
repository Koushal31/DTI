import os

css_content = """/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font: 'Inter', system-ui, -apple-system, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  
  /* Lighter, cleaner background and surface */
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-2: #f1f5f9;
  --surface-3: #e2e8f0;
  
  /* Slate grays for text */
  --text: #0f172a;
  --text-2: #334155;
  --text-3: #64748b;
  
  /* Neater, fainter borders */
  --border: #e2e8f0;
  --border-2: #cbd5e1;
  
  /* A beautiful primary blue */
  --blue: #2563eb;
  --blue-light: #eff6ff;
  --blue-dark: #1d4ed8;
  
  /* Success, Warning, Error */
  --green: #10b981;
  --green-light: #ecfdf5;
  --orange: #f59e0b;
  --orange-light: #fffbeb;
  --red: #ef4444;
  --red-light: #fef2f2;
  
  /* Bar colors */
  --bar-default: #94a3b8;
  --bar-compare: #3b82f6;
  --bar-swap: #f43f5e;
  --bar-sorted: #10b981;
  --bar-pivot: #f59e0b;
  
  /* Heatmap */
  --hm-0: #f1f5f9;
  --hm-1: #9be9a8;
  --hm-2: #40c463;
  --hm-3: #30a14e;
  --hm-4: #216e39;

  /* Modern radii and shadows */
  --radius: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --nav-height: 60px;
}

[data-theme="dark"] {
  /* Rich deep dark mode, not pitch black, pure slate */
  --bg: #0b1120;
  --surface: #1e293b;
  --surface-2: #334155;
  --surface-3: #475569;
  
  --text: #f8fafc;
  --text-2: #cbd5e1;
  --text-3: #94a3b8;
  
  --border: #334155;
  --border-2: #475569;
  
  --blue: #3b82f6;
  --blue-light: rgba(59, 130, 246, 0.15);
  --blue-dark: #60a5fa;

  --green: #34d399;
  --green-light: rgba(52, 211, 153, 0.15);
  
  --orange: #fbbf24;
  --orange-light: rgba(251, 191, 36, 0.15);
  
  --red: #f87171;
  --red-light: rgba(248, 113, 113, 0.15);

  --bar-default: #475569;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.5);
  
  --hm-0: #1e293b;
  --hm-1: #0e4429;
  --hm-2: #006d32;
  --hm-3: #26a641;
  --hm-4: #39d353;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { 
  font-family: var(--font); 
  background: var(--bg); 
  color: var(--text); 
  font-size: 14px; 
  line-height: 1.6; 
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.2s ease, color 0.2s ease; 
}
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: var(--font); outline: none; }
input, select { font-family: var(--font); outline: none; }

/* Navbar */
.navbar { 
  height: var(--nav-height); 
  background: rgba(var(--surface-rgb, 255, 255, 255), 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border); 
  display: flex; 
  align-items: center; 
  padding: 0 24px; 
  position: sticky; 
  top: 0; 
  z-index: 100; 
  box-shadow: var(--shadow-sm); 
}
[data-theme="dark"] .navbar { background: rgba(30, 41, 59, 0.85); }

.nav-logo { 
  font-family: var(--mono); 
  font-size: 16px; 
  font-weight: 600; 
  color: var(--blue); 
  margin-right: 32px; 
  letter-spacing: -0.3px; 
  white-space: nowrap; 
}
.nav-logo span { color: var(--text-2); font-weight: 500; }

.nav-links { display: flex; gap: 4px; flex: 1; list-style: none; }
.nav-links a { 
  padding: 6px 12px; 
  border-radius: var(--radius); 
  font-size: 13px; 
  font-weight: 500;
  color: var(--text-2); 
  transition: all 0.2s ease; 
}
.nav-links a:hover { background: var(--surface-2); color: var(--text); }
.nav-links a.active { background: var(--blue-light); color: var(--blue); font-weight: 600; }

.nav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.theme-btn { 
  width: 34px; height: 34px; 
  border-radius: var(--radius); 
  border: 1px solid var(--border); 
  background: var(--surface-2); 
  color: var(--text-2); 
  font-size: 15px; 
  display: flex; align-items: center; justify-content: center; 
  cursor: pointer; 
  transition: all 0.2s; 
}
.theme-btn:hover { background: var(--surface-3); color: var(--text); transform: translateY(-1px); }
.theme-btn:active { transform: translateY(0); }

/* Buttons */
.btn { 
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; 
  padding: 8px 16px; 
  border: 1px solid var(--border); 
  border-radius: var(--radius); 
  background: var(--surface); 
  color: var(--text-2); 
  font-size: 13px; font-weight: 500; font-family: var(--font); 
  cursor: pointer; white-space: nowrap; 
  transition: all 0.2s ease; 
  box-shadow: var(--shadow-sm);
}
.btn:hover { background: var(--surface-2); border-color: var(--border-2); color: var(--text); transform: translateY(-1px); box-shadow: var(--shadow); }
.btn:active { transform: translateY(0); box-shadow: var(--shadow-sm); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-primary { background: var(--blue); color: #ffffff; border-color: var(--blue); box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
.btn-primary:hover { background: var(--blue-dark); border-color: var(--blue-dark); color: #ffffff; box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3); }

.btn-dark { background: var(--text); color: var(--surface); border-color: var(--text); }
.btn-dark:hover { background: var(--text-2); color: var(--surface); border-color: var(--text-2); }

.btn-sm { padding: 5px 12px; font-size: 12px; }
.btn-lg { padding: 10px 24px; font-size: 14px; border-radius: var(--radius-lg); }

/* Headers/Controls */
.page-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 24px 24px; }
.page-header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-header h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; letter-spacing: -0.5px; }
.page-header p { font-size: 14px; color: var(--text-2); }

.controls-bar { background: var(--surface-2); border-bottom: 1px solid var(--border); padding: 12px 24px; }
.controls-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ctrl-label { font-size: 12px; font-weight: 500; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
.ctrl-input, .ctrl-select { 
  padding: 6px 12px; 
  border: 1px solid var(--border); 
  border-radius: var(--radius); 
  background: var(--surface); 
  color: var(--text); 
  font-size: 13px; font-weight: 500;
  transition: border-color 0.2s, box-shadow 0.2s; 
  cursor: pointer;
}
.ctrl-input:hover, .ctrl-select:hover { border-color: var(--border-2); }
.ctrl-input:focus, .ctrl-select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-light); }
.ctrl-sep { width: 1px; height: 24px; background: var(--border-2); margin: 0 4px; }
input[type="range"].speed-range { width: 90px; accent-color: var(--blue); cursor: pointer; }

/* Main Layout */
.page-body { max-width: 1100px; margin: 0 auto; padding: 24px 24px 80px; }
.card { 
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: var(--radius-xl); 
  overflow: hidden; 
  box-shadow: var(--shadow); 
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.card-header { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--surface-2); }
.card-title { font-size: 14px; font-weight: 600; color: var(--text); }

.two-col { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
.two-col .right { display: flex; flex-direction: column; gap: 20px; }

/* Badges */
.badge { 
  display: inline-flex; align-items: center; 
  padding: 4px 10px; 
  border-radius: 99px; 
  font-size: 11px; font-weight: 600; font-family: var(--mono); 
  border: 1px solid var(--border); 
  background: var(--surface-2); color: var(--text-2); 
}
.badge-blue { background: var(--blue-light); color: var(--blue); border-color: transparent; }
.badge-green { background: var(--green-light); color: var(--green); border-color: transparent; }
.badge-orange { background: var(--orange-light); color: var(--orange); border-color: transparent; }
.badge-red { background: var(--red-light); color: var(--red); border-color: transparent; }

/* View Tabs */
.view-tabs { display: flex; border-bottom: 1px solid var(--border); background: var(--surface); padding: 0 24px; }
.view-tab { 
  padding: 12px 18px; 
  font-size: 13px; font-weight: 500;
  border: none; background: none; 
  color: var(--text-3); 
  border-bottom: 2px solid transparent; margin-bottom: -1px; 
  cursor: pointer; transition: all 0.2s ease; 
}
.view-tab:hover { color: var(--text); }
.view-tab.active { color: var(--blue); border-bottom-color: var(--blue); font-weight: 600; }
.view-content { display: none; }
.view-content.active { display: block; animation: fadeIn 0.3s ease; }

/* Array Visualizations */
.bar-area { padding: 24px 20px 12px; display: flex; align-items: flex-end; }
.bars { display: flex; align-items: flex-end; gap: 4px; width: 100%; height: 180px; }
.bar { 
  flex: 1; min-width: 6px; 
  border-radius: 4px 4px 0 0; 
  background: var(--bar-default); 
  transition: height 0.15s ease-out, background 0.15s; 
  position: relative; 
}
.bar.comparing { background: var(--bar-compare); }
.bar.swapping { background: var(--bar-swap); }
.bar.sorted { background: var(--bar-sorted); }
.bar.pivot { background: var(--bar-pivot); }
.bar-val { 
  position: absolute; top: -20px; left: 50%; transform: translateX(-50%); 
  font-size: 10px; font-weight: 600; color: var(--text-2); font-family: var(--mono); white-space: nowrap; 
}

.legend { display: flex; gap: 16px; flex-wrap: wrap; padding: 12px 20px; border-top: 1px solid var(--border); background: var(--surface-2); }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.legend-box { width: 12px; height: 12px; border-radius: 3px; }
.status-line { 
  padding: 10px 20px; border-top: 1px solid var(--border); 
  font-size: 13px; font-weight: 500; color: var(--text); font-family: var(--mono); 
  min-height: 40px; background: var(--bg); 
}

/* Code block & specific tables */
.code-block { 
  background: #0f172a; padding: 16px 0; 
  font-family: var(--mono); font-size: 12px; font-weight: 500; line-height: 2; 
  max-height: 280px; overflow-y: auto; 
}
.code-line { padding: 0 16px; color: #94a3b8; border-left: 2px solid transparent; transition: background 0.2s, color 0.2s; }
.code-line.active { background: rgba(59, 130, 246, 0.2); color: #e2e8f0; border-left-color: #3b82f6; }
.code-line .kw { color: #cba6f7; }
.code-line .fn { color: #89b4fa; }
.code-line .cm { color: #64748b; }

.complexity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; }
.complexity-item { padding: 12px 16px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius); }
.complexity-label { font-size: 11px; font-weight: 600; color: var(--text-3); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.complexity-value { font-size: 14px; font-weight: 600; font-family: var(--mono); color: var(--text); }

.bigo-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.bigo-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); background: var(--surface-2); border-bottom: 1px solid var(--border); }
.bigo-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-2); }
.bigo-table tr:last-child td { border-bottom: none; }
.bigo-table tr.highlight td { background: var(--blue-light); }
.bigo-table td:first-child { font-weight: 500; color: var(--text); }
.mono { font-family: var(--mono); font-size: 12px; font-weight: 500; }

.info-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.info-table td { padding: 10px 16px; border-bottom: 1px solid var(--border); }
.info-table tr:last-child td { border-bottom: none; }
.info-table td:first-child { color: var(--text-2); font-weight: 500; }
.info-table td:last-child { font-family: var(--mono); font-size: 12px; font-weight: 600; text-align: right; color: var(--text); }

.how-summary { font-size: 14px; color: var(--text-2); line-height: 1.7; padding: 16px 20px 8px; }
.how-list { padding: 0 20px 20px; }
.how-item { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.how-item:last-child { border-bottom: none; }
.how-num { 
  width: 26px; height: 26px; 
  border-radius: 50%; 
  background: var(--blue-light); color: var(--blue); 
  display: flex; align-items: center; justify-content: center; 
  font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; 
}
.how-text { font-size: 14px; color: var(--text-2); line-height: 1.6; }
.how-text strong { color: var(--text); font-weight: 600; }

/* Linked List */
.ll-canvas { padding: 40px 20px; min-height: 140px; overflow-x: auto; display: flex; align-items: center; }
.ll-nodes { display: flex; align-items: center; gap: 0; min-width: max-content; }
.ll-node-wrap { display: flex; align-items: center; }
.ll-node { 
  min-width: 60px; height: 50px; 
  border: 2px solid var(--border-2); border-radius: var(--radius); 
  background: var(--surface); 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  position: relative; transition: all 0.2s ease; 
  box-shadow: var(--shadow-sm); 
}
.ll-node .node-val { font-size: 15px; font-weight: 700; font-family: var(--mono); color: var(--text); }
.ll-node .node-idx { font-size: 10px; color: var(--text-3); font-weight: 500; margin-top: 2px; }
.ll-node.hl { border-color: var(--blue); background: var(--blue-light); box-shadow: 0 0 0 4px var(--blue-light); }
.ll-node.hl .node-val { color: var(--blue); }
.ll-node.rm { border-color: var(--red); background: var(--red-light); opacity: 0.5; }
.ll-node.nw { border-style: dashed; border-color: var(--green); background: var(--green-light); box-shadow: 0 0 0 4px var(--green-light); }
.ll-node.nw .node-val { color: var(--green); }
.ll-head-lbl, .ll-tail-lbl { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 700; color: var(--blue); font-family: var(--mono); letter-spacing: 0.08em; white-space: nowrap; }
.ll-tail-lbl { color: var(--green); }
.ll-arrow { color: var(--text-3); font-size: 16px; padding: 0 8px; font-weight: bold; }
.ll-null { font-size: 12px; font-weight: 600; color: var(--text-3); font-family: var(--mono); border: 2px dashed var(--border-2); border-radius: var(--radius); padding: 4px 10px; }
.ll-empty { font-size: 14px; font-weight: 500; color: var(--text-3); width: 100%; text-align: center; padding: 30px; }
.op-tabs { display: flex; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--border); flex-wrap: wrap; background: var(--surface-2); }
.op-tab { padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 500; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); cursor: pointer; transition: all 0.2s; }
.op-tab:hover { background: var(--surface-3); color: var(--text); }
.op-tab.active { background: var(--blue); color: #fff; border-color: var(--blue); }

/* Stack / Queue */
.stack-visual { padding: 30px; display: flex; flex-direction: column; align-items: center; min-height: 280px; }
.stack-items { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; max-width: 200px; }
.stack-item { width: 100%; padding: 12px 16px; border: 2px solid var(--border-2); border-radius: var(--radius); background: var(--surface); display: flex; align-items: center; justify-content: space-between; font-size: 15px; font-weight: 700; font-family: var(--mono); transition: all 0.2s; position: relative; box-shadow: var(--shadow-sm); }
.stack-item.is-top { border-color: var(--blue); background: var(--blue-light); color: var(--blue); }
.stack-item.pushing { border-style: dashed; border-color: var(--green); animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.stack-item.popping { opacity: 0.3; animation: slideRight 0.35s ease forwards; }
.stack-item.peeking { border-color: var(--orange); background: var(--orange-light); }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px) scale(0.9); } to { opacity: 1; transform: none; } }
@keyframes slideRight { to { opacity: 0; transform: translateX(50px) scale(0.9); } }
.stack-item-idx { font-size: 11px; color: var(--text-3); font-weight: 500; }
.stack-top-label { position: absolute; right: -50px; top: 50%; transform: translateY(-50%); font-size: 10px; color: var(--blue); font-family: var(--mono); font-weight: 700; text-transform: uppercase; }
.stack-base { width: 100%; max-width: 220px; height: 4px; background: var(--border-2); border-radius: 2px; margin-top: 6px; }
.stack-empty { font-size: 14px; font-weight: 500; color: var(--text-3); padding: 50px 0; text-align: center; }

.queue-visual { padding: 40px 20px 24px; overflow-x: auto; }
.queue-items { display: flex; align-items: center; gap: 4px; min-height: 80px; flex-wrap: nowrap; margin-top: 12px; }
.queue-item { min-width: 64px; height: 64px; flex-shrink: 0; border: 2px solid var(--border-2); border-radius: var(--radius); background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; font-family: var(--mono); transition: all 0.2s; position: relative; box-shadow: var(--shadow-sm); }
.queue-item .q-idx { font-size: 10px; color: var(--text-3); font-weight: 500; margin-top: 2px; }
.queue-item .q-label { position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 700; color: var(--text-3); font-family: var(--mono); white-space: nowrap; text-transform: uppercase; }
.queue-item.is-front { border-color: var(--blue); background: var(--blue-light); color: var(--blue); }
.queue-item.is-rear { border-style: dashed; border-color: var(--text-3); }
.queue-item.enqueueing { border-style: dashed; border-color: var(--green); animation: slideLeft 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.queue-item.dequeueing { opacity: 0.3; animation: slideOut 0.35s ease forwards; }
.queue-item.peeking { border-color: var(--orange); background: var(--orange-light); }
@keyframes slideLeft { from { opacity: 0; transform: translateX(20px) scale(0.9); } to { opacity: 1; transform: none; } }
@keyframes slideOut { to { opacity: 0; transform: translateX(-50px) scale(0.9); } }
.queue-arrow { color: var(--text-3); font-size: 16px; font-weight: bold; flex-shrink: 0; }
.queue-empty { font-size: 14px; font-weight: 500; color: var(--text-3); padding: 24px; }

/* Login */
.login-page { min-height: calc(100vh - var(--nav-height)); display: flex; align-items: center; justify-content: center; padding: 40px 16px; background: linear-gradient(135deg, var(--bg) 0%, var(--surface-2) 100%); }
.login-card { width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-md); position: relative; z-index: 10; }
/* Adding a subtle glowing behind the login card */
.login-page::before {
  content: ''; position: absolute; width: 300px; height: 300px; 
  background: var(--blue); filter: blur(100px); opacity: 0.15; 
  z-index: 1; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);
}
.login-logo { font-family: var(--mono); font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 6px; color: var(--blue); letter-spacing: -0.5px; }
.login-sub { font-size: 13px; color: var(--text-3); text-align: center; margin-bottom: 32px; font-weight: 500; }
.auth-tabs { display: flex; background: var(--surface-2); border-radius: var(--radius-lg); padding: 4px; margin-bottom: 24px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
.auth-tab { flex: 1; padding: 10px; border: none; border-radius: calc(var(--radius-lg) - 4px); background: none; font-size: 14px; font-weight: 600; font-family: var(--font); color: var(--text-3); cursor: pointer; transition: all 0.2s ease; }
.auth-tab.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }
.form-group { margin-bottom: 18px; }
.form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; }
.form-input { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); font-size: 14px; font-family: var(--font); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.form-input:focus { border-color: var(--blue); box-shadow: 0 0 0 4px var(--blue-light); }
.form-btn { width: 100%; padding: 12px; border: none; border-radius: var(--radius); background: var(--blue); color: #fff; font-size: 14px; font-weight: 600; font-family: var(--font); cursor: pointer; margin-top: 8px; transition: all 0.2s; box-shadow: 0 4px 10px rgba(37,99,235,0.2); }
.form-btn:hover { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 6px 14px rgba(37,99,235,0.3); }
.form-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.form-section { display: none; animation: fadeIn 0.4s ease; }
.form-section.active { display: block; }

.alert { padding: 12px 16px; border-radius: var(--radius); font-size: 14px; font-weight: 500; margin-bottom: 18px; display: none; }
.alert.show { display: block; animation: fadeIn 0.3s; }
.alert-error { background: var(--red-light); border: 1px solid rgba(239,68,68,0.3); color: var(--red); }
.alert-success { background: var(--green-light); border: 1px solid rgba(16,185,129,0.3); color: var(--green); }

/* Profile Page */
.profile-page { max-width: 900px; margin: 0 auto; padding: 32px 24px 80px; display: flex; flex-direction: column; gap: 24px; }
.profile-header-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 32px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; box-shadow: var(--shadow-md); position: relative; overflow: hidden; }
.profile-header-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, var(--blue), #a855f7); } /* Brand accent */
.profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--blue-dark)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; flex-shrink: 0; box-shadow: 0 6px 12px rgba(37,99,235,0.3); }
.profile-info { flex: 1; min-width: 200px; }
.profile-name { font-size: 22px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.5px; }
.profile-email { font-size: 13px; color: var(--text-3); font-family: var(--mono); }
.profile-since { font-size: 12px; color: var(--text-3); font-weight: 500; margin-top: 6px; }
.profile-stat-row { display: flex; gap: 0; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; align-self: flex-start; background: var(--surface-2); box-shadow: var(--shadow-sm); }
.pstat { padding: 12px 24px; text-align: center; border-right: 1px solid var(--border); background: var(--surface); transition: background 0.2s; cursor: default; }
.pstat:hover { background: var(--surface-2); }
.pstat:last-child { border-right: none; }
.pstat-num { font-size: 24px; font-weight: 700; font-family: var(--mono); color: var(--blue); }
.pstat-lbl { font-size: 11px; font-weight: 600; color: var(--text-3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }

.profile-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow 0.2s; }
.profile-section:hover { box-shadow: var(--shadow-md); }
.section-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--surface-2); }
.section-title { font-size: 15px; font-weight: 600; color: var(--text); }

/* Heatmap */
.heatmap-wrap { padding: 24px; overflow-x: auto; }
.hm-cell { border-radius: 3px; background: var(--hm-0); cursor: pointer; transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s; }
.hm-cell:hover { transform: scale(1.5); z-index: 10; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
.hm-cell.l1 { background: var(--hm-1); }
.hm-cell.l2 { background: var(--hm-2); }
.hm-cell.l3 { background: var(--hm-3); }
.hm-cell.l4 { background: var(--hm-4); }
.hm-cell.future { opacity: 0.1; cursor: default; pointer-events: none; }
.hm-cell.is-today { outline: 2px solid var(--blue); outline-offset: 1px; }

#hm-tooltip { position: fixed; background: #0f172a; color: #f8fafc; font-family: var(--mono); font-size: 12px; font-weight: 500; padding: 6px 12px; border-radius: va(--radius); white-space: nowrap; pointer-events: none; z-index: 9999; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); display: none; }
#hm-tooltip.show { display: block; animation: fadeIn 0.2s; }

.cal-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 20px; }
.cal-day { width: 36px; height: 36px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface-2); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; font-family: var(--mono); color: var(--text-3); transition: all 0.2s; }
.cal-day:hover { border-color: var(--border-2); }
.cal-day.was-active { background: var(--green-light); color: var(--green); border-color: rgba(16,185,129,0.3); }
.cal-day.is-today { border-color: var(--blue); color: var(--blue); box-shadow: 0 0 0 2px var(--blue-light); }

.progress-list { padding: 8px 0; }
.progress-item { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid var(--border); transition: background 0.2s; }
.progress-item:hover { background: var(--surface-2); }
.progress-item:last-child { border-bottom: none; }
.progress-name { font-size: 14px; font-weight: 600; color: var(--text); min-width: 160px; }
.progress-sub { font-size: 12px; font-weight: 500; color: var(--text-3); }
.progress-bar { flex: 1; height: 6px; background: var(--surface-3); border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--blue), #a855f7); border-radius: 99px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
.progress-date { font-size: 12px; font-weight: 500; color: var(--text-3); min-width: 80px; text-align: right; }

.timeline { padding: 12px 20px 20px; }
.tl-item { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; border-bottom: 1px dashed var(--border); position: relative; }
.tl-item::before { content: ''; position: absolute; left: 4px; top: 32px; bottom: -12px; width: 2px; background: var(--border); z-index: 1; }
.tl-item:last-child::before { display: none; }
.tl-item:last-child { border-bottom: none; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border-2); flex-shrink: 0; margin-top: 5px; z-index: 2; border: 2px solid var(--surface); outline: 2px solid var(--surface); box-sizing: content-box; }
.tl-dot.recent { background: var(--blue); box-shadow: 0 0 0 3px var(--blue-light); }
.tl-algo { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
.tl-action { font-size: 12px; font-weight: 500; color: var(--text-3); }
.tl-time { font-size: 12px; font-weight: 600; color: var(--text-3); font-family: var(--mono); margin-left: auto; }

.badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; padding: 20px; }
.badge-card { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 16px; text-align: center; background: var(--surface-2); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.badge-card.earned { background: var(--surface); border-color: var(--border-2); box-shadow: var(--shadow); cursor: pointer; }
.badge-card.earned:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--blue); }
.badge-card.locked { opacity: 0.5; filter: grayscale(1); }
.badge-icon { font-size: 32px; margin-bottom: 12px; display: inline-block; transition: transform 0.2s; }
.badge-card.earned:hover .badge-icon { transform: scale(1.1); }
.badge-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; color: var(--text); }
.badge-desc { font-size: 11px; font-weight: 500; color: var(--text-3); line-height: 1.5; }
.badge-locked-text { font-size: 11px; font-weight: 600; color: var(--text-3); margin-top: 6px; text-transform: uppercase; letter-spacing: 0.05em; }

.login-prompt { text-align: center; padding: 80px 24px; }
.login-prompt h2 { font-size: 22px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.5px; }
.login-prompt p { font-size: 15px; font-weight: 500; color: var(--text-2); margin-bottom: 24px; }

/* Practice Page Specifics */
.diff-badge { padding: 4px 10px; border-radius: var(--radius); font-size: 11px; font-weight: 700; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; }
.diff-easy { background: var(--green-light); color: var(--green); }
.diff-medium { background: var(--orange-light); color: var(--orange); }
.diff-hard { background: var(--red-light); color: var(--red); }

/* Globals/Utilities */
.footer { border-top: 1px solid var(--border); padding: 24px; text-align: center; font-size: 13px; font-weight: 500; color: var(--text-3); font-family: var(--font); background: var(--surface); }

.mt-16 { margin-top: 16px; }
.mt-20 { margin-top: 20px; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.fade-in { animation: fadeIn 0.4s ease both; }

@media(max-width: 820px) {
  .two-col { grid-template-columns: 1fr; }
  .compare-grid { grid-template-columns: 1fr; }
  .navbar { padding: 0 16px; }
  .nav-links { display: none; }
  .page-body, .profile-page { padding: 16px 16px 60px; }
  .profile-stat-row { width: 100%; }
}
@media(max-width: 480px) {
  .pstat { padding: 10px; }
}

.trav-val { display: inline-flex; align-items: center; justify-content: center; min-width: 36px; height: 30px; padding: 0 10px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; font-weight: 700; font-family: var(--mono); transition: all 0.2s; box-shadow: var(--shadow-sm); }
.trav-val.current { background: var(--blue-light); border-color: var(--blue); color: var(--blue); box-shadow: 0 0 0 3px var(--blue-light); }
.trav-val.done { background: var(--green-light); border-color: var(--green); color: var(--green); }
"""

with open("c:/programs/saved/DTI PROJECT/project/frontend/css/style.css", "w", encoding="utf-8") as f:
    f.write(css_content)
