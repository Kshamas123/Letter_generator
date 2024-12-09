const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Adjust to the exact address of your frontend
    credentials: true  // Allow credentials (cookies) to be sent
}));

app.use(session({
    secret: 'aSjd82hfsJHQwe23jsdfH9asjkYJqwe1!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Change to `true` in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

const port = 3000;
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kshama123',
    database: 'LETTER_GENERATOR_DBMS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Sign Up Route
app.post('/sign_up', async (req, res) => {
    try {
        const { Name, Password, Email } = req.body;

        if (!Name || !Password || !Email) {
            return res.status(400).send({ error: 'Name, Password, and Email are required' });
        }

        const query = 'INSERT INTO USER_DETAILS (USERNAME, USERPASSWORD, USEREMAIL) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [Name, Password, Email]);

        req.session.userId = result.insertId;
        console.log('Session Data after sign-up:', req.session);
        res.status(201).send({ message: 'Account created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error during registration:', error.stack);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/sign_in', async (req, res) => {
    try {
        const { Name, Password } = req.body;

        if (!Name || !Password) {
            return res.status(400).send({ error: 'Name and Password are required' });
        }

        const query = 'SELECT USERID, USERNAME, USERPASSWORD FROM USER_DETAILS WHERE USERNAME = ?';
        const [result] = await pool.query(query, [Name]);

        if (result.length === 0) {
            return res.status(404).send({ error: 'Invalid Username' });
        }

        const user = result[0];
        if (user.USERPASSWORD !== Password) {
            return res.status(401).send({ error: 'Invalid Password' });
        }

        req.session.userId = user.USERID;
        console.log('Session Data after login:', req.session);

        res.status(200).send({ message: 'Login successful', userId: user.USERID });
    } catch (error) {
        console.error('Error during login:', error.stack);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


app.post('/invitation_letter', (req, res) => {

    try{
     const{ senderAddress,date,eceiverName,eventType,eventDate,eventVenue,senderName,userId}=req.body;
     console.log(userId);
     res.status(200).send({ message: ' successful' });
    }
    catch(error)
    {
        res.status(500).send({ error: 'Internal Server Error' });
    }
    
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

