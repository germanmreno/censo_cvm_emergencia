import { useId } from 'react';
import { cn } from '../../lib/utils';

export function Checkbox({ label, checked, onChange, error, className, id }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex items-start gap-2 cursor-pointer text-sm select-none',
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cvm-primary focus:ring-cvm-primary"
      />
      <span className="text-slate-700">{label}</span>
      {error && <span className="block text-xs text-cvm-emergency">{error}</span>}
    </label>
  );
}
