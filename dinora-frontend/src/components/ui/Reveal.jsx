import { motion } from "framer-motion";

/**
 * One consistent scroll-reveal treatment, used across the landing page
 * instead of scattering ad-hoc CSS transitions per section. `delay` lets
 * siblings stagger without each needing its own animation definition.
 */
export default function Reveal({ children, delay = 0, y = 22, className = "", as = "div" }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
