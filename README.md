# Social Network Connection Finder

A Python Data Structures and Algorithms (DSA) mini-project that uses Graph, Breadth-First Search (BFS), and Depth-First Search (DFS) to find and explore social network connections.

## Project Overview

This project models a social network as an undirected, unweighted graph. It demonstrates how core DSA concepts can solve real-world problems like finding the shortest connection path between two users (Degrees of Separation) and suggesting new friends.

**Important Note for Evaluators:** The core BFS and DFS algorithms, as well as the Graph data structure itself, are **manually implemented** using Python's standard library (`collections.deque`, `set`, `dict`). No external graph libraries are used for the logic, keeping the project transparent and academic.

## Features

- **Network Management:** Add/Remove users and connections.
- **Shortest Connection Finder (BFS):** Finds the shortest path and calculates the degrees of separation between two users.
- **Network Explorer (DFS):** Traverses the network starting from a selected user.
- **Social Features:** Finds mutual friends and generates connection suggestions based on friends-of-friends.
- **Visualizations:** Displays the Adjacency List and a visual graph representation.
- **Two Interfaces:** 
  - A primary Python Desktop Application using `Tkinter`.
  - A secondary Web Demo using `Streamlit`.

## DSA Concepts Implemented

1. **Graph Representation:** Uses an **Adjacency List** (a Python dictionary mapping a user to a `set` of connected users). This provides $O(1)$ lookup time for neighbors.
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

- **Core Logic:** Pure Python 3 (Standard Libraries: `collections`, `json`, `math`)
- **Desktop GUI:** `Tkinter` (Python standard library GUI framework)
- **Web Demo:** `Streamlit` (Uses `networkx` and `matplotlib` strictly for rendering the visual chart on the web, NOT for algorithms).

## How to Run Locally

### 1. Desktop Application (Recommended for Viva/Demo)

The desktop application requires **zero external dependencies**.

```bash
# Simply run the main file
python main.py
```

### 2. Web Demo

To run the browser-accessible version locally:

```bash
# Install the web dependencies
pip install -r requirements.txt

# Run the Streamlit app
streamlit run app.py
```

## Demo & Screenshots

*(Add screenshots of the Tkinter application and Streamlit web app here)*

## Future Scope

- **Weighted Graphs:** Adding "relationship strength" to edges and using Dijkstra's Algorithm instead of BFS.
- **Directed Graphs:** Supporting "Followers" vs "Friends" (e.g., Twitter vs Facebook).
- **Database Integration:** Replacing the JSON storage with SQLite or PostgreSQL for large-scale data.
