import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Cursor-tracking radial glow — the "Spotlight" pattern popularized by
 * Aceternity UI: a soft light that follows the pointer inside its
 * container, built on framer-motion's motion values + useSpring for a
 * physically-damped follow instead of a raw 1:1 mouse position.
 */
export default function Spotlight({ className = "", size = 500, color = "rgba(255,255,255,0.16)" }) {
  const ref = useRef(null);
  const mx = useMotionValue(size / 2);
  const my = useMotionValue(size / 2);
  const x = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.4 });
  const y = useSpring(my, { stiffness: 120, damping: 22, mass: 0.4 });

  function handleMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <div ref={ref} className={`spotlight-layer ${className}`} onMouseMove={handleMove} aria-hidden="true">
      <motion.div
        className="spotlight-glow"
        style={{
          width: size,
          height: size,
          left: x,
          top: y,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
