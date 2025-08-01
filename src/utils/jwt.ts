import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET as Secret;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  return jwt.sign(payload, secret, { expiresIn });
};
