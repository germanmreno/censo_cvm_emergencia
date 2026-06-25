import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(function Input(
  { className, error, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2',
        error
          ? 'border-cvm-emergency focus:ring-cvm-emergency'
          : 'border-slate-300 focus:border-cvm-secondary focus:ring-cvm-secondary',
        className,
      )}
      {...rest}
    />
  );
});
