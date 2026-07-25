/**
 * Dedicated feature-level style tokens and localized utility classes for Member 3's specialist components
 * (Dashboard, Analytics, Gamification, Profile).
 * 
 * Prevents duplicating Member 2's global layout styling while providing rich visual presentation.
 */
export const FeatureStyles = {
  cardContainer: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[var(--border-accent)]",
  gradientHeader: "bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-light)] to-[var(--secondary-light)] bg-clip-text text-transparent font-extrabold",
  statBox: "flex flex-col gap-1 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors",
  badgeGlow: "shadow-[var(--accent-glow)] border-[var(--border-accent)] bg-[var(--accent-dim)]",
  interactiveRow: "flex items-center justify-between p-3.5 rounded-xl bg-neutral-800/40 hover:bg-[var(--bg-surface)] border border-neutral-800/80 hover:border-[var(--border-accent)] transition-all cursor-pointer",
};
