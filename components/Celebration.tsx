import React, { useEffect, useState } from 'react';

// A simple CSS-based particle system to avoid heavy libraries
export const Celebration: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate 30 particles
    setParticles(Array.from({ length: 30 }, (_, i) => i));
    
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex items-center justify-center">
      {particles.map((i) => {
        const angle = Math.random() * 360;
        const distance = 100 + Math.random() * 200;
        const color = ['#ffaa00', '#ff4d4d', '#4dff88', '#4d94ff', '#ffeb3b'][Math.floor(Math.random() * 5)];
        const delay = Math.random() * 0.2;
        
        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full opacity-0 animate-[explode_1.5s_ease-out_forwards]"
            style={{
              backgroundColor: color,
              // We use CSS variables for dynamic movement, but since we can't easily inject dynamic keyframes without style tags,
              // we will use inline styles for the transform end state simulation if possible, or just a simple spread.
              // Actually, best to use style tag for unique trajectories or just random transforms.
              transform: `rotate(${angle}deg)`,
              // Simulate explosion using a hacky css variable approach or just inline styles for a simple spread
              // Let's use a simpler approach: fixed radial directions
              left: '50%',
              top: '50%',
              '--tw-translate-x': `${Math.cos(angle * (Math.PI / 180)) * distance}px`,
              '--tw-translate-y': `${Math.sin(angle * (Math.PI / 180)) * distance}px`,
            } as React.CSSProperties}
          >
            <style>{`
              @keyframes explode {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
                100% { opacity: 0; transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1); }
              }
            `}</style>
          </div>
        );
      })}
      <div className="absolute text-brand-600 font-bold text-2xl animate-bounce bg-white px-6 py-2 rounded-full shadow-lg border border-brand-100">
        记录成功！✨
      </div>
    </div>
  );
};