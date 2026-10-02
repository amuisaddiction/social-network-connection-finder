import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from graph import Graph
from algorithms import bfs_shortest_path, dfs_traversal, get_mutual_friends, get_connection_suggestions
import data
import math

class SocialNetworkApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Social Network Connection Finder")
        self.root.geometry("1100x850")
        
        self.graph = Graph()
        # Try loading saved network, otherwise load sample network
        if not data.load_network(self.graph):
            data.load_sample_network(self.graph)
        
        self.setup_ui()
        
    def setup_ui(self):
        # Configure grid for main window
        self.root.columnconfigure(0, weight=1, minsize=400)
        self.root.columnconfigure(1, weight=1, minsize=500)
        self.root.rowconfigure(1, weight=1)
        
        # --- Header ---
        header_frame = tk.Frame(self.root, pady=10, bg="#e6f2ff")
        header_frame.grid(row=0, column=0, columnspan=2, sticky="ew")
        
        tk.Label(header_frame, text="SOCIAL NETWORK CONNECTION FINDER", font=("Helvetica", 18, "bold"), bg="#e6f2ff").pack()
        tk.Label(header_frame, text="Graph • BFS • DFS", font=("Helvetica", 14), bg="#e6f2ff").pack()
        
        # --- Left Column Frame (Controls) ---
        left_frame = tk.Frame(self.root, padx=15, pady=15)
        left_frame.grid(row=1, column=0, sticky="nsew")
        
        # --- Right Column Frame (Display) ---
        right_frame = tk.Frame(self.root, padx=15, pady=15)
        right_frame.grid(row=1, column=1, sticky="nsew")
        right_frame.rowconfigure(0, weight=2)
        right_frame.rowconfigure(1, weight=1)
        
        # === 1. Network Management ===
        nm_frame = tk.LabelFrame(left_frame, text="Network Management", padx=15, pady=10, font=("Helvetica", 11, "bold"))
        nm_frame.pack(fill="x", pady=10)
        
        tk.Button(nm_frame, text="Add User", width=15, command=self.add_user_dialog).grid(row=0, column=0, padx=5, pady=5)
        tk.Button(nm_frame, text="Remove User", width=15, command=self.remove_user_dialog).grid(row=0, column=1, padx=5, pady=5)
        tk.Button(nm_frame, text="Add Connection", width=15, command=self.add_connection_dialog).grid(row=1, column=0, padx=5, pady=5)
        tk.Button(nm_frame, text="Remove Connection", width=15, command=self.remove_connection_dialog).grid(row=1, column=1, padx=5, pady=5)
        
        btn_frame = tk.Frame(nm_frame)
        btn_frame.grid(row=2, column=0, columnspan=2, pady=10)
        tk.Button(btn_frame, text="Reset Sample Data", command=self.reset_data).pack(side=tk.LEFT, padx=5)
        tk.Button(btn_frame, text="Save Data", command=self.save_data).pack(side=tk.LEFT, padx=5)
        
        # === 2. Shortest Connection - BFS ===
        bfs_frame = tk.LabelFrame(left_frame, text="Shortest Connection - BFS", padx=15, pady=10, font=("Helvetica", 11, "bold"))
        bfs_frame.pack(fill="x", pady=10)
        
        tk.Label(bfs_frame, text="From:").grid(row=0, column=0, sticky="e", padx=5)
        self.bfs_from_var = tk.StringVar()
        self.bfs_from_cb = ttk.Combobox(bfs_frame, textvariable=self.bfs_from_var, state="readonly", width=25)
        self.bfs_from_cb.grid(row=0, column=1, padx=5, pady=5)
        
        tk.Label(bfs_frame, text="To:").grid(row=1, column=0, sticky="e", padx=5)
        self.bfs_to_var = tk.StringVar()
        self.bfs_to_cb = ttk.Combobox(bfs_frame, textvariable=self.bfs_to_var, state="readonly", width=25)
        self.bfs_to_cb.grid(row=1, column=1, padx=5, pady=5)
        
        tk.Button(bfs_frame, text="Find Shortest Path", bg="#4CAF50", fg="white", font=("Helvetica", 10, "bold"), command=self.run_bfs).grid(row=2, column=0, columnspan=2, pady=10)
        
        self.bfs_result_text = tk.Text(bfs_frame, height=5, width=45, state=tk.DISABLED, bg="#f9f9f9")
        self.bfs_result_text.grid(row=3, column=0, columnspan=2)
        
        # === 3. Network Exploration - DFS ===
        dfs_frame = tk.LabelFrame(left_frame, text="Network Exploration - DFS", padx=15, pady=10, font=("Helvetica", 11, "bold"))
        dfs_frame.pack(fill="x", pady=10)
        
        tk.Label(dfs_frame, text="Start User:").grid(row=0, column=0, sticky="e", padx=5)
        self.dfs_start_var = tk.StringVar()
        self.dfs_start_cb = ttk.Combobox(dfs_frame, textvariable=self.dfs_start_var, state="readonly", width=25)
        self.dfs_start_cb.grid(row=0, column=1, padx=5, pady=5)
        
        tk.Button(dfs_frame, text="Run DFS", bg="#2196F3", fg="white", font=("Helvetica", 10, "bold"), command=self.run_dfs).grid(row=1, column=0, columnspan=2, pady=10)
        
        self.dfs_result_text = tk.Text(dfs_frame, height=4, width=45, state=tk.DISABLED, bg="#f9f9f9")
        self.dfs_result_text.grid(row=2, column=0, columnspan=2)
        
        # === 4. Social Features ===
        soc_frame = tk.LabelFrame(left_frame, text="Social Features", padx=15, pady=10, font=("Helvetica", 11, "bold"))
        soc_frame.pack(fill="x", pady=10)
        
        tk.Button(soc_frame, text="Mutual Friends", command=self.show_mutual_friends).grid(row=0, column=0, padx=5, pady=5)
        tk.Button(soc_frame, text="Connection Suggestions", command=self.show_suggestions).grid(row=0, column=1, padx=5, pady=5)
        
        self.soc_result_text = tk.Text(soc_frame, height=6, width=45, state=tk.DISABLED, bg="#f9f9f9")
        self.soc_result_text.grid(row=1, column=0, columnspan=2, pady=5)
        
        # === 5. Graph Visualization (Canvas) ===
        vis_frame = tk.LabelFrame(right_frame, text="Graph Visualization", padx=10, pady=10, font=("Helvetica", 11, "bold"))
        vis_frame.grid(row=0, column=0, sticky="nsew", pady=5)
        vis_frame.rowconfigure(0, weight=1)
        vis_frame.columnconfigure(0, weight=1)
        
        self.canvas = tk.Canvas(vis_frame, bg="white")
        self.canvas.grid(row=0, column=0, sticky="nsew")
        # Bind resize event to redraw graph
        self.canvas.bind("<Configure>", lambda e: self.draw_graph())
        
        # === 6. Adjacency List Display ===
        adj_frame = tk.LabelFrame(right_frame, text="Adjacency List (DSA Internal Representation)", padx=10, pady=10, font=("Helvetica", 11, "bold"))
        adj_frame.grid(row=1, column=0, sticky="nsew", pady=5)
        adj_frame.rowconfigure(0, weight=1)
        adj_frame.columnconfigure(0, weight=1)
        
        self.adj_list_text = tk.Text(adj_frame, height=12, state=tk.DISABLED, font=("Courier", 11), bg="#2d2d2d", fg="#ffffff")
        self.adj_list_text.grid(row=0, column=0, sticky="nsew")
        
        self.update_ui()
        
    def update_ui(self):
        """Updates comboboxes and adjacency list view after graph changes."""
        users = sorted(self.graph.get_users())
        self.bfs_from_cb['values'] = users
        self.bfs_to_cb['values'] = users
        self.dfs_start_cb['values'] = users
        
        # Update adjacency list text
        self.adj_list_text.config(state=tk.NORMAL)
        self.adj_list_text.delete(1.0, tk.END)
        for user in users:
            connections = ", ".join(sorted(list(self.graph.adj_list[user])))
            self.adj_list_text.insert(tk.END, f"{user}: [{connections}]\n")
        self.adj_list_text.config(state=tk.DISABLED)
        
        self.draw_graph()
        
    def draw_graph(self):
        """Draws a simple circular layout representation of the graph."""
        self.canvas.delete("all")
        users = sorted(self.graph.get_users())
        if not users:
            return
            
        width = self.canvas.winfo_width()
        height = self.canvas.winfo_height()
        
        if width <= 1 or height <= 1:
            # Not drawn yet, provide defaults
            width = 400
            height = 300
            
        center_x = width / 2
        center_y = height / 2
        radius = min(width, height) / 2 - 40
        
        positions = {}
        n = len(users)
        # Calculate node positions
        for i, user in enumerate(users):
            angle = 2 * math.pi * i / n
            x = center_x + radius * math.cos(angle)
            y = center_y + radius * math.sin(angle)
            positions[user] = (x, y)
            
        # Draw edges
        drawn_edges = set()
        for u1 in users:
            for u2 in self.graph.adj_list[u1]:
                edge = tuple(sorted([u1, u2]))
                if edge not in drawn_edges:
                    x1, y1 = positions[u1]
                    x2, y2 = positions[u2]
                    self.canvas.create_line(x1, y1, x2, y2, fill="#a0a0a0", width=2)
                    drawn_edges.add(edge)
                    
        # Draw nodes
        for user, (x, y) in positions.items():
            self.canvas.create_oval(x-25, y-15, x+25, y+15, fill="#87CEFA", outline="#4682B4", width=2)
            self.canvas.create_text(x, y, text=user, font=("Helvetica", 9, "bold"))
            
    # --- Dialog Actions ---
    def add_user_dialog(self):
        name = simpledialog.askstring("Add User", "Enter user name:", parent=self.root)
        if name:
            try:
                self.graph.add_user(name)
                self.update_ui()
                self.save_data()
                messagebox.showinfo("Success", f"User '{name}' added.")
            except ValueError as e:
                messagebox.showerror("Error", str(e))
                
    def remove_user_dialog(self):
        users = sorted(self.graph.get_users())
        if not users:
            messagebox.showinfo("Info", "No users to remove.")
            return
            
        top = tk.Toplevel(self.root)
        top.title("Remove User")
        top.geometry("250x150")
        tk.Label(top, text="Select user:").pack(padx=10, pady=10)
        cb = ttk.Combobox(top, values=users, state="readonly")
        cb.pack(padx=10, pady=5)
        if users: cb.current(0)
        
        def do_remove():
            user = cb.get()
            if user:
                try:
                    self.graph.remove_user(user)
                    self.update_ui()
                    self.save_data()
                    messagebox.showinfo("Success", f"User '{user}' removed.")
                    top.destroy()
                except ValueError as e:
                    messagebox.showerror("Error", str(e))
        tk.Button(top, text="Remove", bg="#f44336", fg="white", command=do_remove).pack(pady=10)

    def add_connection_dialog(self):
        users = sorted(self.graph.get_users())
        if len(users) < 2:
            messagebox.showinfo("Info", "Need at least 2 users in the network.")
            return
            
        top = tk.Toplevel(self.root)
        top.title("Add Connection")
        top.geometry("300x200")
        
        tk.Label(top, text="User 1:").grid(row=0, column=0, padx=10, pady=15)
        cb1 = ttk.Combobox(top, values=users, state="readonly")
        cb1.grid(row=0, column=1, padx=10, pady=15)
        
        tk.Label(top, text="User 2:").grid(row=1, column=0, padx=10, pady=5)
        cb2 = ttk.Combobox(top, values=users, state="readonly")
        cb2.grid(row=1, column=1, padx=10, pady=5)
        
        def do_add():
            u1, u2 = cb1.get(), cb2.get()
            if u1 and u2:
                try:
                    self.graph.add_connection(u1, u2)
                    self.update_ui()
                    self.save_data()
                    messagebox.showinfo("Success", f"Connection added: {u1} \u2194 {u2}")
                    top.destroy()
                except ValueError as e:
                    messagebox.showerror("Error", str(e))
        tk.Button(top, text="Add Connection", command=do_add).grid(row=2, column=0, columnspan=2, pady=20)
        
    def remove_connection_dialog(self):
        users = sorted(self.graph.get_users())
        if len(users) < 2:
            return
            
        top = tk.Toplevel(self.root)
        top.title("Remove Connection")
        top.geometry("300x200")
        
        tk.Label(top, text="User 1:").grid(row=0, column=0, padx=10, pady=15)
        cb1 = ttk.Combobox(top, values=users, state="readonly")
        cb1.grid(row=0, column=1, padx=10, pady=15)
        
        tk.Label(top, text="User 2:").grid(row=1, column=0, padx=10, pady=5)
        cb2 = ttk.Combobox(top, values=users, state="readonly")
        cb2.grid(row=1, column=1, padx=10, pady=5)
        
        def do_remove():
            u1, u2 = cb1.get(), cb2.get()
            if u1 and u2:
                try:
                    self.graph.remove_connection(u1, u2)
                    self.update_ui()
                    self.save_data()
                    messagebox.showinfo("Success", f"Connection removed: {u1} \u2194 {u2}")
                    top.destroy()
                except ValueError as e:
                    messagebox.showerror("Error", str(e))
        tk.Button(top, text="Remove Connection", bg="#f44336", fg="white", command=do_remove).grid(row=2, column=0, columnspan=2, pady=20)

    def reset_data(self):
        if messagebox.askyesno("Confirm", "Reset network to sample dataset? All custom data will be lost."):
            data.load_sample_network(self.graph)
            self.update_ui()
            self.clear_results()
            self.save_data()
            messagebox.showinfo("Success", "Sample data loaded.")
            
    def save_data(self):
        data.save_network(self.graph)
        
    def clear_results(self):
        for w in [self.bfs_result_text, self.dfs_result_text, self.soc_result_text]:
            w.config(state=tk.NORMAL)
            w.delete(1.0, tk.END)
            w.config(state=tk.DISABLED)

    # --- Actions ---
    def run_bfs(self):
        u1 = self.bfs_from_var.get()
        u2 = self.bfs_to_var.get()
        if not u1 or not u2:
            messagebox.showwarning("Input needed", "Please select both From and To users.")
            return
            
        try:
            path, degrees = bfs_shortest_path(self.graph, u1, u2)
            self.bfs_result_text.config(state=tk.NORMAL)
            self.bfs_result_text.delete(1.0, tk.END)
            
            if path is None:
                self.bfs_result_text.insert(tk.END, f"No connection path exists between {u1} and {u2}.\n")
            else:
                self.bfs_result_text.insert(tk.END, "Shortest Connection Path:\n\n")
                self.bfs_result_text.insert(tk.END, " \u2192 ".join(path) + "\n\n")
                self.bfs_result_text.insert(tk.END, f"Degrees of Separation: {degrees}")
                
            self.bfs_result_text.config(state=tk.DISABLED)
        except ValueError as e:
            messagebox.showerror("Error", str(e))

    def run_dfs(self):
        u = self.dfs_start_var.get()
        if not u:
            messagebox.showwarning("Input needed", "Please select a Start User for DFS.")
            return
            
        try:
            traversal = dfs_traversal(self.graph, u)
            self.dfs_result_text.config(state=tk.NORMAL)
            self.dfs_result_text.delete(1.0, tk.END)
            
            self.dfs_result_text.insert(tk.END, "DFS Traversal Order:\n\n")
            
            # Formatting to wrap if it gets too long
            line_len = 0
            for i, user in enumerate(traversal):
                segment = user + (" \u2192 " if i < len(traversal)-1 else "")
                if line_len + len(segment) > 50:
                    self.dfs_result_text.insert(tk.END, "\n")
                    line_len = 0
                self.dfs_result_text.insert(tk.END, segment)
                line_len += len(segment)
                
            self.dfs_result_text.config(state=tk.DISABLED)
        except ValueError as e:
            messagebox.showerror("Error", str(e))
            
    def show_mutual_friends(self):
        u1 = self.bfs_from_var.get()
        u2 = self.bfs_to_var.get()
        if not u1 or not u2:
            messagebox.showwarning("Input needed", "Please select two users in the BFS section first to find mutual friends.")
            return
            
        if u1 == u2:
            messagebox.showwarning("Input Error", "Please select two different users.")
            return
            
        try:
            mutual = get_mutual_friends(self.graph, u1, u2)
            self.soc_result_text.config(state=tk.NORMAL)
            self.soc_result_text.delete(1.0, tk.END)
            
            self.soc_result_text.insert(tk.END, f"Mutual Friends between {u1} and {u2}:\n\n")
            if mutual:
                self.soc_result_text.insert(tk.END, ", ".join(mutual))
            else:
                self.soc_result_text.insert(tk.END, "None found.")
                
            self.soc_result_text.config(state=tk.DISABLED)
        except ValueError as e:
            messagebox.showerror("Error", str(e))
            
    def show_suggestions(self):
        u = self.dfs_start_var.get() or self.bfs_from_var.get()
        if not u:
            messagebox.showwarning("Input needed", "Please select a user in BFS 'From' or DFS 'Start User' dropdown.")
            return
            
        try:
            suggestions = get_connection_suggestions(self.graph, u)
            self.soc_result_text.config(state=tk.NORMAL)
            self.soc_result_text.delete(1.0, tk.END)
            
            self.soc_result_text.insert(tk.END, f"Suggested Connections for {u}:\n\n")
            if suggestions:
                for s_u, count in suggestions:
                    self.soc_result_text.insert(tk.END, f"• {s_u} — {count} mutual connection(s)\n")
            else:
                self.soc_result_text.insert(tk.END, "No new suggestions available.")
                
            self.soc_result_text.config(state=tk.DISABLED)
        except ValueError as e:
            messagebox.showerror("Error", str(e))
