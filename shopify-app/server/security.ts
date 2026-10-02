import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export const secretCode = () => randomBytes(24).toString("base64url");
function key() {
  const value = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY ?? "", "base64");
  if (value.length !== 32)
    throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes");
  return value;
}
export function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [
    "v1",
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    data.toString("base64"),
  ].join(".");
}
export function decrypt(value: string) {
  const [v, iv, tag, data] = value.split(".");
  if (v !== "v1") throw new Error("Unsupported ciphertext");
  const cipher = createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(iv, "base64"),
  );
  cipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([
    cipher.update(Buffer.from(data, "base64")),
    cipher.final(),
  ]).toString("utf8");
}
export function validWebhook(raw: Buffer, signature: string, secret: string) {
  if (!secret || !/^[A-Za-z0-9+/]{43}=$/.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(raw).digest();
  const actual = Buffer.from(signature, "base64");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export function shopDomain(value: string) {
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(value))
    throw new ApiError(400, "Invalid shop");
  return value;
}
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
