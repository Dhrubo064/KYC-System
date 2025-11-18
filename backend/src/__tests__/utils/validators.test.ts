import {
  isValidEmail,
  isValidPhoneNumber,
  isValidPassword,
  isValidDate,
  isAdult,
} from '../../utils/validators';

describe('Validators', () => {
  describe('Email validation', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(isValidEmail('admin+tag@mail.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid.email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user name@example.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should handle edge cases for email', () => {
      expect(isValidEmail('a@b.c')).toBe(true);
      expect(isValidEmail('test@localhost.localdomain')).toBe(true);
    });
  });

  describe('Phone number validation', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('1234567890')).toBe(true);
      expect(isValidPhoneNumber('+1-234-567-8900')).toBe(true);
      expect(isValidPhoneNumber('+1 (234) 567-8900')).toBe(true);
      expect(isValidPhoneNumber('123-456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('abc123defgh')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
    });

    it('should handle different formats', () => {
      expect(isValidPhoneNumber('+44 20 7946 0958')).toBe(true);
      expect(isValidPhoneNumber('9876543210')).toBe(true);
    });
  });

  describe('Password validation', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('securePassword')).toBe(true);
      expect(isValidPassword('123456')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });

    it('should validate exactly 6 character password', () => {
      expect(isValidPassword('123456')).toBe(true);
    });

    it('should reject less than 6 characters', () => {
      expect(isValidPassword('12345')).toBe(false);
    });
  });

  describe('Date validation', () => {
    it('should validate correct date formats', () => {
      expect(isValidDate('2023-01-15')).toBe(true);
      expect(isValidDate('2000-12-25')).toBe(true);
      expect(isValidDate('1990-06-30')).toBe(true);
    });

    it('should validate date objects converted to string', () => {
      const date = new Date('2023-06-15');
      expect(isValidDate(date.toISOString())).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate('2023-13-45')).toBe(false);
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('')).toBe(false);
      expect(isValidDate('not a date')).toBe(false);
    });
  });

  describe('Age validation', () => {
    it('should identify adults correctly', () => {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      expect(isAdult(eighteenYearsAgo)).toBe(true);
    });

    it('should identify minors correctly', () => {
      const today = new Date();
      const sixteenYearsAgo = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      expect(isAdult(sixteenYearsAgo)).toBe(false);
    });

    it('should handle edge case of turning 18 today', () => {
      const today = new Date();
      const exactlyEighteen = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      expect(isAdult(exactlyEighteen)).toBe(true);
    });

    it('should identify people over 18 as adults', () => {
      const over18 = new Date('2000-01-01');
      expect(isAdult(over18)).toBe(true);
    });
  });
});
