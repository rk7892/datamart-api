const pool = require('../../db');
const queries = require('./queries');

const signinFun = (req, res) => {
    const { name, email, password } = req.body;

    // Log the received data
    console.log('Received data:', req.body);

    // Insert the new user into the signin table
    pool.query(queries.signin + " RETURNING *", [name, email, password], (error, results) => {
        if (error) {
            console.error('Error in signin query:', error);
            return res.status(500).json({ message: 'Error signing in', error });
        }
        res.status(201).json({ message: 'Signin successful', user: results.rows[0] });
    });
};

module.exports = {
    signinFun
};
