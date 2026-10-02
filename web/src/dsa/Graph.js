export class Graph {
    constructor() {
        // adjacency list: user -> Set of connected users
        this.adjList = new Map();
    }

    addUser(user) {
        if (!user || user.trim() === "") {
            throw new Error("User name cannot be empty.");
        }
        user = user.trim();
        if (this.adjList.has(user)) {
            throw new Error(`User '${user}' already exists.`);
        }
        this.adjList.set(user, new Set());
    }

    removeUser(user) {
        if (!this.adjList.has(user)) {
            throw new Error(`User '${user}' does not exist.`);
        }
        // Remove user from all other users' connection sets
        for (const connectedUser of this.adjList.get(user)) {
            this.adjList.get(connectedUser).delete(user);
        }
        // Remove user from graph
        this.adjList.delete(user);
    }

    addConnection(user1, user2) {
        if (!this.adjList.has(user1) || !this.adjList.has(user2)) {
            throw new Error("Both users must exist to create a connection.");
        }
        if (user1 === user2) {
            throw new Error("A user cannot connect to themselves.");
        }
        if (this.adjList.get(user1).has(user2)) {
            throw new Error("Connection already exists.");
        }
        
        // Undirected graph: add to both adjacency lists
        this.adjList.get(user1).add(user2);
        this.adjList.get(user2).add(user1);
    }

    removeConnection(user1, user2) {
        if (!this.adjList.has(user1) || !this.adjList.has(user2)) {
            throw new Error("Both users must exist.");
        }
        if (!this.adjList.get(user1).has(user2)) {
            throw new Error("Connection does not exist.");
        }
            
        this.adjList.get(user1).delete(user2);
        this.adjList.get(user2).delete(user1);
    }

    getUsers() {
        return Array.from(this.adjList.keys());
    }

    getConnections(user) {
        if (!this.adjList.has(user)) {
            throw new Error(`User '${user}' does not exist.`);
        }
        return Array.from(this.adjList.get(user));
    }
    
    clear() {
        this.adjList.clear();
    }
}
