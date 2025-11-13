/**
 * Simple UUID generator for creating unique IDs
 * This is a lightweight replacement for a UUID library
 */

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const generateMessageId = (): string => {
  return `msg_${generateUUID()}_${Date.now()}`;
};