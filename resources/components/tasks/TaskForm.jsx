import React, { useState } from 'react';
import { createTask } from '../../js/api';

const PRIORITIES = ['low', 'medium', 'high'];

export default function TaskForm({ onCreated, onCancel }) {
    const [form, setForm]       = useState({ title: '', description: '', priority: 'medium', due_date: '' });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await createTask(form);
            onCreated();  // closes form + refreshes list
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                setErrors({ general: ['Something went wrong. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>Create New Task</h2>
                <button type="button" onClick={onCancel} style={styles.closeBtn}>✕</button>
            </div>

            <form onSubmit={submit}>
                {errors.general && (
                    <div style={styles.errorBox}>{errors.general[0]}</div>
                )}

                <div style={styles.row}>
                    <div style={{ ...styles.field, flex: 2 }}>
                        <label style={styles.label}>TITLE *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handle}
                            placeholder="Enter task title..."
                            style={{ ...styles.input, borderColor: errors.title ? '#ef4444' : '#cbd5e1' }}
                        />
                        {errors.title && <span style={styles.fieldError}>{errors.title[0]}</span>}
                    </div>

                    <div style={{ ...styles.field, flex: 1 }}>
                        <label style={styles.label}>PRIORITY *</label>
                        <select name="priority" value={form.priority} onChange={handle} style={styles.input}>
                            {PRIORITIES.map(p => (
                                <option key={p} value={p}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </option>
                            ))}
                        </select>
                        {errors.priority && <span style={styles.fieldError}>{errors.priority[0]}</span>}
                    </div>

                    <div style={{ ...styles.field, flex: 1 }}>
                        <label style={styles.label}>DUE DATE *</label>
                        <input
                            name="due_date"
                            type="date"
                            value={form.due_date}
                            onChange={handle}
                            style={{ ...styles.input, borderColor: errors.due_date ? '#ef4444' : '#cbd5e1' }}
                        />
                        {errors.due_date && <span style={styles.fieldError}>{errors.due_date[0]}</span>}
                    </div>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>DESCRIPTION</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handle}
                        placeholder="Optional description..."
                        rows={3}
                        style={styles.input}
                    />
                </div>

                <div style={styles.actions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={styles.cancelBtn}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={loading ? styles.btnDisabled : styles.btn}
                    >
                        {loading ? 'Saving...' : 'Save Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    wrapper:     { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 28 },
    formHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    formTitle:   { fontSize: 18, fontWeight: 600, color: '#1e293b', margin: 0 },
    closeBtn:    { background: 'none', border: 'none', fontSize: 18, color: '#94a3b8', cursor: 'pointer', padding: '0 4px', lineHeight: 1 },
    row:         { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 },
    field:       { marginBottom: 14, display: 'flex', flexDirection: 'column' },
    label:       { fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, letterSpacing: '0.05em' },
    input:       { padding: '9px 11px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' },
    fieldError:  { color: '#ef4444', fontSize: 12, marginTop: 4 },
    errorBox:    { background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '8px 12px', marginBottom: 16, fontSize: 14 },
    actions:     { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 },
    btn:         { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
    btnDisabled: { background: '#93c5fd', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'not-allowed', fontWeight: 600, fontSize: 14 },
    cancelBtn:   { background: '#fff', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 500, fontSize: 14 },
};