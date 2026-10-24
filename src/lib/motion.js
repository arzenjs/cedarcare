// The site's motion system: one easing, one duration, one stagger. Change values here.
export const EASE = [0.22, 1, 0.36, 1];
export const DURATION = 0.5;
export const STAGGER = 0.08;

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};
export const staggerParent = { hidden: {}, show: { transition: { staggerChildren: STAGGER } } };
