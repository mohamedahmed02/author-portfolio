import { hash, verify } from "@node-rs/argon2";

// Argon2id = 2 (avoid ambient const enum with isolatedModules)
const argonOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
  algorithm: 2,
};

export async function hashPassword(password: string) {
  return hash(password, argonOptions);
}

export async function verifyPassword(hashValue: string, password: string) {
  try {
    return await verify(hashValue, password, argonOptions);
  } catch {
    return false;
  }
}
