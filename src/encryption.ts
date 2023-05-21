import type { EncryptedEnv } from '@app/database';
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv, randomUUID } from 'crypto';

const encryptString = (plainText: string, password: string) => {
  const salt = randomBytes(16);
  const key = pbkdf2Sync(password, salt, 100000, 32, 'sha512');
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return {
    iv: iv.toString('base64'),
    salt: key.toString('base64'),
    data: encrypted,
  };
}

const decryptString = ({
  data,
  password,
  salt,
  iv
}: {
  data: string;
  password: string;
  salt: string;
  iv: string;
}) => {
  const key = pbkdf2Sync(password, salt, 100000, 32, 'sha512');
  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));

  let decrypted = decipher.update(data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export const encryptEnv = ({
  userId,
  password,
  name,
  value,
}: {
  name: string;
  value: string;
  userId: string;
  password: string
}) => {
  const encryptedData = encryptString(String(value), password);
  return {
    id: randomUUID(),
    userId,
    name,
    ...encryptedData,
  } satisfies EncryptedEnv;
};

export const decryptEnv = (encryptedEnv: Omit<EncryptedEnv, 'id' | 'userId' | 'name'>, password: string) => decryptString({
  ...encryptedEnv,
  password,
});
