const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    const salt = 10;
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch (error) {
    console.error("Error while hashing ", error);
    throw error;
  }
}
