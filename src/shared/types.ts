type Project = {
  scenes: Scene[];
}

type Scene = {
  name: string;
  prompt: string;
  referenceImage: string;
  renders: Render[];
}

type Render = {
  soraVideoId: string;
}

export type { Scene };

