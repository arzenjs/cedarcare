"use client";
import { motion, MotionConfig } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/motion";

// The `reveal` class lets a <noscript> rule in layout.js show content when JavaScript is off.

/** Wrap the whole app once: honours the visitor's "reduce motion" setting everywhere. */
export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fade up once when scrolled into view. */
export default function Reveal({ children, className = "", as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag className={`reveal ${className}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </Tag>
  );
}

/** Fade up on page load (use for the hero). `delay` is in seconds. */
export function Entrance({ children, className = "", delay = 0, as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag className={`reveal ${className}`} variants={fadeUp} initial="hidden" animate="show" transition={{ delay }}>
      {children}
    </Tag>
  );
}

/** Parent for a group: its <StaggerItem> children appear one after another. */
export function Stagger({ children, className = "", as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = "", as = "div" }) {
  const Tag = motion[as];
  return <Tag className={`reveal ${className}`} variants={fadeUp}>{children}</Tag>;
}
