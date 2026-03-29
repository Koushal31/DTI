# DSAViz - Data Structures & Algorithms Visualizer

**DSAViz** is a full-stack educational platform built to demystify computer science fundamentals. It provides real-time, step-by-step visual execution of popular algorithms, coupled with a dense database of LeetCode-style practice problems and user-activity tracking mechanisms.

The core philosophy of this project is accessibility — the code is explicitly designed ("humanized") to avoid hyper-dense abstraction so that students and junior engineers can easily read, modify, and learn from both the visual frontend and the underlying logic algorithms.

---

## 🚀 Key Features

### 1. Interactive Visualizers
The platform encompasses 8 distinct visualization suites:
- **Sorting**: Bubble Sort, Merge Sort, Quick Sort (animates array bar heights and swaps).
- **Searching**: Linear Search, Binary Search (animates array traversal and pointer bounds).
- **Trees**: Binary Search Tree (BST) insertion and varied depth-first traversals.
- **Graphs**: Breadth-First Search (BFS), Depth-First Search (DFS), and shortest path demonstrations.
- **Hashing**: Interactive Hash Table implementations (linear probing/chaining).
- **Linked Lists**: Node insertion, deletion, and pointer reversal animations.
- **Stack & Queue**: LIFO and FIFO fundamental data structures.

All active visualizations feature:
- Play / Pause toggles.
- Dynamic speed adjustment sliders.
- Live pseudo-code highlighting (line-by-line tracing during execution).

### 2. Practice Problem Database
In addition to visualizers, DSAViz features a searchable database of **185+ curated DSA problems** (mirroring top interview prep sheets like Neetcode 150).
- Users can filter by **Category**, **Difficulty**, and **Status** (To-do / Done).
- Problem progress is saved persistently.

### 3. User Authentication & Tracking
- **JWT Authentication**: Secure user registration and login functionality.
- **Activity Heatmap**: A pixel-perfect, LeetCode-style contribution graph (365-day array) that actively tracks every time a user runs an algorithm or completes a task.
- **Streaks & Badges**: Gamified mechanics that award badges (e.g., "Sort Master", "Week Warrior") based on continuous activity logs in MongoDB.

### 4. Custom Design System
- A fully responsive aesthetic built on modern Flexbox and CSS Grid.
- Custom flat-color UI elements.
- **Theme Toggling**: A global hook allows seamless switching between Light and Dark mode using CSS root variables.

---

## 🏗️ Architecture & Stack

The application uses a lightweight MERN-inspired stack:

### Frontend
- **HTML5/CSS3**: Pure semantic styling. No heavyweight CSS frameworks (like Tailwind or Bootstrap) were used, allowing for absolute control and pure modularity.
- **Vanilla JavaScript**: DOM rendering, animation loop handling, and API communication are written in zero-dependency ES6 vanilla JS.

### Backend
- **Node.js & Express**: Provides RESTful APIs for the application.
- **MongoDB (Mongoose)**: Manages database collections for `Users` (auth data) and `Progress` (tracking heatmap statistics and badges).
- **JSON Web Tokens (JWT)**: Handles session state without exposing raw user credentials.
- **Bcrypt**: Encrypts and securely hashes passwords prior to database insertion.

---

## ⚙️ How It Works (Internal Mechanics)

### The Animation Engine
Unlike video players, DSAViz renders algorithms live.
When an algorithm (e.g., `bubbleSort`) runs, it does not immediately manipulate the DOM. Instead, the JS function executes standard logic and pushes "animation frames" (state snapshots or swap commands) into a `moves` array.
An asynchronous `playFrames()` function then loops through this array, using `await delay()` to artificially slow execution down, painting the UI updates step-by-step.

### The Heatmap (profile.js)
The contribution graph works by fetching a timestamp array of user activity from the MongoDB `/api/progress/profile` route. 
The script then dynamically evaluates the last 365 days using pure `Date` objects, mapping those days seamlessly into a 7-row CSS Grid layout `grid-auto-flow: column`. The DOM injects localized tooltips and ranks the cell's opacity/green level based on the `runCount`.

### Practice Filters (practice.js)
The problem sheet handles robust local filtration. When checkboxes (categories, difficulties, status) are toggled, the engine loops through the fetched `problems.json` object arrays, evaluates complex conditional logic matching arrays, and sequentially constructs raw HTML tables injected directly via standard string assignment.

---

## 🖥️ Installation & Setup

If you want to run DSAViz locally for development or demonstration:

### Prerequisites
- [Node.js](https://nodejs.org/) installed globally.
- [MongoDB](https://www.mongodb.com/) running locally (port 27017) or a remote MongoDB URI.

### Step 1: Clone & Install
Navigate into the backend directory and install the Node dependencies:
\`\`\`bash
cd project/backend
npm install
\`\`\`

### Step 2: Environment Variables
Create a \`.env\` file in the `backend` directory with the following configuration:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dsaviz
JWT_SECRET=your_super_secret_key_here
\`\`\`

### Step 3: Run the Development Server
Since the frontend heavily relies on ES6 modules and REST APIs, you must boot the backend to serve both the API and the static frontend HTML.
\`\`\`bash
npm run dev
\`\`\`

### Step 4: Access the app
Open your browser and navigate to:
[http://localhost:5000](http://localhost:5000)

*(Note: The `npm run dev` script may use port `5001` if `5000` is already in use by another application. Check the terminal output for the active port).*
