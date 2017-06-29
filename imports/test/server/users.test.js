import expect from 'expect';
import { Meteor } from 'meteor/meteor';
import { validateNewUser } from './../../api/users';

if (Meteor.isServer) {
  describe('Validate User', function() {
    it('should allow valid email address', function() {
      const testUser = {
        emails: [{ address: 'yar@test.com'}]
      }
      const res = validateNewUser(testUser);
      expect(res).toBe(true);
    });

    it('should reject invalid email', function() {
      const testUser = {
        emails: [{ address: 'yartestcom'}]
      }
      expect(() => {
        validateNewUser(testUser);
      }).toThrow();
    });
  });

}
