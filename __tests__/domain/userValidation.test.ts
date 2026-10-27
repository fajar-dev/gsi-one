import { validateNewUser } from '../../src/domain/validation/user';
describe('user registration validation shared by both forms', () => {
  it.each([
    ['', 'person@example.com', 'password123'],
    ['Name', 'bad-email', 'password123'],
    ['Name', 'person@example.com', 'short'],
    ['Name', 'person@example.com', '        '],
  ])('rejects incomplete credentials', (...input) =>
    expect(
      validateNewUser(...(input as [string, string, string])),
    ).not.toBeNull(),
  );
  it('accepts normalized name/email while keeping password contents intact', () =>
    expect(
      validateNewUser(' Person ', ' person@example.com ', ' pass123 '),
    ).toBeNull());
});
