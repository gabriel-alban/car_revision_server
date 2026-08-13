import jwt from 'jsonwebtoken';
import { User } from './userModel.js';

describe('User model', () => {
  afterEach(() => {
    delete process.env.JWT_SECRET_KEY;
    delete process.env.JWT_REFRESH_SECRET_KEY;
    delete process.env.ACCESS_TOKEN_TTL;
    delete process.env.REFRESH_TOKEN_TTL;
  });

  it('accepts a valid user', () => {
    const user = new User({
      username: 'alban123',
      email: 'user@example.com',
      password: 'StrongPass1!'
    });

    expect(user.validateSync()).toBeUndefined();
  });

  it('requires username, email, and password', () => {
    const user = new User();

    const error = user.validateSync();

    expect(error?.errors.username).toBeDefined();
    expect(error?.errors.email).toBeDefined();
    expect(error?.errors.password).toBeDefined();
  });

  it('rejects a username shorter than eight characters', () => {
    const user = new User({
      username: 'alban12',
      email: 'user@example.com',
      password: 'StrongPass1!'
    });

    expect(user.validateSync()?.errors.username).toBeDefined();
  });

  it('rejects an email shorter than ten characters', () => {
    const user = new User({
      username: 'alban123',
      email: 'a@b.co',
      password: 'StrongPass1!'
    });

    expect(user.validateSync()?.errors.email).toBeDefined();
  });

  it('rejects a password shorter than eight characters', () => {
    const user = new User({
      username: 'alban123',
      email: 'user@example.com',
      password: 'short'
    });

    expect(user.validateSync()?.errors.password).toBeDefined();
  });

  it('trims the password', () => {
    const user = new User({
      username: 'alban123',
      email: 'user@example.com',
      password: '  StrongPass1!  '
    });

    expect(user.password).toBe('StrongPass1!');
  });

  it('generates an access token', () => {
    process.env.JWT_SECRET_KEY = 'access-secret';
    process.env.ACCESS_TOKEN_TTL = '15m';

    const user = new User({
      username: 'alban123',
      email: 'user@example.com',
      password: 'StrongPass1!'
    });

    const token = user.generateToken();
    const payload = jwt.verify(token, 'access-secret') as jwt.JwtPayload;

    expect(payload.username).toBe('alban123');
    expect(payload._id).toBe(user._id.toString());
  });

  it('generates a refresh token', () => {
    process.env.JWT_REFRESH_SECRET_KEY = 'refresh-secret';
    process.env.REFRESH_TOKEN_TTL = '7d';

    const user = new User({
      username: 'alban123',
      email: 'user@example.com',
      password: 'StrongPass1!'
    });

    const token = user.generateRefreshToken();
    const payload = jwt.verify(token, 'refresh-secret') as jwt.JwtPayload;

    expect(payload.username).toBe('alban123');
    expect(payload._id).toBe(user._id.toString());
  });

  it('throws when the access token secret is missing', () => {
    const user = new User({
      username: 'alban123',
      email: 'user@example.com',
      password: 'StrongPass1!'
    });

    expect(() => user.generateToken()).toThrow('Secret key is missing!');
  });

  it('throws when the refresh token secret is missing', () => {
    delete process.env.JWT_REFRESH_SECRET_KEY;

    const user = new User({
      username: 'alban123',
      email: 'user@example.com',
      password: 'StrongPass1!'
    });

    expect(() => user.generateRefreshToken()).toThrow('Refresh secret key is missing!');
  });
});