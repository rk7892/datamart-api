const express = require('express');
const cors = require('cors');
const pool = require('./db');
const signinrouter = require('./src/signin/routes');
const { password } = require('pg/lib/defaults');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json())

// POST a new student
app.post("/api/v1/signin", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const query = "INSERT INTO signin (name, email, password) VALUES ($1, $2, $3) RETURNING *";
        const values = [name, email, password];

        const newSignin = await pool.query(query, values);
        
        res.status(201).json({
            message: 'Signin successful',
            user: newSignin.rows[0]
        });
    } catch (err) {
        console.error('Error creating signin:', err);
        res.status(500).json({ 
            message: "Error signing in", 
            error: err.message 
        });
    }
});

// Add this login route in your server file
app.post("/api/v1/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if the email exists
        const userQuery = "SELECT * FROM signin WHERE email = $1";
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userResult.rows[0];

        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // If login is successful, send the user data or token
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


app.listen(port, () => console.log(`app listen ${port}`)
);

app.use("/api/v1/signin", signinrouter);