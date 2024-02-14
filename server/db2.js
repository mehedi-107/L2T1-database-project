const Pool = require('pg').Pool;
const pool = new Pool({
  host: "ep-shrill-wave-a139vdus.ap-southeast-1.aws.neon.tech",
  database: "hospitalDB",
  user: "hmdmehedi10107",
  password: "mfHEhYt8Su0b",
  port: 5432,
  ssl: { rejectUnauthorized: false },
  
});

module.exports = pool;
