import os
import re

FRONTEND_DIR = r"c:\programs\saved\DTI PROJECT\project\frontend"

STANDARD_NAV = """<nav class="navbar">
  <a class="nav-logo" href="index.html">DSA Visualizer</a>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="sorting.html">Sorting</a></li>
    <li><a href="searching.html">Searching</a></li>
    <li><a href="trees.html">Trees</a></li>
    <li><a href="graphs.html">Graphs</a></li>
    <li><a href="hashing.html">Hashing</a></li>
    <li><a href="linked-list.html">Linked List</a></li>
    <li><a href="stack.html">Stack</a></li>
    <li><a href="queue.html">Queue</a></li>
    <li><a href="practice.html">Practice</a></li>
  </ul>
  <div class="nav-right" id="nav-right"></div>
  <button class="theme-btn" id="theme-toggle" style="margin-left:8px" title="Toggle theme">☾</button>
</nav>"""

# Update all HTML files
for filename in os.listdir(FRONTEND_DIR):
    if not filename.endswith(".html"):
        continue
    filepath = os.path.join(FRONTEND_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace navbar
    new_content = re.sub(
        r'<nav class="navbar">.*?</nav>', 
        STANDARD_NAV, 
        content, 
        flags=re.DOTALL
    )
    
    # Add active class if current page
    active_li = f'<li><a href="{filename}">{(filename.replace(".html", "").replace("-", " ").title())}</a></li>'
    if filename == "index.html":
        active_li_target = '<li><a href="index.html" class="active">Home</a></li>'
        new_content = new_content.replace('<li><a href="index.html">Home</a></li>', active_li_target)
    else:
        # crude active class replacement (just finding the exact href line and appending class="active")
        line_to_find = f'<li><a href="{filename}">'
        if line_to_find in new_content:
            new_content = new_content.replace(line_to_find, f'<li><a href="{filename}" class="active">')

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filename}")

print("Done inserting Practice link.")
