import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { Network, Search, GitGraph, Users, UserPlus, UserMinus, Link as LinkIcon, Unlink, Play } from 'lucide-react'

import { Graph } from './dsa/Graph'
import { bfsShortestPath, dfsTraversal, getMutualFriends, getConnectionSuggestions } from './dsa/algorithms'
import { loadSampleNetwork } from './dsa/data'

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

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  const syncGraphState = useCallback(() => {
    const allUsers = graph.getUsers().sort()
    setUsers(allUsers)
    
    // Build react-force-graph data
    const nodes = allUsers.map(id => ({ id, name: id }))
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
      const { path, degrees } = bfsShortestPath(graph, bfsStart, bfsEnd)
      setBfsResult({ path, degrees })
    } catch (e) {
      showFeedback('error', e.message)
    }
  }

  const handleDFS = () => {
    try {
      if (!dfsStart) throw new Error("Please select a Starting User.")
      const traversal = dfsTraversal(graph, dfsStart)
      setDfsResult(traversal)
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
                <ForceGraph2D
                  graphData={graphData}
                  nodeLabel="id"
                  nodeColor={() => '#6366f1'}
                  nodeRelSize={6}
                  linkColor={() => '#cbd5e1'}
                  linkWidth={2}
                  width={800} // This will be constrained by parent div
                  height={450}
                  cooldownTicks={100}
                  onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                  }}
                />
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
                { id: 'social', label: 'Social Features' }
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
                       {dfsResult.length > 0 ? (
                         <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-slate-700">
                            {dfsResult.map((u, i) => (
                              <React.Fragment key={u}>
                                <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{u}</span>
                                {i < dfsResult.length - 1 && <span className="text-slate-400">→</span>}
                              </React.Fragment>
                            ))}
                         </div>
                       ) : (
                         <p className="text-slate-500 font-medium italic">No traversal result available.</p>
                       )}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
