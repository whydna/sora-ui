import { useNavigate } from 'react-router-dom';
import { FinalPreview } from '../components/final-preview';
import { SceneCard } from '../components/scene-card';
import { useProjects } from '../contexts/projects-context';

const App = () => {
  const { currentProject, loading, createProject, addScene, updateScene, renderScene } = useProjects();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">No projects found</p>
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-400 mb-2">
              Sora Video Generator
            </h1>
            <p className="text-gray-400">
              Generate video scenes using Sora 2 API
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
          >
            Settings
          </button>
        </header>

        <div className="flex flex-col gap-4">
          {scenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onUpdate={(updates) => updateScene(scene.id, updates)}
              onGenerate={() => renderScene(scene.id)}
            />
          ))}
        </div>

        <button
          onClick={addScene}
          className="mt-4 px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          + Add Scene
        </button>

        <FinalPreview scenes={scenes} />
      </div>
    </div>
  );
};

export { App };
