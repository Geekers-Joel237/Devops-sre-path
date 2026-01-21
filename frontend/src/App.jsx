import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError('Could not load tasks. Please ensure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      })
      
      if (!response.ok) throw new Error('Failed to add task')
      
      const task = await response.json()
      setTasks([...tasks, task])
      setNewTask('')
    } catch (err) {
      console.error(err)
      alert('Error adding task')
    }
  }

  const toggleTask = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      })

      if (!response.ok) throw new Error('Failed to update task')
      
      const updatedTask = await response.json()
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t))
    } catch (err) {
      console.error(err)
      alert('Error updating task')
    }
  }

  const deleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')
      
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      console.error(err)
      alert('Error deleting task')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Docker Path</div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black mb-6">Todo List</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Add
            </button>
          </form>

          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading tasks...</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <li className="py-4 text-center text-gray-500 italic">No tasks yet. Add one above!</li>
              ) : (
                tasks.map((task) => (
                  <li key={task.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id={`task-${task.id}`}
                        name={`task-${task.id}`}
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => toggleTask(task)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`ml-3 block text-sm font-medium ${
                          task.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'
                        }`}
                      >
                        {task.title}
                      </label>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="ml-4 text-sm text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
