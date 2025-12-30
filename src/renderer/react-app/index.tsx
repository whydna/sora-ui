import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { App } from './pages/app';
import { Settings } from './pages/settings';
import { ProjectsProvider } from './contexts/projects-context';
import { SettingsProvider } from './contexts/settings-context';

const Index = () => {
  return (
    <SettingsProvider>
      <ProjectsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </ProjectsProvider>
    </SettingsProvider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Index />);