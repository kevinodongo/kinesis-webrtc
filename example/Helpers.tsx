import * as crypto from "crypto";
const algorithm = "aes-256-cbc";
let key = "HuzPEZgzqKOo8VwlnYhNUaPWTWSVDRQ2"
let iv = "kg5ILA0826hrew5w"

/**
 * encrypt value
 * @param config 
 * @returns 
 */
export function encryptValue(config: any) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(config), "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted
}

/**
 * dencrypt value
 * @param config 
 * @returns 
 */
export function decryptValue(config: any) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    var decrypted = decipher.update(config, "hex", "utf8") + decipher.final("utf8");
    return JSON.parse(decrypted)
}
