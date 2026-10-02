export function loadSampleNetwork(graph) {
    graph.clear();
    
    // 10 sample users
    const users = ["Alice", "Bob", "Charlie", "David", "Eve", "Priya", "Rahul", "Neha", "Arjun", "Karan"];
    for (const u of users) {
        graph.addUser(u);
    }
        
    // Add connections
    const connections = [
        ["Alice", "Priya"],
        ["Alice", "Bob"],
        ["Priya", "Rahul"],
        ["Bob", "Charlie"],
        ["Bob", "Neha"],
        ["Rahul", "Neha"],
        ["Charlie", "David"],
        ["Neha", "Arjun"],
        ["Eve", "David"],
        ["Eve", "Karan"],
        ["Arjun", "Karan"],
        ["Rahul", "Arjun"]
    ];
    
    for (const [u1, u2] of connections) {
        try {
            graph.addConnection(u1, u2);
        } catch (e) {
            // Ignore duplicate if any
        }
    }
}
