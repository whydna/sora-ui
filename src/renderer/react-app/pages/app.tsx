import { ImageSelect } from '../components/image-select';
import { useProjects } from '../contexts/projects-context';

const App = () => {
  const { currentProject, loading, createProject, addScene, updateScene } = useProjects();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">No projects found</p>
        <button
          onClick={() => createProject('Untitled Project')}
          className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
        >
          Create project
        </button>
      </div>
    );
  }

  const scenes = currentProject.scenes;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-400 mb-2">
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
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Prompt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scenes.map((scene, index) => (
                <tr key={scene.id} className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors align-top">
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={scene.name}
                      onChange={(e) => updateScene(scene.id, { name: e.target.value })}
                      className="bg-transparent text-zinc-300 text-sm border-b border-transparent hover:border-zinc-600 focus:border-zinc-500 focus:outline-none px-1 py-0.5"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <ImageSelect
                      value={`local-file://${scene.referenceImagePath}`}
                      onChange={(path) => updateScene(scene.id, { referenceImagePath: path })}
                    />
                  </td>
                  <td className="px-4 py-4 max-w-md">
                    <textarea
                      value={scene.prompt}
                      onChange={(e) => updateScene(scene.id, { prompt: e.target.value })}
                      placeholder="Enter prompt..."
                      rows={3}
                      className="w-full bg-zinc-900/50 text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed border border-zinc-700 hover:border-zinc-600 focus:border-zinc-500 focus:outline-none rounded px-2 py-1.5 resize-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => {}}
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

        <button
          onClick={addScene}
          className="mt-4 px-4 py-2 text-sm font-medium bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
        >
          + Add Scene
        </button>
      </div>
    </div>
  );
};

export { App };
