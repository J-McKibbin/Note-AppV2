
require('dotenv').config({ path: '.env.testing' }); // Load .env.testing
console.log("BUN_ENV:", process.env.DATABASE_URL);

console.log(process.env.DATABASE_URL)