import os
import glob
import re

html_files = glob.glob('frontend/*.html')

NAV_TEMPLATE = """<nav class="navbar">
  <a class="nav-logo" href="index.html">DSA Visualizer</a>
  <ul class="nav-links">
    <li><a href="index.html" class="{index_active}">Home</a></li>
    <li><a href="sorting.html" class="{sorting_active}">Sorting</a></li>
    <li><a href="searching.html" class="{searching_active}">Searching</a></li>
    <li><a href="trees.html" class="{trees_active}">Trees</a></li>
    <li><a href="graphs.html" class="{graphs_active}">Graphs</a></li>
    <li><a href="hashing.html" class="{hashing_active}">Hashing</a></li>
    <li><a href="linked-list.html" class="{linked_list_active}">Linked List</a></li>
    <li><a href="stack.html" class="{stack_active}">Stack</a></li>
    <li><a href="queue.html" class="{queue_active}">Queue</a></li>
    <li><a href="practice.html" class="{practice_active}">Practice</a></li>
  </ul>
  <div class="nav-right" id="nav-right"></div>
  <button class="theme-btn" id="theme-toggle" title="Toggle theme">☾</button>
</nav>"""

FOOTER_TEMPLATE = """<footer class="footer">DSA Visualizer — Learn Algorithms Step by Step</footer>"""

def get_nav_for_file(filename):
    basename = os.path.basename(filename)
    name = basename.split('.')[0]
    
    # Handle the underscore/dash issue (linked-list)
    key = name.replace('-', '_') + '_active'
    
    kwargs = {
        'index_active': '', 'sorting_active': '', 'searching_active': '',
        'trees_active': '', 'graphs_active': '', 'hashing_active': '',
        'linked_list_active': '', 'stack_active': '', 'queue_active': '',
        'practice_active': ''
    }
    
    if key in kwargs:
        kwargs[key] = 'active'
        
    # Clean up empty classes
    nav = NAV_TEMPLATE.format(**kwargs)
    nav = nav.replace(' class=""', '')
    return nav

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Navbar
    # It might span multiple lines, so we use regex with re.DOTALL
    nav_pattern = r'<nav class="navbar">.*?</nav>'
    content = re.sub(nav_pattern, get_nav_for_file(file), content, flags=re.DOTALL)
    
    # Replace Footer
    footer_pattern = r'<footer class="footer">.*?</footer>'
    content = re.sub(footer_pattern, FOOTER_TEMPLATE, content, flags=re.DOTALL)
    
    # Write back
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated all HTML files!")
