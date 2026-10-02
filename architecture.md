# Architecture Document

## 1. Architecture Overview

The application follows a simple layered structure:

```text
User
  |
  v
Tkinter GUI
  |
  v
Application / Controller Logic
  |
  +-------------------+
  |                   |
  v                   v
Graph Manager      BFS / DFS
  |                   |
  +---------+---------+
            |
            v
      Adjacency List
```

## 2. Components

### UI Layer
Responsible for:
- User input
- Buttons
- Dropdowns
- Result display
- Error messages

Suggested file: `ui.py`

### Graph Layer
Responsible for:
- Storing users
- Storing connections
- Adding/removing users
- Adding/removing connections
- Returning neighbors

Suggested file: `graph.py`

### Algorithm Layer
Responsible for:
- BFS shortest path
- DFS traversal
- Path reconstruction
- Degrees of separation

Suggested file: `algorithms.py`

### Data Layer
Responsible for:
- Sample network
- Initial graph data
- Optional JSON save/load in a future version

Suggested file: `data.py`

### Entry Point
Starts the application.

Suggested file: `main.py`

## 3. Data Structure

Use an adjacency list implemented with a Python dictionary.

For an undirected network:
```text
Alice -> [Bob, Charlie]
Bob   -> [Alice, David]
Charlie -> [Alice]
David -> [Bob]
```

Adding a friendship adds each user to the other's list.

## 4. BFS Architecture

Input:
- Start user
- Target user

Process:
1. Create queue.
2. Mark start as visited.
3. Store parent of each discovered node.
4. Remove nodes from queue.
5. Visit unvisited neighbors.
6. Stop when target is found.
7. Reconstruct path using parent mapping.

Output:
- Shortest path
- Number of edges/degrees
- Human-readable result

## 5. DFS Architecture

Input:
- Start user

Process:
1. Create visited set.
2. Start from selected user.
3. Visit current node.
4. Recursively or iteratively visit unvisited neighbors.
5. Backtrack when no unvisited neighbor remains.

Output:
- DFS traversal order
- Reachable users

## 6. Error Handling
The application should handle:
- Empty usernames
- Duplicate users
- Duplicate connections
- Self-connections
- Missing users
- Same source and destination
- No path between users

## 7. Design Principle
Keep DSA logic independent from the GUI. The GUI should call graph and algorithm methods rather than implementing BFS/DFS itself.
