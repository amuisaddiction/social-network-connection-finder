export function bfsShortestPath(graph, startUser, endUser) {
    if (!graph.adjList.has(startUser) || !graph.adjList.has(endUser)) {
        throw new Error("Start or end user does not exist in the graph.");
    }
        
    if (startUser === endUser) {
        return { path: [startUser], degrees: 0 };
    }
        
    // Queue for BFS
    const queue = [startUser];
    // Set for visited tracking
    const visited = new Set([startUser]);
    // Parent map for path reconstruction
    const parentMap = new Map();
    parentMap.set(startUser, null);
    
    let found = false;
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        if (current === endUser) {
            found = true;
            break;
        }
            
        for (const neighbor of graph.adjList.get(current)) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                parentMap.set(neighbor, current);
                queue.push(neighbor);
            }
        }
    }
                
    if (!found) {
        return { path: null, degrees: -1 };
    }
        
    // Reconstruct path using parent map
    const path = [];
    let current = endUser;
    while (current !== null) {
        path.push(current);
        current = parentMap.get(current);
    }
        
    path.reverse();
    return { path, degrees: path.length - 1 };
}

export function dfsTraversal(graph, startUser) {
    if (!graph.adjList.has(startUser)) {
        throw new Error("Start user does not exist.");
    }
        
    const visited = new Set();
    const traversalOrder = [];
    
    function dfsRecursive(user) {
        visited.add(user);
        traversalOrder.push(user);
        
        // Sort to ensure consistent traversal order
        const neighbors = Array.from(graph.adjList.get(user)).sort();
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfsRecursive(neighbor);
            }
        }
    }
                
    dfsRecursive(startUser);
    return traversalOrder;
}

export function getMutualFriends(graph, user1, user2) {
    if (!graph.adjList.has(user1) || !graph.adjList.has(user2)) {
        throw new Error("Both users must exist.");
    }
    
    const friends1 = graph.adjList.get(user1);
    const friends2 = graph.adjList.get(user2);
    
    const mutual = [];
    for (const f of friends1) {
        if (friends2.has(f)) {
            mutual.push(f);
        }
    }
    
    return mutual.sort();
}

export function getConnectionSuggestions(graph, user) {
    if (!graph.adjList.has(user)) {
        throw new Error("User does not exist.");
    }
        
    const suggestions = new Map();
    const userFriends = graph.adjList.get(user);
    
    // Check friends of friends
    for (const friend of userFriends) {
        for (const fof of graph.adjList.get(friend)) {
            if (fof !== user && !userFriends.has(fof)) {
                suggestions.set(fof, (suggestions.get(fof) || 0) + 1);
            }
        }
    }
                
    // Convert to array and sort by number of mutual friends (descending), then alphabetically
    const sortedSuggestions = Array.from(suggestions.entries()).sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1];
        }
        return a[0].localeCompare(b[0]);
    });
    
    return sortedSuggestions; // Array of [user, count]
}
