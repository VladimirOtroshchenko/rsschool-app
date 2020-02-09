import axios from 'axios';


export type TaskType = | 'jstask'
| 'htmltask'
| 'htmlcssacademy'
| 'cv:markdown'
| 'cv:html'
| 'codewars:stage1'
| 'codewars:stage2'
| 'test'
| 'interview'
| 'codejam';

export interface Task {
  id: number;
  createdDate: string;
  updatedDate: string;
  name: string;
  descriptionUrl: string | null;
  description: string | null;
  githubPrRequired: boolean | null;
  verification: 'manual' | 'auto';
  type: TaskType;
  githubRepoName: string;
  sourceGithubRepoUrl: string;
  tags: string[];
}

export class TaskService {
  async getTasks() {
    const result = await axios.get<{ data: Task[] }>(`/api/tasks`);
    return result.data.data.sort((a, b) => b.id - a.id);
  }

  async updateTask(id: number, data: Partial<Task>) {
    const result = await axios.put<{ data: Task }>(`/api/task/${id}`, data);
    return result.data.data;
  }

  async createTask(data: Partial<Task>) {
    const result = await axios.post<{ data: Task }>(`/api/task/`, data);
    return result.data.data;
  }
}
