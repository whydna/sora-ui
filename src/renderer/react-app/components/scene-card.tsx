import { Scene } from '../../../shared/types';
import { ImageSelect } from './image-select';
import { StatusBadge } from './status-badge';

type SceneCardProps = {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
  onGenerate: () => void;
};

const SceneCard = ({ scene, onUpdate, onGenerate }: SceneCardProps) => {
  console.log(scene.renders);
  return (
    <div className="bg-gray-600 rounded-lg border border-gray-700 p-4">
      {/* Top row: Name, Reference, Actions */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Scene
          </label>
          <input
            type="text"
            value={scene.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="bg-gray-900/50 text-sm text-gray-300 font-medium border border-gray-700 hover:border-gray-600 focus:border-gray-500 focus:outline-none rounded px-3 py-2"
          />
        </div>
        <ImageSelect
          value={scene.referenceImagePath ? `file://${scene.referenceImagePath}` : null}
          onChange={(path) => onUpdate({ referenceImagePath: path })}
        />
        <button
          onClick={onGenerate}
          className="ml-auto px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
        >
          Generate
        </button>
      </div>

      {/* Prompt row */}
      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Prompt
        </label>
        <textarea
          value={scene.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          placeholder="Enter prompt..."
          rows={6}
          className="w-full bg-gray-900/50 text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed border border-gray-700 hover:border-gray-600 focus:border-gray-500 focus:outline-none rounded px-3 py-2 resize-none"
        />
      </div>

      {/* Renders list */}
      
      {scene.renders.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Renders
          </label>
          <div className="flex flex-col gap-3">
            {scene.renders.map((render) => (
              <div
                key={render.id}
                className="bg-gray-900/50 rounded px-3 py-3 border border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <StatusBadge status={render.status} />
                </div>
                {render.status === 'completed' && render.videoPath && (
                  <video
                    src={`file://${render.videoPath}`}
                    controls
                    className="w-full max-w-lg rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { SceneCard };

