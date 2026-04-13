import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

// Mock fetching function
const fetchProjects = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    { id: '1', name: 'Project Alpha', description: 'Main product development' },
    { id: '2', name: 'Project Beta', description: 'Internal dashboard' },
  ];
};

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
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">+ New Project</button>
      </div>
      
      {isLoading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map((project: { id: string; name: string; description: string }) => (
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
    </div>
  );
}
