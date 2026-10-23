"use client";
import { motion, MotionConfig } from "motion/react";

// One gentle fade-up used sparingly. MotionConfig honours the visitor's reduced-motion setting.
export default function Reveal({ children, className, delay = 0 }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
