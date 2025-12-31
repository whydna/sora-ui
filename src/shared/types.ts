type RenderStatus = 'pending' | 'processing' | 'completed' | 'failed';

type Render = {
  id: string;
  soraVideoId: string;
  status: RenderStatus;
  videoPath?: string;
};

type Scene = {
  id: string;
  name: string;
  prompt: string;
  referenceImagePath: string;
  renders: Render[];
};

type Project = {
  id: string;
  name: string;
  path: string;
  scenes: Scene[];
};

type UserSettings = {
  openaiApiKey: string;
  veoApiKey: string;
};

export type { Project, Scene, Render, RenderStatus, UserSettings };
