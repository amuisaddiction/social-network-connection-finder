from collections import deque

def bfs_shortest_path(graph, start_user, end_user):
    """
    Finds the shortest path between start_user and end_user using Breadth First Search (BFS).
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    Returns: (path_list, degrees_of_separation) or (None, -1) if no path exists.
    """
    if start_user not in graph.adj_list or end_user not in graph.adj_list:
        raise ValueError("Start or end user does not exist in the graph.")
        
    if start_user == end_user:
        return [start_user], 0
        
    # Queue for BFS, holds users to visit next
    queue = deque([start_user])
    # Set to keep track of visited nodes to avoid cycles
    visited = set([start_user])
    # Parent map to reconstruct the shortest path later
    parent_map = {start_user: None}
    
    found = False
    
    # BFS Traversal
    while queue:
        current = queue.popleft()
        
        if current == end_user:
            found = True
            break
            
        for neighbor in graph.adj_list[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                parent_map[neighbor] = current
                queue.append(neighbor)
                
    if not found:
        return None, -1
        
    # Reconstruct path using parent map
    path = []
    current = end_user
    while current is not None:
        path.append(current)
        current = parent_map[current]
        
    path.reverse()
    degrees_of_separation = len(path) - 1
    return path, degrees_of_separation


def dfs_traversal(graph, start_user):
    """
    Performs Depth First Search (DFS) traversal starting from start_user.
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    Returns: list of users in traversal order.
    """
    if start_user not in graph.adj_list:
        raise ValueError("Start user does not exist.")
        
    visited = set()
    traversal_order = []
    
    # Nested recursive function for DFS
    def dfs_recursive(user):
        visited.add(user)
        traversal_order.append(user)
        # Visit unvisited neighbors
        # Sort to ensure consistent traversal order for demonstration
        for neighbor in sorted(list(graph.adj_list[user])):
            if neighbor not in visited:
                dfs_recursive(neighbor)
                
    dfs_recursive(start_user)
    return traversal_order


def get_mutual_friends(graph, user1, user2):
    """
    Finds mutual friends between two users by intersecting their adjacency lists.
    """
    if user1 not in graph.adj_list or user2 not in graph.adj_list:
        raise ValueError("Both users must exist.")
    
    friends1 = graph.adj_list[user1]
    friends2 = graph.adj_list[user2]
    
    return sorted(list(friends1.intersection(friends2)))


def get_connection_suggestions(graph, user):
    """
    Suggests connections for a user based on friends-of-friends (mutual friends).
    Returns: list of tuples (suggested_user, mutual_friends_count)
    """
    if user not in graph.adj_list:
        raise ValueError("User does not exist.")
        
    suggestions = {}
    user_friends = graph.adj_list[user]
    
    # Check friends of friends
    for friend in user_friends:
        for fof in graph.adj_list[friend]:
            if fof != user and fof not in user_friends:
                if fof not in suggestions:
                    suggestions[fof] = 0
                suggestions[fof] += 1
                
    # Sort by number of mutual friends (descending), then alphabetically
    sorted_suggestions = sorted(suggestions.items(), key=lambda x: (-x[1], x[0]))
    return sorted_suggestions
