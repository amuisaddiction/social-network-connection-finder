import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { Network, Search, GitGraph, Users, UserPlus, UserMinus, Link as LinkIcon, Unlink, Play, BarChart2 } from 'lucide-react'

import { Graph } from './dsa/Graph'
import { bfsShortestPath, dfsTraversal, getMutualFriends, getConnectionSuggestions } from './dsa/algorithms'
import { loadSampleNetwork } from './dsa/data'

const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function App() {
  const [graph] = useState(() => new Graph())
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [users, setUsers] = useState([])
  
  // UI State
  const [activeTab, setActiveTab] = useState('manage')
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', message: '' }

  // Inputs
  const [newUserName, setNewUserName] = useState('')
  const [selectedUser1, setSelectedUser1] = useState('')
  const [selectedUser2, setSelectedUser2] = useState('')
  
  // BFS
  const [bfsStart, setBfsStart] = useState('')
  const [bfsEnd, setBfsEnd] = useState('')
  const [bfsResult, setBfsResult] = useState(null)

  // DFS
  const [dfsStart, setDfsStart] = useState('')
  const [dfsResult, setDfsResult] = useState(null)
  
  // Mutual
  const [mutual1, setMutual1] = useState('')
  const [mutual2, setMutual2] = useState('')
  const [mutualResult, setMutualResult] = useState(null)
  
  // Suggestions
  const [suggUser, setSuggUser] = useState('')
  const [suggResult, setSuggResult] = useState(null)

  const [compStart, setCompStart] = useState('')
  const [compEnd, setCompEnd] = useState('')
  const [compResult, setCompResult] = useState(null)


  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  const syncGraphState = useCallback(() => {
    const allUsers = graph.getUsers().sort()
    setUsers(allUsers)
    
    // Build react-force-graph data
    const nodes = allUsers.map(id => ({ id, name: id, color: stringToColor(id) }))
    const links = []
    const seenEdges = new Set()
    
    for (const u of allUsers) {
      for (const v of graph.getConnections(u)) {
        const edgeKey = [u, v].sort().join('-')
        if (!seenEdges.has(edgeKey)) {
          seenEdges.add(edgeKey)
          links.push({ source: u, target: v })
        }
      }
    }
    setGraphData({ nodes, links })
  }, [graph])

  useEffect(() => {
    loadSampleNetwork(graph)
    syncGraphState()
  }, [graph, syncGraphState])

  // --- Handlers ---
  const handleAddUser = () => {
    try {
      graph.addUser(newUserName)
      setNewUserName('')
      syncGraphState()
      showFeedback('success', `User '${newUserName}' added successfully.`)
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleRemoveUser = () => {
    try {
      if (!selectedUser1) throw new Error("Please select a user to remove.")
      graph.removeUser(selectedUser1)
      setSelectedUser1('')
      syncGraphState()
      showFeedback('success', `User '${selectedUser1}' removed.`)
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleAddConnection = () => {
    try {
      if (!selectedUser1 || !selectedUser2) throw new Error("Select two users.")
      graph.addConnection(selectedUser1, selectedUser2)
      syncGraphState()
      showFeedback('success', `Connection added between ${selectedUser1} and ${selectedUser2}.`)
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleRemoveConnection = () => {
    try {
      if (!selectedUser1 || !selectedUser2) throw new Error("Select two users.")
      graph.removeConnection(selectedUser1, selectedUser2)
      syncGraphState()
      showFeedback('success', `Connection removed between ${selectedUser1} and ${selectedUser2}.`)
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleBFS = () => {
    try {
      if (!bfsStart || !bfsEnd) throw new Error("Please select both a Start User and a Target User.")
      const startTime = performance.now();
      const { path, degrees } = bfsShortestPath(graph, bfsStart, bfsEnd);
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      setBfsResult({ path, degrees, executionTime })
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleDFS = () => {
    try {
      if (!dfsStart) throw new Error("Please select a Starting User.")
      const startTime = performance.now();
      const traversal = dfsTraversal(graph, dfsStart);
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      setDfsResult({ traversal, executionTime })
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleMutual = () => {
    try {
      const mutual = getMutualFriends(graph, mutual1, mutual2)
      setMutualResult(mutual)
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleSuggestions = () => {
    try {
      const suggestions = getConnectionSuggestions(graph, suggUser)
      setSuggResult(suggestions)
    } catch (e) {
      showFeedback('error', e.message)
    }


  const handleComparison = () => {
    try {
      if (!compStart || !compEnd) throw new Error("Please select both a Start User and a Target User.")
      
      const runBFS = (start, end) => {
        const t0 = performance.now()
        let visitedCount = 0;
        let path = null;
        if (start === end) {
          return { found: 'Yes', path: [start], pathLength: 0, visited: 1, time: performance.now() - t0 };
        }
        const queue = [start];
        const visited = new Set([start]);
        const parentMap = new Map();
        parentMap.set(start, null);
        
        while (queue.length > 0) {
          const current = queue.shift();
          visitedCount++;
          
          if (current === end) {
            const p = [];
            let curr = end;
            while(curr) { p.push(curr); curr = parentMap.get(curr); }
            p.reverse();
            path = p;
            break;
          }
          
          for (const neighbor of graph.adjList.get(current) || []) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              parentMap.set(neighbor, current);
              queue.push(neighbor);
            }
          }
        }
        const t1 = performance.now()
        return { 
          found: path ? 'Yes' : 'No', 
          path: path, 
          pathLength: path ? path.length - 1 : '-', 
          visited: visitedCount, 
          time: t1 - t0 
        }
      }

      const runDFS = (start, end) => {
        const t0 = performance.now()
        let visitedCount = 0;
        let path = null;
        
        const visited = new Set();
        const parentMap = new Map();
        parentMap.set(start, null);
        
        const dfsRecursive = (user) => {
          visitedCount++;
          visited.add(user);
          if (user === end) {
            const p = [];
            let curr = end;
            while(curr) { p.push(curr); curr = parentMap.get(curr); }
            p.reverse();
            path = p;
            return true;
          }
          const neighbors = Array.from(graph.adjList.get(user)).sort();
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              parentMap.set(neighbor, user);
              if (dfsRecursive(neighbor)) return true;
            }
          }
          return false;
        }
        dfsRecursive(start);
        
        const t1 = performance.now()
        return { 
          found: path ? 'Yes' : 'No', 
          path: path, 
          pathLength: path ? path.length - 1 : '-', 
          visited: visitedCount, 
          time: t1 - t0 
        }
      }

      const bfsRes = runBFS(compStart, compEnd);
      const dfsRes = runDFS(compStart, compEnd);
      
      setCompResult({ bfs: bfsRes, dfs: dfsRes, start: compStart, end: compEnd });
    } catch (e) {
      showFeedback('error', e.message)
    }
  }
  }

  const renderDropdown = (val, setVal, label) => (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-slate-500 mb-1">{label}</label>
      <select 
        value={val} 
        onChange={(e) => setVal(e.target.value)}
        className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
      >
        <option value="">Select user...</option>
        {users.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Network size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Social Network Connection Finder</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Graph • BFS • DFS</p>
            </div>
          </div>
          <div className="hidden sm:flex space-x-3 text-sm">
            <button onClick={() => { loadSampleNetwork(graph); syncGraphState() }} className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md font-medium transition-colors">
              Load Sample Network
            </button>
            <button onClick={() => { graph.clear(); syncGraphState() }} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md font-medium transition-colors">
              Clear Network
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visualization & Stats */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><GitGraph size={20} /></div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Connections</p>
                <p className="text-2xl font-bold text-slate-900">{graphData.links.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Status</p>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-slate-700">Live</span>
              </div>
            </div>
          </div>

          {/* Graph Visualization */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800 flex items-center"><Network className="mr-2" size={18} /> Network Visualization</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></span> User</span>
                <span className="flex items-center"><span className="w-4 h-[2px] bg-slate-300 mr-1"></span> Friendship</span>
              </div>
            </div>
            <div className="flex-1 bg-slate-50/50 relative">
              {users.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">No users in the network yet.</div>
              ) : (
                <Fragment>
                  <ForceGraph2D
                    graphData={graphData}
                    nodeLabel="id"
                    linkColor={() => '#cbd5e1'}
                    linkWidth={2}
                    width={800}
                    height={450}
                    cooldownTicks={100}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                      const label = node.name;
                      const fontSize = 12/globalScale;
                      ctx.font = `${fontSize}px Sans-Serif`;
                      
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
                      ctx.fillStyle = node.color || '#6366f1';
                      ctx.fill();

                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'top';
                      ctx.fillStyle = '#1e293b';
                      ctx.fillText(label, node.x, node.y + 8);
                    }}
                    onNodeDragEnd={node => {
                      node.fx = node.x;
                      node.fy = node.y;
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 text-xs max-h-40 overflow-y-auto min-w-[120px]">
                    <div className="font-semibold text-slate-700 mb-2 border-b border-slate-200 pb-1">Network Legend</div>
                    {users.map(u => (
                      <div key={u} className="flex items-center space-x-2 mb-1.5">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: stringToColor(u)}}></div>
                        <span className="text-slate-600 font-medium">{u}</span>
                      </div>
                    ))}
                  </div>
                </Fragment>
              )}
            </div>
          </div>

          {/* Adjacency List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Adjacency List (DSA Internal Representation)</h2>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto font-mono text-sm text-slate-700 bg-slate-900">
               {users.map(u => (
                 <div key={u} className="mb-1 text-slate-300">
                   <span className="text-indigo-400 font-bold">{u}</span>: [{graph.getConnections(u).sort().join(', ')}]
                 </div>
               ))}
               {users.length === 0 && <span className="text-slate-500">Empty graph</span>}
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Feedback Alert */}
          {feedback && (
            <div className={`p-4 rounded-lg flex items-start shadow-sm border ${feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <div className="font-medium text-sm">{feedback.message}</div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50">
              {[
                { id: 'manage', label: 'Manage' },
                { id: 'bfs', label: 'BFS (Shortest Path)' },
                { id: 'dfs', label: 'DFS (Explore)' },
                { id: 'social', label: 'Social Features' },
                { id: 'comparison', label: '⚖️ Algorithm Comparison' },
                { id: 'analysis', label: '📊 Algorithm Analysis' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === t.id ? 'border-indigo-500 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              
              {/* MANAGE TAB */}
              {activeTab === 'manage' && (
                <div className="space-y-8">
                  {/* Add User */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center"><UserPlus size={16} className="mr-2 text-indigo-500" /> Add New User</h3>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder="Username" 
                        value={newUserName}
                        onChange={e => setNewUserName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={e => e.key === 'Enter' && handleAddUser()}
                      />
                      <button onClick={handleAddUser} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">Add</button>
                    </div>
                  </div>
                  
                  {/* Remove User */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center"><UserMinus size={16} className="mr-2 text-red-500" /> Remove User</h3>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        {renderDropdown(selectedUser1, setSelectedUser1, "Select User")}
                      </div>
                      <button onClick={handleRemoveUser} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors font-medium">Remove</button>
                    </div>
                  </div>

                  {/* Connections */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center"><LinkIcon size={16} className="mr-2 text-indigo-500" /> Manage Connections</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {renderDropdown(selectedUser1, setSelectedUser1, "User A")}
                      {renderDropdown(selectedUser2, setSelectedUser2, "User B")}
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={handleAddConnection} className="flex-1 flex justify-center items-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors font-medium">
                        <LinkIcon size={16} className="mr-2" /> Add Connection
                      </button>
                      <button onClick={handleRemoveConnection} className="flex-1 flex justify-center items-center px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors font-medium">
                        <Unlink size={16} className="mr-2" /> Remove Connection
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* BFS TAB */}
              {activeTab === 'bfs' && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 text-indigo-800 p-4 rounded-lg text-sm border border-indigo-100">
                    <strong>Breadth-First Search (BFS)</strong> finds the shortest connection path between two users in an unweighted social network.
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderDropdown(bfsStart, setBfsStart, "Start User")}
                    {renderDropdown(bfsEnd, setBfsEnd, "Target User")}
                  </div>
                  <button onClick={handleBFS} className="w-full flex justify-center items-center px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold shadow-sm">
                    <Search size={18} className="mr-2" /> Find Shortest Path
                  </button>

                  {bfsResult && (
                    <div className="mt-4 border border-slate-200 rounded-xl p-5 bg-slate-50 shadow-inner">
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Result</h4>
                      {bfsResult.path ? (
                        <>
                          <div className="flex items-center flex-wrap gap-2 text-lg font-medium text-slate-800 mb-4">
                            {bfsResult.path.map((u, i) => (
                              <React.Fragment key={u}>
                                <span className="bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm">{u}</span>
                                {i < bfsResult.path.length - 1 && <span className="text-slate-400">→</span>}
                              </React.Fragment>
                            ))}
                          </div>
                          <p className="text-sm text-slate-600 font-medium">Degrees of Separation: <span className="text-indigo-600 font-bold text-base">{bfsResult.degrees}</span></p>
                        </>
                      ) : (
                        <p className="text-red-600 font-medium bg-red-50 p-3 rounded border border-red-100">No path exists between {bfsStart} and {bfsEnd}.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* DFS TAB */}
              {activeTab === 'dfs' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100">
                    <strong>Depth-First Search (DFS)</strong> explores the network by traversing as deep as possible along each branch before backtracking.
                  </div>
                  {renderDropdown(dfsStart, setDfsStart, "Starting User")}
                  <button onClick={handleDFS} className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                    <Play size={18} className="mr-2" /> Run DFS Traversal
                  </button>

                  {dfsResult && (
                    <div className="mt-4 border border-slate-200 rounded-xl p-5 bg-slate-50 shadow-inner">
                       <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Traversal Order</h4>
                       <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-slate-700">
                          {dfsResult.map((u, i) => (
                            <React.Fragment key={u}>
                              <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{u}</span>
                              {i < dfsResult.length - 1 && <span className="text-slate-400">→</span>}
                            </React.Fragment>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOCIAL TAB */}
              {activeTab === 'social' && (
                <div className="space-y-8">
                  {/* Mutual Friends */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Mutual Friends</h3>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      {renderDropdown(mutual1, setMutual1, "User A")}
                      {renderDropdown(mutual2, setMutual2, "User B")}
                    </div>
                    <button onClick={handleMutual} className="w-full mb-4 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors font-medium">Find Mutual Friends</button>
                    
                    {mutualResult && (
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        {mutualResult.length > 0 ? (
                          <>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{mutualResult.length} Mutual Friends</p>
                            <div className="flex flex-wrap gap-2">
                              {mutualResult.map(u => <span key={u} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700">{u}</span>)}
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No mutual friends found.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4 border-b pb-2">Connection Suggestions</h3>
                    <div className="mb-3">
                      {renderDropdown(suggUser, setSuggUser, "Select User for Suggestions")}
                    </div>
                    <button onClick={handleSuggestions} className="w-full mb-4 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors font-medium">Get Suggestions</button>
                    
                    {suggResult && (
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        {suggResult.length > 0 ? (
                           <ul className="space-y-2">
                             {suggResult.map(([u, count]) => (
                               <li key={u} className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-md shadow-sm">
                                 <span className="font-semibold text-slate-800">{u}</span>
                                 <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{count} mutual connection{count !== 1 ? 's' : ''}</span>
                               </li>
                             ))}
                           </ul>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No new suggestions available.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COMPARISON TAB */}
              {activeTab === 'comparison' && (
                <div className="p-6 space-y-6 animate-in fade-in duration-300">
                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">04 / Algorithm Comparison</p>
                    <h2 className="text-2xl font-bold text-slate-900">BFS vs DFS — Same Query</h2>
                  </div>
                  
                  {/* Controls */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-end gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start User</label>
                      <select
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500"
                        value={compStart}
                        onChange={(e) => setCompStart(e.target.value)}
                      >
                        <option value="">Select user...</option>
                        {users.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Target User</label>
                      <select
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500"
                        value={compEnd}
                        onChange={(e) => setCompEnd(e.target.value)}
                      >
                        <option value="">Select user...</option>
                        {users.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleComparison}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm font-medium transition-colors"
                    >
                      Compare
                    </button>
                  </div>
                  
                  {/* Results Table */}
                  {compResult && (
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full text-sm text-left border-y border-slate-200">
                        <thead className="bg-slate-50/50 text-slate-900 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-4 font-bold">Metric</th>
                            <th className="px-4 py-4 font-bold">BFS</th>
                            <th className="px-4 py-4 font-bold">DFS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-transparent">
                          <tr>
                            <td className="px-4 py-4 font-medium text-slate-600">Found</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.bfs.found}</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.dfs.found}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-medium text-slate-600">Traversal</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.bfs.path ? compResult.bfs.path.join(' → ') : '-'}</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.dfs.path ? compResult.dfs.path.join(' → ') : '-'}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-medium text-slate-600">Path</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.bfs.path ? compResult.bfs.path.join(' → ') : '-'}</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.dfs.path ? compResult.dfs.path.join(' → ') : '-'}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-medium text-slate-600">Path Length</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.bfs.pathLength}</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.dfs.pathLength}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-medium text-slate-600">Nodes Visited</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.bfs.visited}</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.dfs.visited}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-medium text-slate-600">Execution Time</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.bfs.time.toFixed(4)} ms</td>
                            <td className="px-4 py-4 text-slate-900">{compResult.dfs.time.toFixed(4)} ms</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-medium text-slate-600">Complexity</td>
                            <td className="px-4 py-4 text-slate-900">O(V + E), O(V)</td>
                            <td className="px-4 py-4 text-slate-900">O(V + E), O(V)</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="mt-6 bg-slate-100 rounded-md p-4 text-sm text-slate-600">
                        For {compResult.start} → {compResult.end}, both algorithms ran on the same graph. BFS guarantees a shortest path in an unweighted graph; DFS does not. Execution time is an experimental measurement and can vary.
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'analysis' && (
                <div className="p-6 space-y-8 animate-in fade-in duration-300">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-800">Algorithm Analysis</h2>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2 border-b pb-2">A. GRAPH ANALYSIS</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mb-3">
                      <li>Users are vertices/nodes.</li>
                      <li>Friendships are edges.</li>
                      <li>The graph is undirected.</li>
                      <li>The graph uses an adjacency list.</li>
                    </ul>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm mb-2">
                      <span className="font-semibold text-slate-700">Graph Storage Complexity:</span> <strong className="font-mono text-xs">O(V + E)</strong>
                    </div>
                    <p className="text-xs text-slate-500 italic">V = number of users/vertices, E = number of friendships/edges</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2 border-b pb-2">B. BFS ANALYSIS</h3>
                    <p className="text-sm text-slate-700 mb-1"><strong>Algorithm:</strong> Breadth First Search</p>
                    <p className="text-sm text-slate-700 mb-2"><strong>Used in this project for:</strong> Finding the shortest connection path between two users.</p>
                    <p className="text-sm text-slate-700 mb-1"><strong>Uses:</strong></p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mb-3">
                      <li>Queue</li>
                      <li>Visited Set</li>
                      <li>Parent/path tracking</li>
                    </ul>
                    <p className="text-sm text-slate-700 mb-1 font-medium">Working step-by-step:</p>
                    <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-1 mb-3">
                      <li>Start from the selected user.</li>
                      <li>Add the user to the queue.</li>
                      <li>Mark the user as visited.</li>
                      <li>Remove the front user.</li>
                      <li>Check its neighbours.</li>
                      <li>Add unvisited neighbours.</li>
                      <li>Continue until the target is found or the queue is empty.</li>
                    </ol>
                    <div className="flex gap-4">
                      <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-sm px-4">
                        <span className="text-indigo-700">Time: <strong className="font-mono text-xs">O(V + E)</strong></span>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-sm px-4">
                        <span className="text-indigo-700">Space: <strong className="font-mono text-xs">O(V)</strong></span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2 border-b pb-2">C. DFS ANALYSIS</h3>
                    <p className="text-sm text-slate-700 mb-1"><strong>Algorithm:</strong> Depth First Search</p>
                    <p className="text-sm text-slate-700 mb-2"><strong>Used in this project for:</strong> Exploring the network from a starting user.</p>
                    <p className="text-sm text-slate-700 mb-1"><strong>Uses:</strong></p>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mb-3">
                      <li>Recursion / Call Stack</li>
                      <li>Visited Set</li>
                    </ul>
                    <p className="text-sm text-slate-700 mb-1 font-medium">Working step-by-step:</p>
                    <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-1 mb-3">
                      <li>Start from the selected user.</li>
                      <li>Mark the user as visited.</li>
                      <li>Visit an unvisited neighbour.</li>
                      <li>Continue deeper.</li>
                      <li>Backtrack when necessary.</li>
                      <li>Continue until all reachable users are explored.</li>
                    </ol>
                    <div className="flex gap-4">
                      <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-sm px-4">
                        <span className="text-blue-700">Time: <strong className="font-mono text-xs">O(V + E)</strong></span>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-sm px-4">
                        <span className="text-blue-700">Space: <strong className="font-mono text-xs">O(V)</strong></span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b pb-2">D. COMPLEXITY ANALYSIS</h3>
                    <div className="overflow-x-auto mb-2">
                      <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-4 py-2 border-b font-semibold">Component</th>
                            <th className="px-4 py-2 border-b font-semibold">Time</th>
                            <th className="px-4 py-2 border-b font-semibold">Space</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr><td className="px-4 py-2 font-medium text-slate-700">Graph Storage</td><td className="px-4 py-2 text-slate-600">—</td><td className="px-4 py-2 text-slate-600 font-mono text-xs">O(V + E)</td></tr>
                          <tr><td className="px-4 py-2 font-medium text-slate-700">BFS</td><td className="px-4 py-2 text-slate-600 font-mono text-xs">O(V + E)</td><td className="px-4 py-2 text-slate-600 font-mono text-xs">O(V)</td></tr>
                          <tr><td className="px-4 py-2 font-medium text-slate-700">DFS</td><td className="px-4 py-2 text-slate-600 font-mono text-xs">O(V + E)</td><td className="px-4 py-2 text-slate-600 font-mono text-xs">O(V)</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-500 italic">V and E represent the input size, so Big-O describes how the algorithm scales as V and E grow.</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2 border-b pb-2">E. WHY ADJACENCY LIST?</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      <li>Stores each user's connected neighbours.</li>
                      <li>Suitable for a relatively sparse social network.</li>
                      <li>BFS and DFS can directly access neighbours.</li>
                      <li>Storage complexity is O(V + E).</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b pb-2">F. PROJECT USAGE</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
                        <div className="font-bold text-slate-800 text-sm mb-1">GRAPH</div>
                        <div className="text-sm text-slate-600">Stores users and friendships.</div>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm">
                        <div className="font-bold text-indigo-800 text-sm mb-1">BFS</div>
                        <div className="text-sm text-indigo-700">Finds shortest connection path.</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                        <div className="font-bold text-blue-800 text-sm mb-1">DFS</div>
                        <div className="text-sm text-blue-700">Explores the network.</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b pb-2">G. VIVA QUICK REFERENCE</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="font-medium text-slate-700">Graph</span> <span className="text-slate-600">Vertices + Edges</span></div>
                      <div className="flex justify-between"><span className="font-medium text-slate-700">BFS</span> <span className="text-slate-600">Queue + Shortest Path</span></div>
                      <div className="flex justify-between"><span className="font-medium text-slate-700">DFS</span> <span className="text-slate-600">Recursion/Stack + Network Exploration</span></div>
                      <div className="flex justify-between"><span className="font-medium text-slate-700">Graph Representation</span> <span className="text-slate-600">Adjacency List</span></div>
                      <div className="flex justify-between"><span className="font-medium text-slate-700">BFS Complexity</span> <span className="text-slate-600 font-mono text-xs">O(V + E)</span></div>
                      <div className="flex justify-between"><span className="font-medium text-slate-700">DFS Complexity</span> <span className="text-slate-600 font-mono text-xs">O(V + E)</span></div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
