import { createRoot } from 'react-dom/client';
import { App } from './pages/app';
const Index = () => {
  return (
    <App />
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Index />);