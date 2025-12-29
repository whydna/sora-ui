import { createRoot } from 'react-dom/client';
import { App } from './pages/app';
import { ProjectsProvider } from './contexts/projects-context';

const Index = () => {
  return (
    <ProjectsProvider>
      <App />
    </ProjectsProvider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Index />);