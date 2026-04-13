import { Link } from 'react-router-dom';
import { useProjects, useCreateProject } from '@/api/projects/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { getApiErrorMsg } from '@/lib/utils';

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 bg-card border border-border rounded shadow-sm flex flex-col gap-3">
          <Skeleton className="h-7 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  const { data: projects, isLoading, error } = useProjects();
  const createProject = useCreateProject();

  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(getApiErrorMsg(error, 'Failed to load projects'));
    }
  }, [error]);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }
    try {
      await createProject.mutateAsync({ name, description });
      toast.success('Project created!');
      setModalOpen(false);
      setName('');
      setDescription('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(getApiErrorMsg(err, 'Failed to create project'));
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Projects</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded whitespace-nowrap"
        >
          + New Project
        </button>
      </div>
      
      {isLoading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.projects.map((project) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}`}
              className="block p-6 bg-card border border-border text-card-foreground rounded hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-xl font-bold mb-2">{project.name}</h2>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded shadow-xl w-full max-w-md border border-border text-card-foreground">
            <h2 className="text-2xl font-bold mb-4">New Project</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-border rounded bg-background text-foreground"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="p-2 border border-border rounded bg-background text-foreground resize-none"
              />
              <div className="flex justify-end gap-4 mt-2">
                <button
                  onClick={() => { setModalOpen(false); setName(''); setDescription(''); }}
                  className="px-4 py-2 bg-background border border-border text-foreground rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createProject.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
                >
                  {createProject.isPending ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
