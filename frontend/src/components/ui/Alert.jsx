import { cn } from '../../lib/utils';

const variants = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
};

export function Alert({ variant = 'info', children, className, icon: Icon }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 border rounded-md px-4 py-3 text-sm',
        variants[variant],
        className,
      )}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />}
      <div className="flex-1">{children}</div>
    </div>
  );
}
