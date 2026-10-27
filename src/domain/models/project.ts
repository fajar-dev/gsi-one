export type ProjectStatus = 'pending' | 'on_progress' | 'done' | 'on_hold';

export type ProjectStageStatus = 'pending' | 'in_progress' | 'done';

export type ProjectFileType =
  | 'image'
  | 'report'
  | 'invoice'
  | 'drawing'
  | 'contract'
  | 'video'
  | 'other';

export type ProjectUserRole = 'client' | 'marketing' | 'engineer';

export interface Project {
  id: string;
  project_code?: string;
  project_name: string;
  client_name: string;
  budget?: number;
  start_date: string;
  estimated_finish: string;
  status: ProjectStatus;
  created_by: string;
  client_id?: string;
  marketing_id?: string;
  engineer_id?: string;
  created_at: string;
}

export interface StageUpdate {
  id: string;
  stage_id: string | null;
  description: string;
  progress: number;
  created_by: string;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  stage_id: string | null;
  file_name: string;
  file_url: string;
  file_type: ProjectFileType;
  uploaded_by: string;
  created_at: string;
}

export interface ProjectStage {
  id: string;
  project_id: string;
  title: string;
  description: string;
  sequence: number;
  status: ProjectStageStatus;
  updated_by: string;
  updated_at: string;
  updates?: StageUpdate[];
  files?: ProjectFile[];
}

export interface ProjectDetail extends Project {
  stages: ProjectStage[];
  files?: ProjectFile[];
  updates?: StageUpdate[];
}
