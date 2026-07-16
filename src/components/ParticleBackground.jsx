import { useEffect, useRef } from "react";

/**
 * ParticleBackground Component:
 * High-performance interactive visuals canvas controller. Uses a multi-node mathematical 
 * vector networking matrix running in a requestAnimationFrame pipeline, adjusting node 
 * rendering colors dynamically in sync with current active state themes.
 */
export default function ParticleBackground({ theme }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Core Layout Boundaries
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animId;

    // Build independent vector nodes containing individual speed values and visibility indices
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    /**
     * Recursive Painting Loop: Handles individual node tracking mutations, coordinate updates,
     * and updates connection vectors based on calculated pixel distances.
     */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const { r, g, b } = theme;

      // Pipeline Section A: Node recalculation and bounce checking
      particles.forEach((p) => {
        p.x += p.vx; 
        p.y += p.vy;

        // Wrap-around layout boundary checks
        if (p.x < 0) p.x = W; 
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; 
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
      });

      // Pipeline Section B: Vector networking checks via distance formulations
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((q) => {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If individual points enter interaction radiuses, link them via linear borders
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); 
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Schedule subsequent repaint execution
      animId = requestAnimationFrame(draw);
    }

    // Initialize animation engine pipeline
    draw();

    // Responsive Interface Adapter
    const resize = () => { 
      W = canvas.width = window.innerWidth; 
      H = canvas.height = window.innerHeight; 
    };
    window.addEventListener("resize", resize);

    // Context Optimization: Teardown loops and events to isolate execution threads
    return () => { 
      cancelAnimationFrame(animId); 
      window.removeEventListener("resize", resize); 
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6,
      }} 
    />
  );
}