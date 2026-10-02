import json
import os

def load_sample_network(graph):
    """
    Loads a predefined sample dataset into the graph.
    Demonstrates a realistic but small social network.
    """
    # Clear existing data
    graph.adj_list.clear()
    
    # Sample users (8-12 users)
    users = ["Alice", "Bob", "Charlie", "David", "Eve", "Priya", "Rahul", "Neha", "Arjun", "Karan"]
    for u in users:
        graph.add_user(u)
        
    # Sample connections (Multiple paths available to test shortest path)
    connections = [
        ("Alice", "Priya"),
        ("Alice", "Bob"),
        ("Priya", "Rahul"),
        ("Bob", "Charlie"),
        ("Bob", "Neha"),
        ("Rahul", "Neha"),     # Path between Alice and Neha can be Alice-Priya-Rahul-Neha or Alice-Bob-Neha
        ("Charlie", "David"),
        ("Neha", "Arjun"),
        ("Eve", "David"),
        ("Eve", "Karan"),
        ("Arjun", "Karan"),
        ("Rahul", "Arjun")     # Creates multiple paths
    ]
    
    for u1, u2 in connections:
        try:
            graph.add_connection(u1, u2)
        except ValueError:
            pass # Ignore if duplicate in the hardcoded list

def save_network(graph, filename="network_data.json"):
    """
    Saves the network graph adjacency list to a JSON file.
    """
    # Convert sets to lists for JSON serialization
    data = {u: list(connections) for u, connections in graph.adj_list.items()}
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)
        
def load_network(graph, filename="network_data.json"):
    """
    Loads the network graph from a JSON file.
    """
    if not os.path.exists(filename):
        return False
        
    with open(filename, 'r') as f:
        data = json.load(f)
        
    graph.adj_list.clear()
    
    # Add all users first
    for user in data:
        graph.add_user(user)
        
    # Add connections
    for user, connections in data.items():
        for connected_user in connections:
            if connected_user in graph.adj_list: # Ensure user exists
                try:
                    graph.add_connection(user, connected_user)
                except ValueError:
                    pass # Connection already exists (since graph is undirected, a-b adds b-a too)
    return True
