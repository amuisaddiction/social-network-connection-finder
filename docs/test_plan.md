# Test Plan

## Functional Tests

| Test | Input | Expected Result |
|---|---|---|
| Add user | New username | User added |
| Duplicate user | Existing username | Validation message |
| Add connection | Two existing users | Connection added |
| Self connection | Same user twice | Rejected |
| BFS valid path | Connected users | Shortest path shown |
| BFS no path | Disconnected users | No connection message |
| BFS same user | Same source/target | Zero-degree path |
| DFS | Existing user | Traversal shown |
| Missing user | Invalid username | Error message |
| Duplicate connection | Existing edge | Prevent duplicate |

## Algorithm Tests
- BFS should return the minimum-edge path.
- DFS should visit every reachable vertex once.
- Cycles must not cause infinite loops.
- Disconnected components must be handled correctly.
