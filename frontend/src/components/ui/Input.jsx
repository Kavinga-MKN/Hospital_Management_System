import React from 'react';

const Input = React.forwardRef(({ className = '', icon, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <div className="relative relative flex items-center">
                {icon && (
                    <div className="absolute left-3 text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            flex h-11 w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm 
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50 transition-colors
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger focus:ring-danger' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-danger">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
