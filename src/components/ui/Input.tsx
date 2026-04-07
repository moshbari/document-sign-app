import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      error,
      icon,
      helperText,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 py-2.5 rounded-lg
              border-2 border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-white
              placeholder-slate-400 dark:placeholder-slate-500
              transition-all duration-200
              focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20
              disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-600/20" : ""}
              ${className}
            `.trim()}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
