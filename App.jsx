import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks from MongoDB
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_BASE_URL);
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axios.post(API_BASE_URL, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'Pending'
      });
      if (res.data.success) {
        setTasks((prev) => [res.data.data, ...prev]);
        setTitle('');
        setDescription('');
        setPriority('Medium');
      }
    } catch (err) {
      alert('Error creating task: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle task status
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await axios.put(`${API_BASE_URL}/${task._id}`, { status: nextStatus });
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? res.data.data : t))
        );
      }
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/${id}`);
      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      alert('Error deleting task: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'All') return true;
    return t.status === statusFilter;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div style={{ maxWidth: '780px', margin: '2rem auto', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0 1rem', color: '#1e293b' }}>
      {/* Header */}
      <header style={{ borderBottom: '2px solid #2563eb', paddingBottom: '12px', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 6px', color: '#1e40af', fontSize: '24px' }}>
          DevTrack: Developer Task & Project Management System
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Final Experiential Learning Capstone Project | Full MERN Architecture
        </p>
      </header>

      {/* Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
        <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }}>TOTAL TASKS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a' }}>{totalTasks}</div>
        </div>
        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 'bold' }}>PENDING</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#78350f' }}>{pendingTasks}</div>
        </div>
        <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>COMPLETED</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#14532d' }}>{completedTasks}</div>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleCreateTask} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#334155' }}>Create Project Task</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Task Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: '2 1 200px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ flex: '1 1 120px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '14px' }}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Short Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
          <button
            type="submit"
            style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Filter:</span>
        {['All', 'Pending', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              background: statusFilter === tab ? '#2563eb' : '#fff',
              color: statusFilter === tab ? '#fff' : '#475569',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading && <p style={{ color: '#2563eb', fontStyle: 'italic' }}>Synchronizing with database...</p>}
      {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {filteredTasks.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>No tasks found in this view.</p>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      onClick={() => handleToggleStatus(t)}
                      style={{
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '15px',
                        textDecoration: t.status === 'Completed' ? 'line-through' : 'none',
                        color: t.status === 'Completed' ? '#94a3b8' : '#0f172a'
                      }}
                    >
                      {t.title}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        backgroundColor: t.priority === 'High' ? '#fee2e2' : t.priority === 'Medium' ? '#fef3c7' : '#e0f2fe',
                        color: t.priority === 'High' ? '#991b1b' : t.priority === 'Medium' ? '#92400e' : '#0369a1'
                      }}
                    >
                      {t.priority}
                    </span>
                  </div>
                  {t.description && (
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                      {t.description}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => handleToggleStatus(t)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      background: t.status === 'Completed' ? '#f1f5f9' : '#dcfce7',
                      color: t.status === 'Completed' ? '#475569' : '#166534',
                      cursor: 'pointer'
                    }}
                  >
                    {t.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(t._id)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#ef4444',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}