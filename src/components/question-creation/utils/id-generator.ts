/**
 * Generates a unique identifier using crypto.randomUUID()
 * Fallback to a timestamp-based UUID if crypto.randomUUID is not available
 */
export const generateId = (): string => {
  try {
    return crypto.randomUUID();
  } catch (error) {
    // Fallback for environments where crypto.randomUUID is not available
    console.error("crypto.randomUUID is not available", error);
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
};

/**
 * Generates a unique identifier for question options
 */
export const generateOptionId = (): string => generateId();

/**
 * Generates a unique identifier for match items (left and right pairs)
 */
export const generateMatchItemId = (): string => generateId();

/**
 * Generates a unique identifier for blank items in fill-up questions
 */
export const generateBlankId = (): string => generateId();

/**
 * Generates a unique identifier for test cases in coding questions
 */
export const generateTestCaseId = (): string => generateId();
