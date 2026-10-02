# Algorithms

## BFS - Shortest Connection

BFS is suitable because a social network can be represented as an unweighted graph where every friendship has equal traversal cost.

### Steps
1. Put the source user into a queue.
2. Mark the source as visited.
3. Store its parent as `None`.
4. Remove the first user from the queue.
5. Visit every unvisited neighbor.
6. Store the current user as the neighbor's parent.
7. Continue until the target is found or the queue becomes empty.
8. Reconstruct the path using the parent map.

### Complexity
Time: O(V + E)
Space: O(V)

## DFS - Network Exploration

### Steps
1. Start at the selected user.
2. Mark the user visited.
3. Add it to traversal output.
4. Visit each unvisited neighbor.
5. Continue recursively or with an explicit stack.

### Complexity
Time: O(V + E)
Space: O(V)

## Why BFS for Shortest Path?
In an unweighted graph, BFS visits nodes level by level. Therefore, the first time it reaches the destination, the path contains the minimum number of edges.

## Why DFS?
DFS is useful for exploring the connected portion of the social network and demonstrating graph traversal.
