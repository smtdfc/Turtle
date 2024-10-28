/**
 * Creates a throttled function that only invokes the provided function at 
 * most once per specified time interval.
 *
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time interval in milliseconds to limit the 
 *                         function calls.
 * @returns {Function} A new throttled function.
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scroll event triggered');
 * }, 1000);
 *
 * window.addEventListener('scroll', handleScroll);
 */
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Creates a debounced function that delays invoking the provided function 
 * until after a specified delay period has elapsed since the last time the 
 * debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A new debounced function.
 *
 * @example
 * const handleResize = debounce(() => {
 *   console.log('Resize event triggered');
 * }, 200);
 *
 * window.addEventListener('resize', handleResize);
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const performance={
  debounce,
  throttle
}