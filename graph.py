class Graph:
    """
    Graph Data Structure representing the Social Network.
    - Vertices (Nodes): Users
    - Edges (Lines): Friend connections
    This uses an Adjacency List for efficient neighbor lookups.
    """
    def __init__(self):
        # adjacency list: user -> set of connected users
        # Example: {'Alice': {'Priya', 'Bob'}}
        self.adj_list = {}

    def add_user(self, user):
        """Adds a new user to the graph."""
        if not user or user.strip() == "":
            raise ValueError("User name cannot be empty.")
        user = user.strip()
        if user in self.adj_list:
            raise ValueError(f"User '{user}' already exists.")
        self.adj_list[user] = set()

    def remove_user(self, user):
        """Removes a user and all their connections from the graph."""
        if user not in self.adj_list:
            raise ValueError(f"User '{user}' does not exist.")
        # Remove user from all other users' connection sets
        for connected_user in self.adj_list[user]:
            self.adj_list[connected_user].remove(user)
        # Remove user from graph
        del self.adj_list[user]

    def add_connection(self, user1, user2):
        """Adds an undirected connection between two users."""
        if user1 not in self.adj_list or user2 not in self.adj_list:
            raise ValueError("Both users must exist to create a connection.")
        if user1 == user2:
            raise ValueError("A user cannot connect to themselves.")
        if user2 in self.adj_list[user1]:
            raise ValueError("Connection already exists.")
        
        # Undirected graph: add to both adjacency lists
        self.adj_list[user1].add(user2)
        self.adj_list[user2].add(user1)

    def remove_connection(self, user1, user2):
        """Removes an undirected connection between two users."""
        if user1 not in self.adj_list or user2 not in self.adj_list:
            raise ValueError("Both users must exist.")
        if user2 not in self.adj_list[user1]:
            raise ValueError("Connection does not exist.")
            
        self.adj_list[user1].remove(user2)
        self.adj_list[user2].remove(user1)

    def get_users(self):
        """Returns a list of all users."""
        return list(self.adj_list.keys())

    def get_connections(self, user):
        """Returns a list of connections for a given user."""
        if user not in self.adj_list:
            raise ValueError(f"User '{user}' does not exist.")
        return list(self.adj_list[user])
