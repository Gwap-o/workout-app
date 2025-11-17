interface DunamisLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function DunamisLogo({ className = '', size = 'md', showText = false }: DunamisLogoProps) {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Rounded container box with fixed sizing */}
      <div className={`${iconSizeClasses[size]} p-1.5 rounded-lg bg-transparent border border-[#E8EAED] dark:border-[#30363D] flex items-center justify-center flex-shrink-0`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dumbbell Weight Icon in Brand Colors */}

          {/* Left weight plate */}
          <rect x="10" y="35" width="15" height="30" className="fill-[#20808D] dark:fill-[#1FB8CD]" rx="2" />

          {/* Left handle connection */}
          <rect x="25" y="45" width="10" height="10" className="fill-[#20808D] dark:fill-[#1FB8CD]" rx="1" />

          {/* Center bar/handle */}
          <rect x="35" y="47" width="30" height="6" className="fill-[#20808D] dark:fill-[#1FB8CD]" rx="1" />

          {/* Right handle connection */}
          <rect x="65" y="45" width="10" height="10" className="fill-[#20808D] dark:fill-[#1FB8CD]" rx="1" />

          {/* Right weight plate */}
          <rect x="75" y="35" width="15" height="30" className="fill-[#20808D] dark:fill-[#1FB8CD]" rx="2" />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold text-[#202124] dark:text-[#E6EDF3] ${textSizeClasses[size]}`}>
          Dunamis
        </span>
      )}
    </div>
  );
}
