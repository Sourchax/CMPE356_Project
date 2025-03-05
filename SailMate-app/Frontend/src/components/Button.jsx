import React from "react";

/**
 * Button component for consistent styling across the application
 * 
 * @param {Object} props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {boolean} [props.loading=false] - Loading state of the button
 * @param {React.ReactNode} props.children - Button content
 * @param {function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.className] - Additional classes
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  loading = false,
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  className = '',
  ...rest 
}) => {
  const baseClasses = 'rounded-lg transition-all duration-300 font-medium';
  
  const variantClasses = {
    primary: 'bg-[#0D3A73] hover:bg-[#06AED5] focus:bg-[#06AED5] active:bg-[#0597b9] text-white',
    secondary: 'bg-[#06AED5] hover:bg-[#0D3A73] focus:bg-[#0D3A73] active:bg-[#082a5c] text-white',
    outline: 'border-2 border-[#0D3A73] text-[#0D3A73] hover:bg-[#e6f5f8] focus:bg-[#e6f5f8] active:bg-[#d0edf3] bg-transparent',
    danger: 'bg-[#06AED5] hover:bg-[#0597b9] focus:bg-[#0597b9] active:bg-[#04829f] text-white',
    success: 'bg-green-600 hover:bg-[#06AED5] focus:bg-[#06AED5] active:bg-[#0597b9] text-white',
  };
  
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5',
    lg: 'py-3 px-6 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
  const shadowClass = variant !== 'outline' ? 'shadow-md hover:shadow-lg' : '';
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${widthClass}
    ${disabledClass}
    ${shadowClass}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 