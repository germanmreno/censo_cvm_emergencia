import { cn } from '../../lib/utils';

export function Label({ htmlFor, children, className, required }) {
  return (
    <label htmlFor={htmlFor} className={cn('field-label', className)}>
      {children}
      {required && <span className="text-cvm-emergency ml-0.5">*</span>}
    </label>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="field-error">{children}</p>;
}

export function FieldHint({ children }) {
  if (!children) return null;
  return <p className="field-hint">{children}</p>;
}
