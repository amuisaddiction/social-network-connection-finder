# Design Document

## 1. Design Goal
Create a simple, professional and easy-to-demonstrate social-network application where the main focus is graph-based DSA.

The interface should look like a real mini application but remain simple enough for a college DSA project.

## 2. UI Sections

### Header
Title:
**Social Network Connection Finder**

Subtitle:
**Graph • BFS • DFS • Shortest Connection**

### Network Management
Controls:
- Add User
- Add Connection
- Remove Connection
- Reset Sample Network

### Connection Finder
Controls:
- Source user
- Destination user
- Find Shortest Path (BFS)

Result:
- Path
- Degrees of separation

### Network Explorer
Controls:
- Select starting user
- Run DFS

Result:
- Traversal order
- Reachable users

### Graph Display
Show the adjacency list in a readable panel.

A simple text/network representation is sufficient. Do not add a complex graph-visualization dependency unless required.

## 3. User Flow

### Find Shortest Connection
```text
Select source
      |
Select destination
      |
Click BFS
      |
Run BFS
      |
Reconstruct shortest path
      |
Display path + degrees
```

### Explore Network
```text
Select starting user
      |
Click DFS
      |
Run DFS
      |
Display traversal
```

## 4. UX Rules
- Clear labels
- Large readable buttons
- Simple layout
- Helpful validation messages
- No unnecessary animations
- No login system
- No internet dependency
- No unnecessary AI features

## 5. Visual Style
Use a clean academic/professional desktop style:
- Light background
- Clear section headings
- Consistent spacing
- One primary accent color
- Readable fonts
- Results displayed prominently

Avoid making the interface look like a generic AI dashboard.

## 6. Important DSA Visibility
The interface should explicitly show labels such as:
- Graph
- Adjacency List
- BFS
- DFS
- Shortest Path
- Degrees of Separation

This makes the DSA implementation easy to demonstrate to the evaluator.
