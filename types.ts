
export type FileStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ToolCategory = 'PDF' | 'OFFICE' | 'CONVERSION';

export interface AppFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  status: FileStatus;
  uploadDate: Date;
  processedUrl?: string;
  toolUsed?: string;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  category: ToolCategory;
  description: string;
}

export interface UserPlan {
  name: string;
  limitGB: number;
  usedGB: number;
  isActive: boolean;
}

export interface Activity {
  id: string;
  fileName: string;
  fileType: string;
  action: string;
  date: string;
  status: 'Completed' | 'Failed';
  downloadUrl?: string;
}
