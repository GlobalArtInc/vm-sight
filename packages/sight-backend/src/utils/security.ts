import bcrypt from 'bcrypt';
const {v4: uuidv4} = require('uuid');

/**
 * Generate password hash
 * @param password
 */
export async function cryptPassword(password) {
    console.log(password, typeof password)
    const salt = await bcrypt.genSalt(8);
    return bcrypt.hash(password, salt);
}

/**
 * Comparing a password hash with a password
 * @param plainPass
 * @param hash
 */
export async function comparePassword(plainPass, hash) {
    return bcrypt.compare(plainPass, hash);
}

/**
 * Generate GUID
 */
export function generateID() {
    return uuidv4();
}
