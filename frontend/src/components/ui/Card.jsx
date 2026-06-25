import { cn } from '../../lib/utils';

export function Card({ children, className, padded = true }) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-lg shadow-sm',
        padded && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        {title && <h2 className="text-xl font-semibold text-cvm-secondary">{title}</h2>}
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
