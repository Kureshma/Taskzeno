function Card({ children, className = '', color = 'default' }) {
  const colors = {
    default: 'bg-white border-slate-100',
    peach: 'bg-card-peach border-orange-100',
    blue: 'bg-card-blue border-blue-100',
    mint: 'bg-card-mint border-green-100',
  };

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden ${colors[color]} ${className}`}>
      {children}
    </div>
  );
}

export default Card;
