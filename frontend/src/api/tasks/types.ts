export interface TaskRead {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assignee_id?: string | null;
  due_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TaskCreate {
  title: string;
  status?: string;
  priority?: string;
  assignee_id?: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  status?: string;
  priority?: string;
  assignee_id?: string;
  due_date?: string;
}

export interface TaskListResponse {
  tasks: TaskRead[];
}
