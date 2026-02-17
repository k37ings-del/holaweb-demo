import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  phase: number;
}

const FloatingBubbles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();

    const count = Math.min(30, Math.floor(window.innerWidth / 50));
    const bubbles: Bubble[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 35 + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.5 - 0.15,
      opacity: 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      for (const b of bubbles) {
        // Pulsing radius and opacity
        const pulse = Math.sin(time * 2 + b.phase) * 0.3 + 1;
        const currentRadius = b.radius * pulse;
        const currentOpacity = b.opacity * (0.7 + Math.sin(time * 1.5 + b.phase) * 0.3);

        // Gentle sway
        b.x += b.vx + Math.sin(time + b.phase) * 0.15;
        b.y += b.vy;

        if (b.y + currentRadius < 0) {
          b.y = canvas.height + currentRadius;
          b.x = Math.random() * canvas.width;
        }
        if (b.x < -currentRadius) b.x = canvas.width + currentRadius;
        if (b.x > canvas.width + currentRadius) b.x = -currentRadius;

        // Outer glow
        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, currentRadius);
        gradient.addColorStop(0, `hsla(352, 66%, 47%, ${currentOpacity * 0.18})`);
        gradient.addColorStop(0.7, `hsla(352, 66%, 47%, ${currentOpacity * 0.06})`);
        gradient.addColorStop(1, `hsla(352, 66%, 47%, 0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bubble ring
        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(352, 66%, 47%, ${currentOpacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.arc(b.x - currentRadius * 0.25, b.y - currentRadius * 0.25, currentRadius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 100%, ${currentOpacity * 0.15})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default FloatingBubbles;
