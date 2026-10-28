import React, { useEffect, useRef } from 'react';

interface CelebrationParticlesProps {
  type: 'petals' | 'sparkles' | 'confetti' | 'none';
  intensity?: 'gentle' | 'vibrant';
  isEmbedded?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  petalCurve?: number;
}

export const CelebrationParticles: React.FC<CelebrationParticlesProps> = ({
  type,
  intensity = 'gentle',
  isEmbedded = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === 'none') return;

    // Respect user prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = isEmbedded && canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth);
    let height = (canvas.height = isEmbedded && canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = isEmbedded && canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.height = isEmbedded && canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = intensity === 'vibrant' ? 45 : 24;
    const particles: Particle[] = [];

    const petalColors = ['#fbcfe8', '#f472b6', '#fda4af', '#fff1f2', '#fecdd3'];
    const sparkleColors = ['#fef08a', '#fde047', '#eab308', '#ffffff', '#fed7aa'];
    const confettiColors = ['#38bdf8', '#f43f5e', '#a855f7', '#fbbf24', '#34d399', '#ec4899'];

    const colors = type === 'petals' ? petalColors : type === 'sparkles' ? sparkleColors : confettiColors;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'sparkles' ? Math.random() * 3 + 1.5 : Math.random() * 8 + 6,
        speedY: type === 'petals' ? Math.random() * 0.9 + 0.5 : type === 'sparkles' ? Math.random() * 0.6 + 0.2 : Math.random() * 1.5 + 1.0,
        speedX: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.4 + 0.4,
        petalCurve: Math.random() * 0.4 + 0.8,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.8 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (type === 'petals') {
          // Romantic rose petal curve
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.7, p.size * (p.petalCurve || 1), Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'sparkles') {
          // 4-point star sparkle
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 2);
          ctx.lineTo(p.size * 0.4, -p.size * 0.4);
          ctx.lineTo(p.size * 2, 0);
          ctx.lineTo(p.size * 0.4, p.size * 0.4);
          ctx.lineTo(0, p.size * 2);
          ctx.lineTo(-p.size * 0.4, p.size * 0.4);
          ctx.lineTo(-p.size * 2, 0);
          ctx.lineTo(-p.size * 0.4, -p.size * 0.4);
          ctx.closePath();
          ctx.fill();
        } else {
          // Confetti rectangle
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, intensity]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${isEmbedded ? 'absolute inset-0 z-10' : 'fixed inset-0 z-30'} h-full w-full`}
      aria-hidden="true"
    />
  );
};
