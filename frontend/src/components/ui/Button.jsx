import { cn } from '../../lib/utils';

export function Button({ children, variant = 'primary', size = 'md', className, ...rest }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-cvm-primary text-white hover:bg-cvm-primary-dark focus:ring-cvm-primary',
    secondary: 'bg-cvm-secondary text-white hover:bg-cvm-secondary-light focus:ring-cvm-secondary',
    danger: 'bg-cvm-emergency text-white hover:bg-cvm-emergency-dark focus:ring-cvm-emergency',
    outline:
      'bg-white text-cvm-secondary border border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
    ghost: 'bg-transparent text-cvm-secondary hover:bg-slate-100 focus:ring-slate-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
