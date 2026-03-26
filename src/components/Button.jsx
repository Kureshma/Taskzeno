function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm",
    secondary: "bg-card-blue text-slate-700 hover:bg-blue-200 shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 shadow-sm border border-red-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
