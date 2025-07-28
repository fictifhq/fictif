/**
 * Shakes a given DOM element to simulate a real window-like shake.
 * - Applies X and Y transform-based jitter
 * - Automatically respects user reduced-motion preference
 *
 * @param {HTMLElement} element - The DOM element to shake, default: `<main>`
 * @param {number} duration - Total duration in ms (default: 600)
 * @param {number} intensity - Max pixels to move (default: 10)
 */
export declare function shakeElement(element: HTMLElement, duration?: number, intensity?: number): void;
//# sourceMappingURL=element.d.ts.map