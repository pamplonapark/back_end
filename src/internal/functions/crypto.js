const crypto = require("crypto");

/**
 * Encrypts data using AES encryption algorithm.
 * 
 * @param {string} data - The data to be encrypted.
 * @returns {[string, ArrayBufferLike, Buffer]} An array containing encrypted data (HEX), initialization vector (IV), and certificate/signature.
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

  let certificate = cipher.getAuthTag();

  return [encryptedData, iv, certificate];
};

/**
 * Decrypts data using AES encryption algorithm.
 * 
 * @param {string} data - The encrypted data to be decrypted.
 * @param {ArrayBufferLike} iv - The initialization vector used for decryption.
 * @param {Buffer} certificate - The certificate or signature associated with the encrypted data.
 * @returns {string} The decrypted data.
 */
const decrypt_aes = (data, iv, certificate) => {
  let decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.AES_KEY, "hex"),
    iv
  );

  decipher.setAuthTag(certificate);

  let decryptedData = decipher.update(data, "hex", "utf8");

  decryptedData += decipher.final("utf8");

  return decryptedData;
};

/**
 * Generates a random AES key in HEX format. (For development use only)
 * 
 * @deprecated This function is intended for development purposes only.
 * @returns {string} A randomly generated AES key in HEX format.
 */
const generateRandomAESKey = () => {
  if (process.env.ENVIRONMENT == "development")
    return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  decrypt_aes,
  encrypt_aes,
  generateRandomAESKey,
};
