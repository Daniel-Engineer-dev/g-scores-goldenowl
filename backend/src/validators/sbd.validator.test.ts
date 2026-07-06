import { describe, it, expect } from 'vitest';
import { validateSbd } from './sbd.validator';
import { BadRequestError } from '../lib/errors';

describe('validateSbd', () => {
  it('accepts a valid 8-digit registration number', () => {
    expect(validateSbd('01000001')).toBe('01000001');
  });

  it('trims surrounding whitespace', () => {
    expect(validateSbd('  01000001  ')).toBe('01000001');
  });

  it('rejects the wrong number of digits', () => {
    expect(() => validateSbd('1234567')).toThrow(BadRequestError); // 7 digits
    expect(() => validateSbd('123456789')).toThrow(BadRequestError); // 9 digits
  });

  it('rejects non-numeric input', () => {
    expect(() => validateSbd('0100000A')).toThrow(BadRequestError);
    expect(() => validateSbd('')).toThrow(BadRequestError);
    expect(() => validateSbd(12345678 as unknown)).toThrow(BadRequestError);
  });
});
