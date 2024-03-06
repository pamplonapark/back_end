const crypto = require("crypto");
const jwt = require("jwt-simple");
const moment = require("moment");

/**
 * Encrypts data using AES encryption algorithm.
 * 
 * @param {string} data - The data to be encrypted.
 * @returns {[string, ArrayBufferLike, Buffer]} An array containing encrypted data (HEX), initialization vector (IV), and certificate/signature.
 */
const encrypt_aes = (data) => {
  try {
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
  } catch (error) {
    throw Error("Error al encriptar: " + error.message);
  }
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
  try {
    let decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.AES_KEY, "hex"),
      iv
    );

    decipher.setAuthTag(certificate);

    let decryptedData = decipher.update(data, "hex", "utf8");

    decryptedData += decipher.final("utf8");

    return decryptedData;
  }
  catch { return undefined; }
};

/**
 * Generates a random AES key in HEX format. (For development use only)
 * 
 * @deprecated This function is intended for development purposes only.
 * @returns {string} A randomly generated AES key in HEX format.
 */
const generateRandomAESKey = () => {
  if (process.env.NODE_ENV == "development")
    return crypto.randomBytes(32).toString("hex");
};

const create_bearer_token = (uuid, password, username) => {
  let time_max = "hours";

  if (process.env.NODE_ENV == "development") time_max = "years";

  return jwt.encode(
    {
      uuid: uuid,
      password: password,
      username: username,
      iat: moment().unix(),
      exp: moment().add(24, time_max).unix(),
    },
    process.env.JWT_TOKEN
  );
};

/**
 * Decodes the bearer token using the JWT token secret.
 * 
 * @param {string} bearer_token - The bearer token to decode.
 * @returns {object|undefined} - The decoded token payload if successful, or undefined if an error occurs.
 */
const decode_bearer_token = (bearer_token) => {
  try {
    return jwt.decode(bearer_token, process.env.JWT_TOKEN);
  }
  catch
  {
    return undefined;
  }
};

/**
 * Checks if the bearer token is active based on the expiration time.
 * 
 * @param {number} exp - The expiration time of the bearer token.
 * @returns {boolean} - True if the bearer token is active, false otherwise.
 */
const check_active_bearer = (exp) => {
  return exp <= moment().unix();
};

module.exports = {
  decrypt_aes,
  encrypt_aes,
  generateRandomAESKey,
  create_bearer_token,
  decode_bearer_token,
  check_active_bearer
};
