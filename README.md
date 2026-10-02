# Social Network Connection Finder

A Data Structures and Algorithms (DSA) mini-project that uses Graph, Breadth-First Search (BFS), and Depth-First Search (DFS) to find and explore social network connections.

## Project Overview

This project models a social network as an undirected, unweighted graph. It demonstrates how core DSA concepts can solve real-world problems like finding the shortest connection path between two users (Degrees of Separation) and suggesting new friends.

**Important Note:** The core BFS and DFS algorithms, as well as the Graph data structure itself, are **manually implemented** using fundamental data structures (`Queue`, `Set`, `Map`/`Dict`). No external graph libraries are used for the logic.

## Features

- **Network Management:** Add/Remove users and connections.
- **Shortest Connection Finder (BFS):** Finds the shortest path and calculates the degrees of separation between two users.
- **Network Explorer (DFS):** Traverses the network starting from a selected user.
- **Social Features:** Finds mutual friends and generates connection suggestions based on friends-of-friends.
- **Visualizations:** Displays the Adjacency List and a visual force-directed graph.
- **Two Complete Implementations:** 
  - A primary Python Desktop Application using `Tkinter` (Zero Dependencies).
  - A professional Web Application built with `React` and `Vite` (deployable on Vercel).

## DSA Concepts Implemented

1. **Graph Representation:** Uses an **Adjacency List** (mapping a user to a `Set` of connected users). This provides $O(1)$ lookup time for neighbors.
2. **Breadth-First Search (BFS):** Explores the network level-by-level using a Queue. Because all edge weights are equal (1 connection = 1 edge), the first time BFS reaches the target user, it guarantees the shortest path.
3. **Depth-First Search (DFS):** Explores the network by diving as deep as possible before backtracking. Handled recursively while tracking a `visited` set to prevent infinite loops in cyclic networks.

## Time and Space Complexity

- **BFS (Shortest Path):**
  - **Time Complexity:** $O(V + E)$ where $V$ is vertices (users) and $E$ is edges (connections).
  - **Space Complexity:** $O(V)$ for the queue, visited set, and parent map.
- **DFS (Network Exploration):**
  - **Time Complexity:** $O(V + E)$ 
  - **Space Complexity:** $O(V)$ for the recursion stack and visited set.

## Architecture & Technology Stack

The project features strict separation of concerns between the UI layer and the core DSA layer.

### 1. Desktop Application (Python)
- **Location:** Project Root
- **Core Logic:** Pure Python 3 (`graph.py`, `algorithms.py`)
- **UI:** `Tkinter` 
- **Dependencies:** None

### 2. Web Application (JavaScript/React)
- **Location:** `/web` folder
- **Core Logic:** Pure JS/ES6 (`web/src/dsa/Graph.js`, `web/src/dsa/algorithms.js`)
- **UI:** React + Vite + Tailwind CSS
- **Visualization:** `react-force-graph-2d`

## How to Run Locally

### 1. Python Desktop Application (Recommended for Viva)

```bash
# Run the main file (No pip installs required)
python main.py
```

### 2. React Web Application

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Run development server
npm run dev
```

## Vercel Deployment

The web application is configured to be directly deployed to Vercel without requiring a backend server. 

1. Import the repository into Vercel.
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to `web`.
4. Deploy!

## Screenshots

*(Add screenshots of both the Tkinter application and the React web app here)*

## Future Scope

- **Weighted Graphs:** Adding "relationship strength" to edges and using Dijkstra's Algorithm instead of BFS.
- **Directed Graphs:** Supporting "Followers" vs "Friends" (e.g., Twitter vs Facebook).
- **Persistent Backend:** Hooking the React app up to a cloud database for global persistence.
