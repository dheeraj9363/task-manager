import React from 'react';
import { createRoot } from 'react-dom/client';
import TaskManager from '../components/tasks';

createRoot(document.getElementById('app')).render(<TaskManager />);