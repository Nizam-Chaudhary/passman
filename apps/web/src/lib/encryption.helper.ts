export async function deriveKey(
    password: string,
    salt: string
): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password); // Convert password to bytes
    const saltBuffer = encoder.encode(salt); // Convert salt to bytes

    // Import the password as a key for PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    // Derive the key using PBKDF2
    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: 100000, // Same as pbkdf2Sync iterations
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true, // This means we won't use the derived key for encryption directly here
        ["encrypt", "decrypt"]
    );

    return derivedKey; // Return as a Uint8Array for consistency
}

// Convert string key to CryptoKey
export async function importKey(keyString: string): Promise<CryptoKey> {
    // Convert hex string to Uint8Array
    const keyBytes = new Uint8Array(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        keyString.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16))
    );

    // Import as CryptoKey
    return await crypto.subtle.importKey(
        "raw",
        keyBytes,
        {
            name: "AES-GCM",
        },
        true, // extractable
        ["encrypt", "decrypt"]
    );
}

export async function encrypt(
    data: string,
    key: CryptoKey // key passed as a raw Uint8Array
): Promise<{ iv: string; encrypted: string }> {
    // Generate a random initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM typically uses a 12-byte IV

    // Convert the data to a Uint8Array
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Encrypt the data using AES-GCM
    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key, // The imported CryptoKey
        dataBuffer // The data to encrypt
    );

    // Return the IV (as hex) and encrypted data (as hex)
    const encryptedArray = new Uint8Array(encryptedBuffer);
    return {
        iv: Array.from(iv)
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join(""), // IV as hex string
        encrypted: Array.from(encryptedArray)
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join(""), // Encrypted data as hex string
    };
}

export async function decrypt(
    encryptedData: { iv: string; encrypted: string },
    key: CryptoKey // key passed as a raw Uint8Array
): Promise<string> {
    // Convert the IV from hex string to Uint8Array
    const iv = new Uint8Array(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        encryptedData.iv
            .match(/.{1,2}/g)!
            .map((byte) => Number.parseInt(byte, 16))
    );

    // Convert the encrypted data from hex string to Uint8Array
    const encryptedBuffer = new Uint8Array(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        encryptedData.encrypted
            .match(/.{1,2}/g)!
            .map((byte) => Number.parseInt(byte, 16))
    );

    // Decrypt the data using AES-GCM
    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key, // The imported CryptoKey
        encryptedBuffer // The encrypted data to decrypt
    );

    // Convert the decrypted buffer to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}

export function generateMasterKey(): string {
    const masterKey = new Uint8Array(32); // AES-256 requires 32-byte key
    crypto.getRandomValues(masterKey); // Use Web Crypto API to generate random bytes
    return Array.from(masterKey)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export function generateRecoveryKey(): string {
    const recoveryKey = new Uint8Array(32); // AES-256 requires 32-byte key
    crypto.getRandomValues(recoveryKey); // Use Web Crypto API to generate random bytes
    return Array.from(recoveryKey)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export function generateSalt(length = 16): string {
    const salt = new Uint8Array(length);
    crypto.getRandomValues(salt); // Generate random salt using Web Crypto API
    return Array.from(salt)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}
