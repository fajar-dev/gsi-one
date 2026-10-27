import {
  generateClientTicketNumber,
  isTicketNumberFormat,
} from '../../src/utils/ticketHelpers';

describe('ticketHelpers', () => {
  describe('generateClientTicketNumber', () => {
    it('should generate ticket number with format GSI-YYYY-XXXXXX', () => {
      const ticket = generateClientTicketNumber();
      const year = new Date().getFullYear();

      expect(ticket).toMatch(new RegExp(`^GSI-${year}-\\d{6}$`));
    });

    it('should generate unique ticket numbers on multiple calls', () => {
      const ticket1 = generateClientTicketNumber();
      const ticket2 = generateClientTicketNumber();

      expect(ticket1).not.toEqual(ticket2);
    });
  });

  describe('isTicketNumberFormat', () => {
    it('should return false for email addresses', () => {
      expect(isTicketNumberFormat('client@gmail.com')).toBe(false);
      expect(isTicketNumberFormat('admin@gsi.co.id')).toBe(false);
    });

    it('should return true for GSI ticket numbers', () => {
      expect(isTicketNumberFormat('GSI-2026-849201')).toBe(true);
      expect(isTicketNumberFormat('gsi-2026-102938')).toBe(true);
      expect(isTicketNumberFormat('TCK-849201')).toBe(true);
    });
  });
});
