import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjectDetails } from '@/api/projects/hooks';
import { useTasks, useCreateTask, useDeleteTask } from '@/api/tasks/hooks';
import { getApiErrorMsg } from '@/lib/utils';

const STATUS_OPTIONS = ['todo', 'in_progress', 'done'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

function TasksSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-card border border-border rounded flex justify-between items-center gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-5 w-1/2 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20 rounded" />
            <Skeleton className="h-7 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ?? '';

  const { data: project, error: projectError } = useProjectDetails(projectId);
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks(projectId);
  const createTask = useCreateTask(projectId);
  const deleteTask = useDeleteTask();

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (projectError) toast.error(getApiErrorMsg(projectError, 'Failed to load project'));
    if (tasksError) toast.error(getApiErrorMsg(tasksError, 'Failed to load tasks'));
  }, [projectError, tasksError]);

  const resetModal = () => {
    setTitle(''); setStatus('todo'); setPriority('medium'); setDueDate('');
    setTaskModalOpen(false);
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    try {
      await createTask.mutateAsync({
        title,
        status,
        priority,
        due_date: dueDate || undefined,
      });
      toast.success('Task created!');
      resetModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(getApiErrorMsg(err, 'Failed to create task'));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
      toast.success('Task deleted');
      setTaskToDelete(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(getApiErrorMsg(err, 'Failed to delete task'));
    }
  };

  const tasks = tasksData?.tasks ?? [];

  return (
    <div className="p-8 max-w-6xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          {project ? (
            <h1 className="text-3xl font-bold">{project.name}</h1>
          ) : (
            <Skeleton className="h-9 w-48 rounded" />
          )}
          {project ? (
            <p className="text-muted-foreground">
              {project.description || 'Manage your tasks for this project.'}
            </p>
          ) : (
            <Skeleton className="h-4 w-64 rounded mt-1" />
          )}
        </div>
        <button
          onClick={() => setTaskModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          + Create Task
        </button>
      </div>

      {tasksLoading ? (
        <TasksSkeleton />
      ) : tasks.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">No tasks yet. Create one to get started!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 bg-card border border-border text-card-foreground rounded flex justify-between items-center">
              <div>
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {task.due_date ? `Due: ${task.due_date}` : 'No due date'}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <span className="px-2 py-1 bg-background text-sm rounded capitalize">{task.priority}</span>
                <span className="px-2 py-1 bg-background text-sm rounded capitalize">{task.status.replace('_', ' ')}</span>
                <button
                  onClick={() => setTaskToDelete(task.id)}
                  className="px-2 py-1 text-sm text-destructive border border-destructive rounded hover:bg-destructive/10 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded shadow-xl w-full max-w-md border border-border text-card-foreground">
            <h2 className="text-2xl font-bold mb-4">Create Task</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border border-border rounded bg-background text-foreground"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 border border-border rounded bg-background text-foreground"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-2 border border-border rounded bg-background text-foreground"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-2 border border-border rounded bg-background text-foreground"
              />
              <div className="flex justify-end gap-4 mt-2">
                <button
                  onClick={resetModal}
                  className="px-4 py-2 bg-background border border-border text-foreground rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={createTask.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
                >
                  {createTask.isPending ? 'Creating...' : 'Save Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {taskToDelete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded shadow-xl w-full max-w-sm border border-border text-card-foreground">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-muted-foreground mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-background border border-border text-foreground rounded hover:bg-muted"
                disabled={deleteTask.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(taskToDelete)}
                className="px-4 py-2 bg-destructive/10 text-destructive rounded disabled:opacity-50 hover:bg-destructive/5"
                disabled={deleteTask.isPending}
              >
                {deleteTask.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
