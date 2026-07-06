import { BadRequestError } from '../lib/errors';

// Every registration number in the 2024 dataset is exactly 8 digits.
const SBD_PATTERN = /^\d{8}$/;

/**
 * Validate and normalise a registration number (số báo danh).
 * Must be exactly 8 digits. Throws BadRequestError on invalid input.
 */
export function validateSbd(raw: unknown): string {
  if (typeof raw !== 'string') {
    throw new BadRequestError('Registration number is required');
  }
  const sbd = raw.trim();
  if (sbd === '') {
    throw new BadRequestError('Registration number must not be empty');
  }
  if (!SBD_PATTERN.test(sbd)) {
    throw new BadRequestError(
      'Registration number must be exactly 8 digits',
    );
  }
  return sbd;
}
