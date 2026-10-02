from graph import Graph
from algorithms import bfs_shortest_path, dfs_traversal, get_mutual_friends, get_connection_suggestions
import data

def run_tests():
    print("Testing Graph...")
    g = Graph()
    
    # 1. Add user
    g.add_user("Test1")
    assert "Test1" in g.get_users()
    
    # 2. Duplicate user
    try:
        g.add_user("Test1")
        assert False, "Should raise ValueError"
    except ValueError:
        pass
        
    # 3. Add connection
    g.add_user("Test2")
    g.add_connection("Test1", "Test2")
    assert "Test2" in g.get_connections("Test1")
    assert "Test1" in g.get_connections("Test2")
    
    # 4. Self connection
    try:
        g.add_connection("Test1", "Test1")
        assert False, "Should raise ValueError"
    except ValueError:
        pass
        
    # 5. Duplicate connection
    try:
        g.add_connection("Test1", "Test2")
        assert False, "Should raise ValueError"
    except ValueError:
        pass
        
    # 6. Remove connection
    g.remove_connection("Test1", "Test2")
    assert "Test2" not in g.get_connections("Test1")
    
    # 7. Remove user
    g.remove_user("Test1")
    assert "Test1" not in g.get_users()
    
    # Testing Algorithms
    print("Testing Algorithms...")
    data.load_sample_network(g)
    
    # BFS valid path
    path, degrees = bfs_shortest_path(g, "Alice", "David")
    assert path is not None
    assert degrees > 0
    
    # BFS no path
    g.add_user("Isolated")
    path, degrees = bfs_shortest_path(g, "Alice", "Isolated")
    assert path is None
    assert degrees == -1
    
    # BFS source = destination
    path, degrees = bfs_shortest_path(g, "Alice", "Alice")
    assert path == ["Alice"]
    assert degrees == 0
    
    # DFS
    traversal = dfs_traversal(g, "Alice")
    assert "Alice" in traversal
    assert len(traversal) > 1
    
    # Mutual friends
    mutual = get_mutual_friends(g, "Alice", "Charlie")
    # Both know Bob
    assert "Bob" in mutual
    
    # Suggestions
    suggestions = get_connection_suggestions(g, "Alice")
    assert isinstance(suggestions, list)
    
    print("All tests passed successfully.")

if __name__ == "__main__":
    run_tests()
