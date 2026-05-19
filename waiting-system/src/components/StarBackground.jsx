import { useEffect, useRef } from 'react';

export function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.8 + 0.3,
      color: Math.random() > 0.85
        ? `${Math.floor(180 + Math.random() * 75)},${Math.floor(160 + Math.random() * 75)},255`
        : '255,255,255',
    }));

    const constellationPairs = [
      [0, 5], [5, 12], [12, 20], [20, 0],
      [30, 38], [38, 45], [45, 52], [52, 30],
      [60, 67], [67, 74],
    ];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.75);
      bg.addColorStop(0, '#0d0b2e');
      bg.addColorStop(0.5, '#07061a');
      bg.addColorStop(1, '#030210');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Nebula glow
      const neb = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.4);
      neb.addColorStop(0, 'rgba(80,50,160,0.07)');
      neb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);

      const neb2 = ctx.createRadialGradient(w * 0.75, h * 0.65, 0, w * 0.75, h * 0.65, w * 0.35);
      neb2.addColorStop(0, 'rgba(0,100,180,0.06)');
      neb2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, w, h);

      const t = Date.now() * 0.001;

      // Constellation lines
      ctx.lineWidth = 0.5;
      constellationPairs.forEach(([a, b]) => {
        if (a >= stars.length || b >= stars.length) return;
        const sa = stars[a], sb = stars[b];
        ctx.beginPath();
        ctx.moveTo(sa.x * w, sa.y * h);
        ctx.lineTo(sb.x * w, sb.y * h);
        ctx.strokeStyle = 'rgba(150,130,255,0.15)';
        ctx.stroke();
      });

      // Stars
      stars.forEach((star) => {
        const opacity = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * star.speed + star.phase));
        const sx = star.x * w;
        const sy = star.y * h;

        if (star.r > 1.2) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.r * 5);
          glow.addColorStop(0, `rgba(${star.color},${opacity * 0.4})`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, star.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color},${opacity})`;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
