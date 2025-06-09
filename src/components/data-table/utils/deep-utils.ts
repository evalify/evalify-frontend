type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

// Define a type for comparing values that can handle most common types
type Comparable =
  | string
  | number
  | boolean
  | object
  | null
  | undefined
  | TypedArray
  | Date
  | RegExp
  | Set<unknown>
  | Map<unknown, unknown>;

/**
 * Optimized deep equality check for objects and arrays
 * @param a First value to compare
 * @param b Second value to compare
 * @returns Boolean indicating if values are deeply equal
 */
export function isDeepEqual(a: Comparable, b: Comparable): boolean {
  // Use a WeakMap to track object pairs we've compared to handle circular references
  const visited = new WeakMap<object, object>();

  return compare(a, b);

  function compare(a: Comparable, b: Comparable): boolean {
    // Fast path for primitives and identical references
    if (a === b) return true;

    // Handle null/undefined
    if (a == null || b == null) return a === b;

    // Handle different types quickly
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA !== typeB) return false; // Fast non-recursive paths for common types
    if (typeA !== "object") return false; // We already checked a === b for primitives

    // Handle special object types
    if (a instanceof Date) {
      return b instanceof Date && a.getTime() === b.getTime();
    }

    if (a instanceof RegExp) {
      return b instanceof RegExp && a.toString() === b.toString();
    }

    // Handle arrays
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;

      // Compare elements in order
      for (let i = 0; i < a.length; i++) {
        if (!compare(a[i] as Comparable, b[i] as Comparable)) return false;
      }

      return true;
    } // Special handling for Set - order doesn't matter for Sets
    if (a instanceof Set) {
      if (!(b instanceof Set) || a.size !== b.size) return false;

      // For Sets, we need to check if all elements in a exist in b
      for (const item of a) {
        let found = false;
        for (const otherItem of b) {
          if (compare(item as Comparable, otherItem as Comparable)) {
            found = true;
            break;
          }
        }
        if (!found) return false;
      }
      return true;
    }

    // Special handling for Map
    if (a instanceof Map) {
      if (!(b instanceof Map) || a.size !== b.size) return false;

      for (const [key, val] of a.entries()) {
        if (
          !b.has(key) ||
          !compare(val as Comparable, b.get(key) as Comparable)
        )
          return false;
      }

      return true;
    } // Handle typed arrays
    if (ArrayBuffer.isView(a)) {
      if (
        !ArrayBuffer.isView(b) ||
        a.constructor !== b.constructor ||
        (a as TypedArray).length !== (b as TypedArray).length
      )
        return false;

      // Use optimized comparison for same typed array types
      const typedA = a as TypedArray;
      const typedB = b as TypedArray;

      for (let i = 0; i < typedA.length; i++) {
        if (typedA[i] !== typedB[i]) return false;
      }
      return true;
    } // Handle plain objects with circular reference detection
    if (a.constructor === Object && b.constructor === Object) {
      const objA = a as Record<string, unknown>;
      const objB = b as Record<string, unknown>;

      // Check for circular references
      if (visited.has(objA)) {
        return visited.get(objA) === objB;
      }

      visited.set(objA, objB);

      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);

      // Quick length check
      if (keysA.length !== keysB.length) return false;

      // Compare values directly without sorting keys (object key order matters in modern JS)
      for (const key of keysA) {
        if (
          !(key in objB) ||
          !compare(objA[key] as Comparable, objB[key] as Comparable)
        ) {
          return false;
        }
      }

      return true;
    }

    // If we get here, we're dealing with different object types or custom classes
    // First check if the objects have the same constructor
    if (a.constructor !== b.constructor) return false;

    // For custom classes, fall back to comparing properties
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (
        !compare(
          (a as Record<string, unknown>)[key] as Comparable,
          (b as Record<string, unknown>)[key] as Comparable,
        )
      )
        return false;
    }

    return true;
  }
}

/**
 * Memoizes the result of a function based on its arguments
 * This helps prevent redundant expensive operations
 */
export function memoize<T>(
  fn: (...args: unknown[]) => T,
): (...args: unknown[]) => T {
  const cache = new Map<string, T>();

  return (...args: unknown[]): T => {
    // Create a more robust key that handles circular references and special types
    let key: string;
    try {
      key = JSON.stringify(args, (_, value) => {
        // Handle special cases that JSON.stringify can't handle well
        if (value instanceof Map) {
          return { __type: "Map", entries: Array.from(value.entries()) };
        }
        if (value instanceof Set) {
          return { __type: "Set", values: Array.from(value) };
        }
        if (value instanceof Date) {
          return { __type: "Date", value: value.toISOString() };
        }
        if (value instanceof RegExp) {
          return { __type: "RegExp", value: value.toString() };
        }
        return value;
      });
    } catch {
      // Fallback for circular references or other serialization issues
      key =
        String(args.length) +
        args.map((arg, i) => `${i}:${typeof arg}`).join(",");
    }

    if (cache.has(key)) {
      const cachedValue = cache.get(key);
      return cachedValue !== undefined ? cachedValue : fn(...args);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Reset URL parameters by removing all query parameters
 * @param router Next.js router instance
 * @param pathname Current pathname
 */
export function resetUrlState(
  router: { replace: (path: string) => void },
  pathname: string,
): void {
  router.replace(pathname);
}
