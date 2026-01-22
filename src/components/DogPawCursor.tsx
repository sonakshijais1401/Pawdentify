import { useState, useEffect } from 'react';

// Dog Paw SVG Component
const DogPaw = ({ scale = 1, rotate = 0, pressed = false }: { scale?: number; rotate?: number; pressed?: boolean }) => (
  <svg 
    width={45 * scale} 
    height={58 * scale} 
    viewBox="0 0 70 90" 
    style={{ 
      transform: `rotate(${rotate}deg) scale(${pressed ? 0.9 : 1})`,
      transition: 'transform 0.15s ease',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }}
  >
    {/* Paw outline/fur edge */}
    <path
      d="M 15 15 Q 12 20, 12 30 Q 12 45, 15 55 Q 17 62, 20 68 L 25 65 Q 28 72, 30 75 L 32 68 Q 35 78, 40 80 Q 45 78, 48 68 L 50 75 Q 52 72, 55 65 L 60 68 Q 63 62, 65 55 Q 68 45, 68 30 Q 68 20, 65 15 Q 63 8, 55 5 L 50 7 Q 45 3, 40 3 Q 35 3, 30 7 L 25 5 Q 17 8, 15 15 Z"
      fill="#D2B48C"
      stroke="#A0522D"
      strokeWidth="2"
    />
    
    {/* Fur patches - light brown */}
    <ellipse 
      cx="22" 
      cy="35" 
      rx="9" 
      ry="15" 
      fill="#CD853F"
      opacity={0.6}
    />
    
    {/* Fur patches - dark brown */}
    <ellipse 
      cx="58" 
      cy="40" 
      rx="10" 
      ry="18" 
      fill="#8B4513"
      opacity={0.7}
    />
    
    {/* Toe bean 1 (left) */}
    <ellipse 
      cx="25" 
      cy="18" 
      rx="6.5" 
      ry="9" 
      fill="#DEB887"
      stroke="#BC9A6A"
      strokeWidth="1.5"
    />
    
    {/* Toe bean 2 (center-left) */}
    <ellipse 
      cx="33" 
      cy="13" 
      rx="6.5" 
      ry="9.5" 
      fill="#DEB887"
      stroke="#BC9A6A"
      strokeWidth="1.5"
    />
    
    {/* Toe bean 3 (center-right) */}
    <ellipse 
      cx="47" 
      cy="13" 
      rx="6.5" 
      ry="9.5" 
      fill="#DEB887"
      stroke="#BC9A6A"
      strokeWidth="1.5"
    />
    
    {/* Toe bean 4 (right) */}
    <ellipse 
      cx="55" 
      cy="18" 
      rx="6.5" 
      ry="9" 
      fill="#DEB887"
      stroke="#BC9A6A"
      strokeWidth="1.5"
    />
    
    {/* Main paw pad - brown (at bottom) */}
    <ellipse 
      cx="40" 
      cy="45" 
      rx="13" 
      ry="16" 
      fill="#DEB887"
      stroke="#BC9A6A"
      strokeWidth="2"
    />
    
    {/* Toe bean highlights */}
    <ellipse cx="25" cy="17" rx="3" ry="4" fill="#F5DEB3" opacity={0.7}/>
    <ellipse cx="33" cy="12" rx="3" ry="4.5" fill="#F5DEB3" opacity={0.7}/>
    <ellipse cx="47" cy="12" rx="3" ry="4.5" fill="#F5DEB3" opacity={0.7}/>
    <ellipse cx="55" cy="17" rx="3" ry="4" fill="#F5DEB3" opacity={0.7}/>
    
    {/* Main pad highlight */}
    <ellipse cx="40" cy="42" rx="8" ry="10" fill="#F5DEB3" opacity={0.6}/>
    
    {/* Paw pad details/texture */}
    <ellipse cx="40" cy="48" rx="6" ry="8" fill="#BC9A6A" opacity={0.3}/>
  </svg>
);

// Main Custom Cursor Hook
export const useCustomPawCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  return {
    cursorPos,
    isHovering,
    setIsHovering,
    isClicking,
    isMobile
  };
};

// Custom Paw Cursor Component
export const CustomPawCursor = ({ cursorPos, isHovering, isClicking, isMobile }: {
  cursorPos: { x: number; y: number };
  isHovering: boolean;
  isClicking: boolean;
  isMobile: boolean;
}) => {
  if (isMobile) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${cursorPos.x}px`,
        top: `${cursorPos.y}px`,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.1 : 0.8})`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <DogPaw 
        scale={isHovering ? 1.1 : 0.9} 
        rotate={isHovering ? -10 : 0}
        pressed={isClicking}
      />
    </div>
  );
};

export default DogPaw;
