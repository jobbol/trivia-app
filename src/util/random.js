
/**
 * Get a random number between min and max.  Inclusive min and max.
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 * @example
 * random(0,2);
 * //returns 0, 1, or 2
 */
export default function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}