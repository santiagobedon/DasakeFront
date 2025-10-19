// src/utils/validators.ts
export const emailRegex = new RegExp(
  // RFC 5322-ish simplified
  `^(?:[a-zA-Z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:(?:\\\\[\\x00-\\x7F])|[^"\\\\])*")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[A-Za-z]{2,}$`
);

export function validatePassword(p: string) {
  const length = p.length >= 8;
  const upper = /[A-Z]/.test(p);
  const lower = /[a-z]/.test(p);
  const num = /[0-9]/.test(p);
  const special = /[^A-Za-z0-9]/.test(p);
  return { length, upper, lower, num, special, valid: length && upper && lower && num && special };
}
