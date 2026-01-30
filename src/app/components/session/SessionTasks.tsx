'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Plus, X } from 'lucide-react';

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface SessionTasksProps {
    bookingId: string;
}

export default function SessionTasks({ bookingId }: SessionTasksProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

    // Load tasks
    useEffect(() => {
        const saved = localStorage.getItem(`session_tasks_${bookingId}`);
        if (saved) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTasks(JSON.parse(saved));
                // eslint-disable-next-line react-hooks/exhaustive-deps
            } catch (e) {
                console.error("Failed to parse tasks", e);
            }
        } else {
            // Default tasks
            setTasks([
                { id: '1', text: 'Vocals', completed: false },
                { id: '2', text: 'Adlibs', completed: false },
                { id: '3', text: 'Rough Mix', completed: false }
            ]);
        }
    }, [bookingId]);

    // Save tasks
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem(`session_tasks_${bookingId}`, JSON.stringify(tasks));
        }
    }, [tasks, bookingId]);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const removeTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="glass-panel overflow-hidden bg-surface/30 border-white/5">
            <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare size={12} /> Session Goals
                </h3>
            </div>

            <div className="p-4 space-y-4">
                <form onSubmit={addTask} className="flex gap-2">
                    <input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add goal..."
                        className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-neutral-600 focus:border-void-purple focus:outline-none"
                    />
                    <button type="submit" className="p-1 bg-white/10 text-white rounded hover:bg-void-purple hover:text-white transition-colors">
                        <Plus size={14} />
                    </button>
                </form>

                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between group">
                            <button
                                onClick={() => toggleTask(task.id)}
                                className="flex items-center gap-2 text-left flex-1"
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500 text-black' : 'border-neutral-600 hover:border-white'}`}>
                                    {task.completed && <CheckSquare size={10} />}
                                </div>
                                <span className={`text-xs ${task.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                                    {task.text}
                                </span>
                            </button>
                            <button
                                onClick={() => removeTask(task.id)}
                                className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
