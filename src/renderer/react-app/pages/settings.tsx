import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../contexts/projects-context';
import { useSettings } from '../contexts/settings-context';
import toast from 'react-hot-toast';

const Settings = () => {
  const { currentProject } = useProjects();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(settings.openaiApiKey);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ openaiApiKey: apiKey });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-400">
            Configure your application preferences
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-200 mb-2">
              OpenAI API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-400">
              Your OpenAI API key is stored locally and used to generate videos with Sora 2 API
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-medium text-gray-100 mb-2">Storage</h2>
          <p className="text-sm text-gray-400 mb-4">
            View and manage your project files
          </p>
          <button
            onClick={() => currentProject && window.ipc.openPath(currentProject.path)}
            disabled={!currentProject}
            className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
          >
            Open Project Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export { Settings };
