import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { getTasks } from '../../js/api';

const STATUSES      = ['todo', 'in_progress', 'done'];
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

export default function TaskManager() {
    const [tasks, setTasks]       = useState([]);
    const [meta, setMeta]         = useState({ current_page: 1, last_page: 1 });
    const [page, setPage]         = useState(1);
    const [filters, setFilters]   = useState({ status: '', search: '', sort_by: 'created_at', sort_dir: 'desc' });
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getTasks({ ...filters, page });
            setTasks(Array.isArray(res.data.data) ? res.data.data : []);
            setMeta(res.data.meta ?? { current_page: 1, last_page: 1 });
        } catch {
            setError('Failed to load tasks.');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const handleFilter = (e) => {
        setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
        setPage(1);
    };

    const handleCreated = () => {
        setShowForm(false);  
        fetchTasks();        
    };

    return (
        <div style={styles.container}>

            <div style={styles.header}>
                <h1 style={styles.title}>Task Manager</h1>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} style={styles.addBtn}>
                        + Create Task
                    </button>
                )}
            </div>

            {showForm && (
                <TaskForm
                    onCreated={handleCreated}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {!showForm && (
                <>
                    <div style={styles.filters}>
                        <input
                            name="search"
                            placeholder="Search title..."
                            value={filters.search}
                            onChange={handleFilter}
                            style={styles.filterInput}
                        />
                        <select name="status" value={filters.status} onChange={handleFilter} style={styles.filterInput}>
                            <option value="">All statuses</option>
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                        </select>
                        <select name="sort_by" value={filters.sort_by} onChange={handleFilter} style={styles.filterInput}>
                            <option value="created_at">Sort: Created</option>
                            <option value="due_date">Sort: Due date</option>
                        </select>
                        <select name="sort_dir" value={filters.sort_dir} onChange={handleFilter} style={styles.filterInput}>
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    {loading
                        ? <p style={styles.loading}>Loading...</p>
                        : <TaskList tasks={tasks} onRefresh={fetchTasks} />
                    }

                    <div style={styles.pagination}>
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page <= 1}
                            style={page <= 1 ? styles.pageBtnDisabled : styles.pageBtn}
                        >
                            ← Prev
                        </button>
                        <span style={styles.pageInfo}>
                            Page {meta.current_page} of {meta.last_page}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= meta.last_page}
                            style={page >= meta.last_page ? styles.pageBtnDisabled : styles.pageBtn}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container:       { maxWidth: 960, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' },
    header:          { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    title:           { fontSize: 28, fontWeight: 700, color: '#1e293b', margin: 0 },
    addBtn:          { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    filters:         { display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' },
    filterInput:     { padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, minWidth: 140 },
    pagination:      { display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, fontSize: 14 },
    pageBtn:         { padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', cursor: 'pointer' },
    pageBtnDisabled: { padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc', color: '#cbd5e1', cursor: 'not-allowed' },
    pageInfo:        { color: '#64748b' },
    loading:         { color: '#64748b', padding: '20px 0' },
    error:           { color: '#ef4444', marginBottom: 12 },
};