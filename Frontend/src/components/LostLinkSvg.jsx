const LostLinkSVG = ({ className = "" }) => {
    const rotations = [0, 120, 240];
    
    return (
      <svg
        viewBox="0 0 400 200"
        className={`w-full h-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Abstract shape */}
        <path
          d="M80 20 L100 95 L160 100 L100 105 L80 180 L60 105 L0 100 L60 95 Z"
          fill="#4F46E5"
          opacity="0.1"
        />
        
        {/* Connection lines */}
        <path
          d="M40 60 C60 80, 100 80, 120 60"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M40 140 C60 120, 100 120, 120 140"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="8"
          strokeLinecap="round"
        />
  
        {/* Central symbol */}
        <circle cx="80" cy="100" r="25" fill="none" stroke="#4F46E5" strokeWidth="6" />
        <path
          d="M65 100 L95 100 M80 85 L80 115"
          stroke="#DC2626"
          strokeWidth="6"
          strokeLinecap="round"
        />
  
        {/* Lost text */}
        <text
          x="150"
          y="110"
          fontFamily="cursive"
          fontSize="52"
          fontStyle="italic"
          fontWeight="bold"
          fill="#4F46E5"
        >
          Lost
        </text>
  
        {/* Link text */}
        <text
          x="270"
          y="110"
          fontFamily="cursive"
          fontSize="52"
          fontStyle="italic"
          fontWeight="bold"
          fill="#DC2626"
        >
          Link
        </text>
  
        {/* Decorative underline */}
        <path
          d="M150 120 Q250 120 350 120"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="2"
          opacity="0.5"
        />
  
        {/* Pulsing dots */}
        {rotations.map((rotation) => (
          <g key={rotation} transform={`rotate(${rotation} 80 100)`}>
            <circle cx="80" cy="45" r="4" fill="#4F46E5">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
                begin={`${rotation / 360}s`}
              />
            </circle>
          </g>
        ))}
      </svg>
    );
  };
  
  export default LostLinkSVG;
  