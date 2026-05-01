import { mode, pad } from "crypto-js";
import { decrypt, encrypt } from "crypto-js/aes";
import * as uft8 from "crypto-js/enc-utf8";
import { logger } from "./logger.util";

export namespace EncryptUtil {
  export function encryptBase64(data: string, plainKey: string) {
    try {
      const iv = uft8.parse(plainKey.substring(0, 16));
      const key = uft8.parse(plainKey.substring(16));

      return encrypt(data, key, {
        iv,
        mode: mode.CBC,
        padding: pad.Pkcs7,
      }).toString();
    } catch (error) {
      logger.error("Error en encrypt", error as Error);
      return null;
    }
  }

  export function decryptBase64(data: string, plainKey: string) {
    try {
      const iv = uft8.parse(plainKey.substring(0, 16));
      const key = uft8.parse(plainKey.substring(16));
      return decrypt(data, key, {
        iv,
        mode: mode.CBC,
        padding: pad.Pkcs7,
      }).toString(uft8);
    } catch (error) {
      logger.error("Error en decrypt", error as Error);
      return null;
    }
  }
}
