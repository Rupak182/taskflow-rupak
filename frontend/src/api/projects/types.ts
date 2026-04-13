export interface ProjectRead {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  tasks?: unknown[]; // Replace with actual Task type later if needed
}

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
}

export interface ProjectListResponse {
  projects: ProjectRead[];
}
