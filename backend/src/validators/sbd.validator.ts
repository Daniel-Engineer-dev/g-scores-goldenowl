import { BadRequestError } from '../lib/errors';

const SBD_PATTERN = /^\d{6,8}$/;

/**
 * Validate and normalise a registration number (số báo danh).
 * Must be 6-8 digits. Throws BadRequestError on invalid input.
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
      'Registration number must contain 6-8 digits only',
    );
  }
  return sbd;
}
