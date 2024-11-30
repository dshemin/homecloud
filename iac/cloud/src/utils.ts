import { Buffer } from "buffer";

export const base64 = (s: string): string => {
  return Buffer.from(s, "utf8").toString("base64");
};
