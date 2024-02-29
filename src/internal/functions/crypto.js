const crypto = require("crypto");

/**
 * Encrypt data with AES
 *
 * @param string Data to encrypt
 * @returns [string, ArrayBufferLike, Buffer] -> [data in HEX, IV, authTag]
 */
const encrypt_aes = (data) => {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.AES_KEY, "hex"),
    iv.buffer
  );
  let encryptedData = cipher.update(data, "utf8", "hex");

  encryptedData += cipher.final("hex");

  let authTag = cipher.getAuthTag();

  return [encryptedData, iv, authTag];
};

const decrypt_aes = (data, iv, authTag) => {
  let decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.AES_KEY, "hex"),
    iv
  );

  decipher.setAuthTag(authTag);

  let decryptedData = decipher.update(data, "hex", "utf8");

  decryptedData += decipher.final("utf8");

  return decryptedData;
};

const generateRandomAESKey = () => {
  console.log(crypto.randomBytes(32).toString("hex"));
};

module.exports = {
  decrypt_aes,
  encrypt_aes,
  generateRandomAESKey,
};
