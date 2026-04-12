import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // Placeholder data
  const tasks = [
    { id: '101', title: 'Setup database', status: 'In Progress', priority: 'High', assignee: 'John Doe', dueDate: '2026-05-01' },
    { id: '102', title: 'Design landing page', status: 'To Do', priority: 'Medium', assignee: 'Jane Smith', dueDate: '2026-05-10' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Project #{id}</h1>
          <p className="text-muted-foreground">Manage your tasks for this project.</p>
        </div>
        <button 
          onClick={() => setTaskModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          + Create Task
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <select className="p-2 border border-border rounded bg-background text-foreground">
          <option>Filter by Status</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select className="p-2 border border-border rounded bg-background text-foreground">
          <option>Filter by Assignee</option>
          <option>John Doe</option>
          <option>Jane Smith</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 bg-card border border-border text-card-foreground rounded flex justify-between items-center">
            <div>
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">Assignee: {task.assignee} | Due: {task.dueDate}</p>
            </div>
            <div className="flex gap-4">
              <span className="px-2 py-1 bg-background text-sm rounded">{task.priority}</span>
              <span className="px-2 py-1 bg-background text-sm rounded">{task.status}</span>
            </div>
          </div>
        ))}
      </div>

      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded shadow-xl w-full max-w-md border border-border text-card-foreground">
            <h2 className="text-2xl font-bold mb-4">Create / Edit Task</h2>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Task Title" className="p-2 border border-border rounded bg-background text-foreground" />
              <select className="p-2 border border-border rounded bg-background text-foreground">
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <select className="p-2 border border-border rounded bg-background text-foreground">
                <option>Low Priority</option>
                <option>Medium Priority</option>
                <option>High Priority</option>
              </select>
              <input type="text" placeholder="Assignee" className="p-2 border border-border rounded bg-background text-foreground" />
              <input type="date" className="p-2 border border-border rounded bg-background text-foreground" />
              
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => setTaskModalOpen(false)} className="px-4 py-2 bg-background border border-border text-foreground rounded">Cancel</button>
                <button onClick={() => setTaskModalOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded">Save Task</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
