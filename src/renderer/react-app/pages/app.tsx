import { useState } from 'react';

type VideoStatus = 'idle' | 'generating' | 'polling' | 'completed' | 'failed';

type Scene = {
  name: string;
  image: string;
  prompt: string;
  status: VideoStatus;
  message?: string;
  videoUrl?: string;
};


const initialScenes: Scene[] = [
  {
    name: 'open',
    image: 'open.png',
    prompt: `Scene 1 — Opening Establishing Shot
- Wide cinematic establishing shot, slow dolly-in.
- A luxurious, dimly lit casino poker room at night.
- Warm amber chandelier light reflects off dark wood walls and green felt tables.
- The camera slowly pushes toward a single poker table as cigar smoke drifts through the air.
- Two players face each other:
  - On the left: a calm man in a tailored light-gray suit, smoking a cigar, eyes sharp and calculating.
  - On the right: a younger man in a black t-shirt and glasses, leaning forward, focused and unreadable.
- Poker chips are neatly stacked between them.
- The background crowd is softly blurred with shallow depth of field, isolating the table.
- The mood is restrained and tense, establishing a psychological standoff.`,
    status: 'idle',
  },
  {
    name: 'all_in',
    image: 'all_in.png',
    prompt: `Scene 2 — The All-In Moment
- Medium close-up → cut to extreme close-up, fast push-in.
- At the same table, tension snaps.
- The player in the gray suit gathers his remaining chips and shoves them forward in one forceful motion.
- Extreme close-up on his hand as red, blue, and black chips collide and slide across the felt, clattering loudly.
- Cut to reaction shot: the black t-shirt player, frozen, eyes wide, as his expression tightens.
- Shallow depth of field: chips and faces are sharp, casino background is motion-blurred.
- Lighting on the table intensifies.
- Mood shifts instantly from control to irreversible risk.`,
    status: 'idle',
  },
];

async function waitForVideo(
  videoId: string, 
  onStatus: (msg: string) => void
): Promise<{ url?: string; error?: string }> {
  while (true) {
    const result = await window.electronAPI.pollVideo(videoId);
    onStatus(`Status: ${result.status}`);
    
    if (result.status === 'completed') {
      return { url: result.url };
    } else if (result.status === 'failed') {
      return { error: result.error };
    }
    
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

const StatusBadge = ({ status, message }: { status: Scene['status']; message?: string }) => {
  const styles: Record<VideoStatus, string> = {
    idle: 'bg-zinc-600 text-zinc-200',
    generating: 'bg-amber-500 text-amber-950 animate-pulse',
    polling: 'bg-blue-500 text-blue-950 animate-pulse',
    completed: 'bg-emerald-500 text-emerald-950',
    failed: 'bg-red-500 text-red-950',
  };

  return (
    <div className="flex flex-col gap-1">
      <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${styles[status]}`}>
        {status}
      </span>
      {message && (
        <span className="text-xs text-zinc-400 max-w-[200px] truncate" title={message}>
          {message}
        </span>
      )}
    </div>
  );
};

const App = () => {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateScene = (name: string, updates: Partial<Scene>) => {
    setScenes(prev => prev.map(s => s.name === name ? { ...s, ...updates } : s));
  };

  const handleGenerate = async (sceneIndex: number) => {
    const scene = scenes[sceneIndex];
    setIsGenerating(true);
    updateScene(scene.name, { status: 'generating', message: 'Starting...' });

    try {
      // Fetch the image and convert to base64 for IPC
      const imageResponse = await fetch(`/${scene.image}`);
      const imageBlob = await imageResponse.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      updateScene(scene.name, { message: 'Creating video job...' });
      const videoId = await window.electronAPI.createVideo(imageBase64, scene.image, scene.prompt);
      
      updateScene(scene.name, { status: 'polling', message: `Job ID: ${videoId}` });
      
      const result = await waitForVideo(videoId, (msg) => {
        updateScene(scene.name, { message: msg });
      });

      if (result.url) {
        updateScene(scene.name, { status: 'completed', message: 'Done!', videoUrl: result.url });
      } else {
        updateScene(scene.name, { status: 'failed', message: result.error || 'Unknown error' });
      }
    } catch (error) {
      updateScene(scene.name, { 
        status: 'failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }

    setIsGenerating(false);
  };

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    for (let i = 0; i < scenes.length; i++) {
      await handleGenerate(i);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Sora Video Generator
          </h1>
          <p className="text-zinc-400">
            Generate video scenes using Sora 2 API
          </p>
        </header>

        <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Prompt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scenes.map((scene, index) => (
                <tr key={scene.name} className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors align-top">
                  <td className="px-4 py-4 text-zinc-500 font-mono text-sm">
                    {index + 1} {scene.name}
                  </td>
                  <td className="px-4 py-4">
                    <img
                      src={`/${scene.image}`}
                      alt={scene.name}
                      className="w-32 h-20 object-cover rounded border border-zinc-600"
                    />
                  </td>
                  <td className="px-4 py-4 max-w-md">
                    <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {scene.prompt}
                    </pre>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={scene.status} message={scene.message} />
                    {scene.videoUrl && (
                      <a 
                        href={scene.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        View Video ↗
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleGenerate(index)}
                      disabled={isGenerating}
                      className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded transition-colors"
                    >
                      Generate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate All Scenes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { App };
