const checkEmailExists = "SELECT s FROM signin s WHERE s.email = $1";
const signin = "INSERT INTO signin (name, email, password) VALUES ($1, $2, $3)";


module.export = {
    checkEmailExists,
    signin,
};