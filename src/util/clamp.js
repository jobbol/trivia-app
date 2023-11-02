/**
 * Forces a number to fit inside a given range.  Inclusive min and max.
 * @param {number} num - The number to force.
 * @param {number} min - The lowest possible value the number can be.  Inclusive.
 * @param {number} max - The highest possible value the number can be.  Inclusive.
 * @returns {number}
 * @example
 * clamp(5, 1, 10); //5
 * clamp(-1, 1, 10); //1
 * clamp(100, 1, 10); //10
 */
export default function clamp (num, min, max) {
    return Math.min(Math.max(num, min), max);
}
