import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjectDetails } from '@/api/projects/hooks';
import { useTasks, useCreateTask, useDeleteTask, useUpdateTask } from '@/api/tasks/hooks';
import { useUsers } from '@/api/users/hooks';
import type { TaskRead } from '@/api/tasks/types';
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
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');

  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks(projectId, {
    ...(filterStatus ? { status: filterStatus } : {}),
    ...(filterAssignee ? { assignee_id: filterAssignee } : {}),
  });
  const { data: usersData } = useUsers();
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask();

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    assignee_id: '',
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const openModal = (task?: TaskRead) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
        assignee_id: task.assignee_id || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        assignee_id: '',
      });
    }
    setTaskModalOpen(true);
  };

  useEffect(() => {
    if (projectError) toast.error(getApiErrorMsg(projectError, 'Failed to load project'));
    if (tasksError) toast.error(getApiErrorMsg(tasksError, 'Failed to load tasks'));
  }, [projectError, tasksError]);

 
  const handleSaveTask = async () => {
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    try {
      const payload = {
        title: formData.title,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
        assignee_id: formData.assignee_id || null,
      };

      if (editingTask) {
        await updateTask.mutateAsync({ id: editingTask.id, data: payload });
        toast.success('Task updated!');
      } else {
        await createTask.mutateAsync(payload);
        toast.success('Task created!');
      }
      setTaskModalOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(getApiErrorMsg(err, editingTask ? 'Failed to update task' : 'Failed to create task'));
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

  const users = usersData || [];
  const tasks = tasksData?.tasks ?? [];

  const getAssigneeName = (id?: string | null) => {
    if (!id) return 'Unassigned';
    return users.find((u) => u.id === id)?.name || 'Unknown User';
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          {project ? (
            <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
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
          onClick={() => openModal()}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded whitespace-nowrap"
        >
          + Create Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto p-2 border border-border rounded bg-background text-foreground"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="w-full sm:w-auto p-2 border border-border rounded bg-background text-foreground"
        >
          <option value="">All Assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
      </div>

      {tasksLoading ? (
        <TasksSkeleton />
      ) : tasks.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">No tasks yet. Create one to get started!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 bg-card border border-border text-card-foreground rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="min-w-0">
                <h3 className="font-bold truncate">{task.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {getAssigneeName(task.assignee_id)} • {task.due_date ? `Due: ${task.due_date}` : 'No due date'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-2 py-1 bg-background text-xs sm:text-sm rounded capitalize">{task.priority}</span>
                <span className="px-2 py-1 bg-background text-xs sm:text-sm rounded capitalize">{task.status.replace('_', ' ')}</span>
                <button
                  onClick={() => openModal(task)}
                  className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded transition hover:bg-secondary/80"
                >
                  Edit
                </button>
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
            <h2 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className="p-2 border border-border rounded bg-background text-foreground"
              />
              <select
                value={formData.status}
                onChange={(e) => updateFormData({ status: e.target.value })}
                className="p-2 border border-border rounded bg-background text-foreground"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
              <select
                value={formData.priority}
                onChange={(e) => updateFormData({ priority: e.target.value })}
                className="p-2 border border-border rounded bg-background text-foreground"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>
              <select
                value={formData.assignee_id}
                onChange={(e) => updateFormData({ assignee_id: e.target.value })}
                className="p-2 border border-border rounded bg-background text-foreground"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => updateFormData({ due_date: e.target.value })}
                className="p-2 border border-border rounded bg-background text-foreground"
              />
              <div className="flex justify-end gap-4 mt-2">
                <button
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 bg-background border border-border text-foreground rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  disabled={createTask.isPending || updateTask.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
                >
                  {createTask.isPending || updateTask.isPending ? 'Saving...' : 'Save Task'}
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
