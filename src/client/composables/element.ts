/**
 * Shakes a given DOM element to simulate a real window-like shake.
 * - Applies X and Y transform-based jitter
 * - Automatically respects user reduced-motion preference
 *
 * @param {HTMLElement} element - The DOM element to shake, default: `<main>`
 * @param {number} duration - Total duration in ms (default: 600)
 * @param {number} intensity - Max pixels to move (default: 10)
 */
export function shakeElement(element: HTMLElement, duration: number = 300, intensity: number = 10) {
  if (!element) element = document.querySelector('main') as HTMLElement;

  if (!element || !(element instanceof HTMLElement)) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const start = performance.now()
  const originalStyle = element.style.transform

  function animateShake(now: number) {
    const elapsed = now - start
    if (elapsed >= duration) {
      element.style.transform = originalStyle
      return
    }

    // Random X and Y within [-intensity, +intensity]
    const x = (Math.random() * 2 - 1) * intensity
    const y = (Math.random() * 2 - 1) * intensity

    element.style.transform = `translate(${x}px, ${y}px)`

    requestAnimationFrame(animateShake)
  }

  requestAnimationFrame(animateShake)
}
