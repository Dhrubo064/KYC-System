import jwt from 'jsonwebtoken';

describe('JWT Token Utilities', () => {
  const jwtSecret = process.env.JWT_SECRET || 'test-secret-key';
  const testPayload = { userId: '123', email: 'test@example.com', role: 'user' };
  const adminPayload = { userId: '456', email: 'admin@example.com', role: 'admin' };

  describe('Token generation', () => {
    it('should generate a valid JWT token', () => {
      const token = jwt.sign(testPayload, jwtSecret, { expiresIn: '24h' });
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = jwt.sign(testPayload, jwtSecret);
      const token2 = jwt.sign(adminPayload, jwtSecret);
      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens with different payloads when signed', () => {
      // JWT tokens with different payloads should definitely be different
      const payload1 = { userId: '1', role: 'user' };
      const payload2 = { userId: '2', role: 'user' };
      
      const token1 = jwt.sign(payload1, jwtSecret);
      const token2 = jwt.sign(payload2, jwtSecret);
      
      expect(token1).not.toBe(token2);
      
      // Verify they decode to different values
      const decoded1: any = jwt.verify(token1, jwtSecret);
      const decoded2: any = jwt.verify(token2, jwtSecret);
      
      expect(decoded1.userId).not.toBe(decoded2.userId);
    });
  });

  describe('Token verification', () => {
    it('should verify a valid token', () => {
      const token = jwt.sign(testPayload, jwtSecret, { expiresIn: '24h' });
      const decoded = jwt.verify(token, jwtSecret);
      expect(decoded).toBeDefined();
      expect((decoded as any).userId).toBe(testPayload.userId);
      expect((decoded as any).email).toBe(testPayload.email);
    });

    it('should fail to verify a token with wrong secret', () => {
      const token = jwt.sign(testPayload, jwtSecret);
      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow();
    });

    it('should fail to verify a malformed token', () => {
      expect(() => {
        jwt.verify('invalid.token', jwtSecret);
      }).toThrow();
    });

    it('should fail to verify an expired token', () => {
      const token = jwt.sign(testPayload, jwtSecret, { expiresIn: '-1s' });
      expect(() => {
        jwt.verify(token, jwtSecret);
      }).toThrow();
    });
  });

  describe('Token payload extraction', () => {
    it('should extract user information from token', () => {
      const token = jwt.sign(testPayload, jwtSecret);
      const decoded: any = jwt.verify(token, jwtSecret);
      expect(decoded.userId).toBe('123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('user');
    });

    it('should include role information in admin tokens', () => {
      const token = jwt.sign(adminPayload, jwtSecret);
      const decoded: any = jwt.verify(token, jwtSecret);
      expect(decoded.role).toBe('admin');
    });
  });

  describe('Token expiration', () => {
    it('should set expiration time on token', () => {
      const token = jwt.sign(testPayload, jwtSecret, { expiresIn: '1h' });
      const decoded: any = jwt.verify(token, jwtSecret);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should calculate correct expiration', () => {
      const expirySeconds = 3600; // 1 hour
      const token = jwt.sign(testPayload, jwtSecret, { expiresIn: expirySeconds });
      const decoded: any = jwt.verify(token, jwtSecret);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDifference = (decoded.exp as number) - currentTime;

      // Should be approximately 1 hour (within 5 second tolerance)
      expect(timeDifference).toBeGreaterThan(3595);
      expect(timeDifference).toBeLessThanOrEqual(3600);
    });
  });
});
