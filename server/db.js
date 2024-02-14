const Pool = require("pg").Pool;

const pool= new Pool({
    user:"postgres",
    password:"115361",
    host: "localhost",
    post: 5432,
    database:"dbmsProject"
});
module.exports =pool;