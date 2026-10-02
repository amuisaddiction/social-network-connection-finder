import streamlit as st
import networkx as nx
import matplotlib.pyplot as plt
from graph import Graph
from algorithms import bfs_shortest_path, dfs_traversal, get_mutual_friends, get_connection_suggestions
import data

st.set_page_config(page_title="Social Network Connection Finder", layout="wide")

st.title("Social Network Connection Finder")
st.markdown("**Graph • BFS • DFS • Shortest Connection**")

# Initialize graph in session state
if 'graph' not in st.session_state:
    g = Graph()
    data.load_sample_network(g)
    st.session_state.graph = g

g = st.session_state.graph

users = sorted(g.get_users())

# Layout
col1, col2 = st.columns([1, 1])

with col1:
    st.header("1. Network Management")
    with st.expander("Add / Remove Users & Connections"):
        c1, c2 = st.columns(2)
        new_user = c1.text_input("New User Name")
        if c1.button("Add User"):
            try:
                g.add_user(new_user)
                st.success(f"User {new_user} added!")
                st.rerun()
            except ValueError as e:
                st.error(str(e))
                
        remove_user = c2.selectbox("Remove User", [""] + users)
        if c2.button("Remove User") and remove_user:
            try:
                g.remove_user(remove_user)
                st.success(f"User {remove_user} removed!")
                st.rerun()
            except ValueError as e:
                st.error(str(e))

        st.markdown("---")
        c3, c4 = st.columns(2)
        u1 = c3.selectbox("User 1", [""] + users, key="u1")
        u2 = c4.selectbox("User 2", [""] + users, key="u2")
        
        if st.button("Add Connection"):
            if u1 and u2:
                try:
                    g.add_connection(u1, u2)
                    st.success(f"Connection added between {u1} and {u2}")
                    st.rerun()
                except ValueError as e:
                    st.error(str(e))
                    
        if st.button("Remove Connection"):
            if u1 and u2:
                try:
                    g.remove_connection(u1, u2)
                    st.success(f"Connection removed between {u1} and {u2}")
                    st.rerun()
                except ValueError as e:
                    st.error(str(e))
                    
        if st.button("Reset to Sample Data"):
            data.load_sample_network(g)
            st.success("Sample data loaded!")
            st.rerun()

    st.header("2. Shortest Connection (BFS)")
    c_from, c_to = st.columns(2)
    bfs_from = c_from.selectbox("From:", users, key="bfs_from")
    bfs_to = c_to.selectbox("To:", users, key="bfs_to")
    
    if st.button("Find Shortest Path"):
        if bfs_from and bfs_to:
            path, degrees = bfs_shortest_path(g, bfs_from, bfs_to)
            if path:
                st.success(f"**Path found!** Degrees of Separation: {degrees}")
                st.info(" → ".join(path))
            else:
                st.error(f"No path exists between {bfs_from} and {bfs_to}.")

    st.header("3. Network Exploration (DFS)")
    dfs_start = st.selectbox("Start User:", users, key="dfs_start")
    
    if st.button("Run DFS Traversal"):
        if dfs_start:
            traversal = dfs_traversal(g, dfs_start)
            st.success("DFS Traversal Order:")
            st.info(" → ".join(traversal))

    st.header("4. Social Features")
    if st.button("Find Mutual Friends"):
        if bfs_from and bfs_to:
            if bfs_from != bfs_to:
                mutual = get_mutual_friends(g, bfs_from, bfs_to)
                if mutual:
                    st.success(f"Mutual Friends between {bfs_from} and {bfs_to}:")
                    st.write(", ".join(mutual))
                else:
                    st.warning("No mutual friends found.")
            else:
                st.warning("Select different users.")
                
    if st.button("Connection Suggestions"):
        target = dfs_start
        suggestions = get_connection_suggestions(g, target)
        if suggestions:
            st.success(f"Suggestions for {target}:")
            for u, count in suggestions:
                st.write(f"- **{u}** ({count} mutual connections)")
        else:
            st.warning(f"No new suggestions for {target}.")

with col2:
    st.header("Graph Visualization")
    # We use NetworkX ONLY for rendering the visual plot, NOT for algorithms.
    nx_g = nx.Graph()
    nx_g.add_nodes_from(users)
    for u in users:
        for v in g.adj_list[u]:
            nx_g.add_edge(u, v)
            
    fig, ax = plt.subplots(figsize=(6, 4))
    pos = nx.spring_layout(nx_g, seed=42)
    nx.draw(nx_g, pos, with_labels=True, node_color='lightblue', edge_color='gray', node_size=1500, font_size=10, ax=ax)
    st.pyplot(fig)
    
    st.header("Adjacency List (Internal Representation)")
    st.code("\n".join([f"{u}: {list(g.adj_list[u])}" for u in users]), language="text")

st.markdown("---")
st.markdown("*Note: The algorithms (BFS and DFS) are manually implemented using standard Python structures (`collections.deque`, `sets`). NetworkX is only used to draw the chart in this web demo.*")
