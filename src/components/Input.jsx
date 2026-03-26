import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        ref={ref}
        className={`px-3 py-2 border rounded-md outline-none bg-white 
          focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
