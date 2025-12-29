import { StatusBadge } from '../components/status-badge';
import { useProjects } from '../contexts/projects-context';

const App = () => {
  const { currentProject, loading, createProject, addScene } = useProjects();

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
                <tr key={scene.id} className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors align-top">
                  <td className="px-4 py-4 text-zinc-500 font-mono text-sm">
                    {index + 1} {scene.name}
                  </td>
                  <td className="px-4 py-4">
                    {scene.referenceImagePath ? (
                      <img
                        src={`/${scene.referenceImagePath}`}
                        alt={scene.name}
                        className="w-32 h-20 object-cover rounded border border-zinc-600"
                      />
                    ) : (
                      <div className="w-32 h-20 rounded border border-zinc-600 border-dashed flex items-center justify-center text-zinc-500 text-xs">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 max-w-md">
                    <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {scene.prompt}
                    </pre>
                  </td>
                  <td className="px-4 py-4">
                    {scene.renders[0] ? (
                      <StatusBadge status={scene.renders[0].status} />
                    ) : (
                      <span className="text-zinc-500 text-xs">-</span>
                    )}
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
