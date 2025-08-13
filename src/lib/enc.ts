import { createDecipheriv, scryptSync } from "node:crypto";

function keyFromSecret(secret: string) {
  // Use the SAME derivation you used to encrypt tokens.
  // If you used a raw 32-byte key, replace this with Buffer.from(secret, 'base64' | 'hex').
  return scryptSync(secret, "lint-static-salt", 32);
}
const fromMaybeHex = (s: string) =>
  /^[0-9a-f]+$/i.test(s) ? Buffer.from(s, "hex") : Buffer.from(s, "base64");

export function decryptAesGcmHex(encryptedHex: string, ivHex: string, tagHex: string, secret?: string) {
  const key = keyFromSecret(secret ?? process.env.APP_ENC_KEY!);
  const iv  = fromMaybeHex(ivHex);
  const tag = fromMaybeHex(tagHex);
  const ct  = fromMaybeHex(encryptedHex);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString("utf8");
}

export function encryptAesGcmHex(plaintext: string, secret?: string) {
  const key = keyFromSecret(secret ?? process.env.APP_ENC_KEY!);
  const iv = require("crypto").randomBytes(16);
  
  const cipher = require("crypto").createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encryptedToken: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex")
  };
}
