import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Project } from 'src/shared/types';

type ProjectsContextValue = {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.ipc.getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const currentProject = projects[0] ?? null;

  return (
    <ProjectsContext.Provider value={{ projects, currentProject, loading }}>
      {children}
    </ProjectsContext.Provider>
  );
};

const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export { ProjectsProvider, useProjects };

