'use client';

export async function fireConfetti() {
  const mod = await import('canvas-confetti');
  const confetti = mod.default;
  const colors = ['#34d399', '#22d3ee', '#10b981', '#67e8f9'];
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors,
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors,
      disableForReducedMotion: true,
    });
  }, 220);
}