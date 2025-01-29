interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export function Card({ children, className = '' }: CardProps) {
    return (
      <div className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 ${className}`}>
        {children}
      </div>
    );
  }