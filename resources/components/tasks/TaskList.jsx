import React, { useState } from 'react';
import { updateTask , deleteTask} from '../../js/api';

const STATUSES      = ['todo', 'in_progress', 'done'];
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const PRIORITY_COLORS = {
    low:    { background: '#dcfce7', color: '#15803d' },
    medium: { background: '#fef9c3', color: '#a16207' },
    high:   { background: '#fee2e2', color: '#dc2626' },
};

function TaskRow({ task, onStatusChange }) {
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError]       = useState('');

    const changeStatus = async (e) => {
        const newStatus = e.target.value;
        if (newStatus === task.status) return;
        setError('');
        setUpdating(true);
        try {
            await updateTask(task.id, { status: newStatus });
            onStatusChange();
        } catch (err) {
            setError(
                err.response?.data?.errors?.status?.[0] ??
                err.response?.data?.message ??
                'Update failed.'
            );
        } finally {
            setUpdating(false);
        }
    };

    const remove = async () => {
        if (!window.confirm(`Delete "${task.title}"?`)) return;
        setDeleting(true);
        try {
            await deleteTask(task.id);
            onStatusChange();
        } catch (err) {
            console.error(err);
            alert('Failed to delete task.');
        } finally {
            setDeleting(false);
        }
    };

    const isOverdue = task.due_date
        && new Date(task.due_date) < new Date()
        && task.status !== 'done';

    return (
        <tr style={styles.row}>
            <td style={styles.td}>
                <span style={styles.taskTitle}>{task.title}</span>
                {task.description && (
                    <span style={styles.taskDesc}>{task.description}</span>
                )}
            </td>
            <td style={styles.td}>
                <span style={{ ...styles.badge, ...PRIORITY_COLORS[task.priority] }}>
                    {task.priority}
                </span>
            </td>
            <td style={styles.td}>
                <select
                    value={task.status}
                    onChange={changeStatus}
                    disabled={updating || task.status === 'done'}
                    style={{
                        ...styles.select,
                        opacity: task.status === 'done' ? 0.6 : 1,
                        cursor:  task.status === 'done' ? 'not-allowed' : 'pointer',
                    }}
                >
                    {STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                </select>
                {error && <div style={styles.statusError}>{error}</div>}
            </td>
            <td style={{ ...styles.td, color: isOverdue ? '#ef4444' : '#374151' }}>
                {task.due_date ?? '—'}
                {isOverdue && <span style={styles.overdueBadge}>Overdue</span>}
            </td>
            <td style={styles.td}>
                <button
                    onClick={remove}
                    disabled={deleting}
                    style={deleting ? styles.deleteBtnDisabled : styles.deleteBtn}
                >
                    {deleting ? '...' : 'Delete'}
                </button>
            </td>
        </tr>
    );
}

export default function TaskList({ tasks = [], onRefresh }) {
    if (tasks.length === 0) {
        return (
            <div style={styles.empty}>
                No tasks found. Create one above!
            </div>
        );
    }

    return (
        <table style={styles.table}>
            <thead>
                <tr>
                    {['Title', 'Priority', 'Status', 'Due Date', 'Actions'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <TaskRow key={task.id} task={task} onStatusChange={onRefresh} />
                ))}
            </tbody>
        </table>
    );
}

const styles = {
    table:             { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' },
    th:                { textAlign: 'left', padding: '10px 14px', background: '#f1f5f9', fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0', color: '#475569' },
    row:               { borderBottom: '1px solid #f1f5f9' },
    td:                { padding: '10px 14px', fontSize: 14, verticalAlign: 'top' },
    taskTitle:         { display: 'block', fontWeight: 500, color: '#1e293b' },
    taskDesc:          { display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 2 },
    badge:             { display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'capitalize' },
    select:            { padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 5, fontSize: 13, background: '#fff' },
    statusError:       { color: '#ef4444', fontSize: 11, marginTop: 4, maxWidth: 180 },
    deleteBtn:         { background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 5, padding: '4px 12px', cursor: 'pointer', fontSize: 13 },
    deleteBtnDisabled: { background: '#f1f5f9', color: '#94a3b8', border: 'none', borderRadius: 5, padding: '4px 12px', cursor: 'not-allowed', fontSize: 13 },
    overdueBadge:      { marginLeft: 6, background: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4 },
    empty:             { textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 15 },
};