# Project Build Instructions

You are building my DSA mini-project: **Social Network Connection Finder using Graph, BFS and DFS**.

Read all project documentation first:
- README.md
- architecture.md
- techstack.md
- design_docs.md
- docs/algorithm.md
- docs/problem_statement.md
- docs/test_plan.md

## Goal
Build the complete working Python desktop application described in these files.

## Mandatory DSA Requirements
1. Use a graph represented with an adjacency list.
2. Users are vertices.
3. Social connections are undirected edges.
4. Implement BFS manually using a queue (`collections.deque`).
5. Implement DFS manually, preferably recursively or with an explicit stack.
6. BFS must find the shortest path between two users.
7. Reconstruct and display the path.
8. Calculate degrees of separation.
9. DFS must display traversal order.
10. Do not replace BFS/DFS with a graph library.
11. Keep graph/algorithm logic separate from GUI code.

## Required Features
- Add user
- Add connection
- Remove connection
- Display current adjacency list
- Select source and destination
- Find shortest connection using BFS
- Select starting user and run DFS
- Reset sample network
- Clear validation/error messages
- Handle disconnected users
- Handle duplicate users/connections
- Handle self-connections
- Handle missing users
- Handle source = destination

## UI
Use Tkinter only.
Make it clean, modern, simple and professional for a college mini-project.
Do not add unnecessary frameworks, login systems, databases, APIs or AI features.
Make the DSA concepts visibly labeled: Graph, Adjacency List, BFS, DFS, Shortest Path, Degrees of Separation.

## Suggested Files
Create:
- main.py
- graph.py
- algorithms.py
- data.py
- ui.py
- README.md
- architecture.md
- techstack.md
- design_docs.md
- requirements.txt
- docs/algorithm.md
- docs/problem_statement.md
- docs/test_plan.md

## Quality Requirements
- Code must be beginner-friendly and well commented.
- Avoid unnecessary abstraction.
- Use clear function/class names.
- Validate all user input.
- Do not hardcode BFS/DFS results.
- Test the algorithms with multiple cases.
- Make sure `python main.py` launches the application without errors.
- Before finishing, run the application and test all major buttons/features.
- Fix any runtime errors you find.
- Do not redesign the project beyond the documentation unless required for functionality.

## Final Response
After implementation, report:
1. Files created
2. Features completed
3. BFS implementation location
4. DFS implementation location
5. How to run
6. Tests performed
7. Any remaining issue, if any
8. Suggested next step for the college demo

Do not stop after creating documentation. Actually implement and test the complete project.
