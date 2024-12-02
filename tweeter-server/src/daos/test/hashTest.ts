const bcrypt = require("bcryptjs");
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Cost factor
  const salt = await bcrypt.genSalt(saltRounds); // Generate salt
  const hashedPassword = await bcrypt.hash(password, salt); // Hash password
  return hashedPassword;
}

// Usage
let hashedPassword: string;
hashPassword("mySecretPassword")
  .then((hashed) => {
    console.log(hashed);
    hashedPassword = hashed;
  })
  .then(() => bcrypt.compare("mySecretPassword", hashedPassword))
  .then((result) => {
    console.log(result);
  });
