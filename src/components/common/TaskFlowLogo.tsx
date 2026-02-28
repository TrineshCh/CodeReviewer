interface TaskFlowLogoProps {
  scale?: number;
  className?: string;
}

export const TaskFlowLogo = ({ scale = 1, className }: TaskFlowLogoProps) => {
  return (
    <svg
      width={120 * scale}
      height={40 * scale}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* TaskFlow Text Logo */}
      <text
        x="0"
        y="25"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(221 83% 53%)"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Task
      </text>
      <text
        x="42"
        y="25"
        fontSize="20"
        fontWeight="300"
        fill="hsl(221 83% 53%)"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Flow
      </text>
      
      {/* Simple underline accent */}
      <rect
        x="0"
        y="30"
        width="80"
        height="2"
        fill="url(#gradient)"
        rx="1"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(210 100% 65%)" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
};
