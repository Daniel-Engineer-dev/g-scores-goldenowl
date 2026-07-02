import confetti from 'canvas-confetti';

/**
 * Fire a celebratory fireworks display for `duration` ms using randomly
 * positioned confetti bursts. Rendered above the modal (high z-index).
 */
export function launchFireworks(duration = 4000): void {
  const end = Date.now() + duration;

  const interval = window.setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) {
      window.clearInterval(interval);
      return;
    }
    const particleCount = Math.max(20, 60 * (timeLeft / duration));
    confetti({
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 2000,
      particleCount,
      origin: { x: Math.random(), y: Math.random() * 0.6 },
    });
  }, 250);
}
