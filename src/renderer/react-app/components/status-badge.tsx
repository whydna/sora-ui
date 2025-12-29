import { RenderStatus } from '../../../shared/types';

type StatusBadgeProps = {
  status: RenderStatus;
  message?: string;
};

const StatusBadge = ({ status, message }: StatusBadgeProps) => {
  const styles: Record<RenderStatus, string> = {
    pending: 'bg-gray-600 text-gray-200',
    processing: 'bg-amber-500 text-amber-950 animate-pulse',
    completed: 'bg-emerald-500 text-emerald-950',
    failed: 'bg-red-500 text-red-950',
  };

  return (
    <div className="flex flex-col gap-1">
      <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${styles[status]}`}>
        {status}
      </span>
      {message && (
        <span className="text-xs text-gray-400 max-w-[200px] truncate" title={message}>
          {message}
        </span>
      )}
    </div>
  );
};

export { StatusBadge, type StatusBadgeProps };

