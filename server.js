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
      password: 'megha@102',
      database: 'letter_generator_dbms',
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



  app.post('/invitation_letter', async (req, res) => {
      try {
        const {
          senderAddress,
          letterdate,
          receiverName,
          eventType,
          eventDate,
          eventVenue,
          senderName,
          userId,
        } = req.body;
    
        // Check for required fields
        if (
          !senderAddress ||
          !letterdate ||
          !receiverName ||
          !eventType ||
          !eventDate ||
          !eventVenue ||
          !senderName ||
          !userId
        ) {
          return res.status(400).send({ error: 'Fields are required' });
        }
    
        // SQL query to insert data
        const query =
          'INSERT INTO invitation_letter (USERID, SENDERADDRESS, LETTER_DATE, RECEIVERNAME, EVENTTYPE, EVENTDATE, EVENTVENUE, SENDERNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
        // Execute the query
        const [result] = await pool.query(query, [
          userId,
          senderAddress,
          letterdate,
          receiverName,
          eventType,
          eventDate,
          eventVenue,
          senderName,
        ]);
    
        // Send the generated LETTERID back to the frontend
        res.status(201).send({
          message: 'Data added successfully',
          letterId: result.insertId, // `insertId` contains the auto-incremented ID
        });
      } catch (error) {
        console.error('Error during registration:', error.stack);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });
    app.post('/update-invitation_letter', async (req, res) => {
      try {
        const {
          senderAddress,
          letterdate,
          receiverName,
          eventType,
          eventDate,
          eventVenue,
          senderName,
          userId,
          letterId,
        } = req.body;
    
        // Check for required fields
        if (
          !senderAddress ||
          !letterdate ||
          !receiverName ||
          !eventType ||
          !eventDate ||
          !eventVenue ||
          !senderName ||
          !userId ||
          !letterId
        ) {
          return res.status(400).send({ error: 'Fields are required' });
        }
    
        // SQL query to insert data
        const query =
          'UPDATE invitation_letter SET USERID=?, SENDERADDRESS=?, LETTER_DATE=?, RECEIVERNAME=?, EVENTTYPE=?, EVENTDATE=?, EVENTVENUE=?, SENDERNAME=? where USERID=? and LETTERID=?';
    
        // Execute the query
        const [result] = await pool.query(query, [
          userId,
          senderAddress,
          letterdate,
          receiverName,
          eventType,
          eventDate,
          eventVenue,
          senderName,
          userId,
          letterId,
        ]);
    
        // Send the generated LETTERID back to the frontend
        res.status(201).send({
          message: 'Data updated successfully',
        });
      } catch (error) {
        console.error('Error during registration:', error.stack);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });
    
  app.get('/get-invitation-letter', async (req, res) => {
      try {
        // Extract Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
        }
    
        // Decode Base64 and split userId and letterId
        const token = authHeader.split(' ')[1];
        const decodedToken = atob(token); // Decode Base64
        const [userIdPart, letterIdPart] = decodedToken.split(',');
    
        const userId = userIdPart.split(':')[1];
        const letterId = letterIdPart.split(':')[1];
    
        if (!userId || !letterId) {
          return res.status(400).send({ error: 'Invalid token format' });
        }
    
        // Query the database
        const query = 'SELECT * FROM invitation_letter WHERE USERID = ? AND LETTERID = ?';
        const [rows] = await pool.query(query, [userId, letterId]);
    
        if (rows.length === 0) {
          return res.status(404).send({ error: 'Letter not found' });
        }
    
        res.status(200).json(rows[0]);
      } catch (error) {
        console.error('Error fetching letter data:', error);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });
    


  app.post('/birthday_wish_letter',async (req, res) => {

      try{
      const{ senderAddress,letterdate,receiverName,senderName,userId}=req.body;
      if (!senderAddress || !letterdate || !receiverName||  !senderName || !userId) {
          return res.status(400).send({ error: 'Feilds are required' });
      }
      const query = 'INSERT INTO birthday_wish (USERID,SENDERADDRESS,LETTER_DATE,RECEIVERNAME,SENDERNAME) VALUES (?, ?, ?, ?, ?)';
      const [result] = await pool.query(query, [userId,senderAddress,letterdate,receiverName,senderName]);
    
      res.status(201).send({
        message: 'Data added successfully',
        letterId: result.insertId, // `insertId` contains the auto-incremented ID
      });
  }
  catch (error) {
      console.error('Error during registration:', error.stack);
      res.status(500).send({ error: 'Internal Server Error' });
  } 
    });

    app.post('/update-birthday_wish_letter',async (req, res) => {

      try{
      const{ senderAddress,letterdate,receiverName,senderName,userId,birthdaysession}=req.body;
      if (!senderAddress || !letterdate || !receiverName||  !senderName || !userId || !birthdaysession) {
          return res.status(400).send({ error: 'Feilds are required' });
      }
      const query = 'UPDATE  birthday_wish SET USERID=?,SENDERADDRESS=?,LETTER_DATE=?,RECEIVERNAME=?,SENDERNAME=?  where USERID=? AND LETTERID=?';
      const [result] = await pool.query(query, [userId,senderAddress,letterdate,receiverName,senderName,userId,birthdaysession]);
    
      res.status(201).send({
        message: 'Data updated successfully',
      });
  }
  catch (error) {
      console.error('Error during registration:', error.stack);
      res.status(500).send({ error: 'Internal Server Error' });
  } 
    });

    app.get('/get-birthday-letter', async(req, res) => {
      try {
        // Extract Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
        }
    
        // Decode Base64 and split userId and letterId
        const token = authHeader.split(' ')[1];
        const decodedToken = atob(token); // Decode Base64
        const [userIdPart, letterIdPart] = decodedToken.split(',');
    
        const userId = userIdPart.split(':')[1];
        const letterId = letterIdPart.split(':')[1];
    
        if (!userId || !letterId) {
          return res.status(400).send({ error: 'Invalid token format' });
        }
    
        // Query the database
        const query = 'SELECT * FROM birthday_wish WHERE USERID = ? AND LETTERID = ?';
        const [rows] = await pool.query(query, [userId, letterId]);
    
        if (rows.length === 0) {
          return res.status(404).send({ error: 'Letter not found' });
        }
    
        res.status(200).json(rows[0]);
      } catch (error) {
          console.error('Error fetching letter data:', error.stack);
          res.status(500).send({ error: 'Internal Server Error' });
      }
  });


  app.post('/congratulations_letter',async (req, res) => {

      try{
      const{ senderAddress,letterdate,receiverName,reason,senderName,userId}=req.body;
      if (!senderAddress || !letterdate || !receiverName||!reason || !senderName || !userId) {
          return res.status(400).send({ error: 'Feilds are required' });
      }
      const query = 'INSERT INTO congratulations_letter (USERID,SENDERADDRESS,LETTER_DATE,RECEIVERNAME,REASON,SENDERNAME) VALUES (?, ?, ?, ?, ?, ?)';
      const [result] = await pool.query(query, [userId,senderAddress,letterdate,receiverName,reason,senderName]);

      res.status(201).send({ message: 'Data added successfully',
        letterId: result.insertId,});
  }
  catch (error) {
      console.error('Error during registration:', error.stack);
      res.status(500).send({ error: 'Internal Server Error' });
  }
      
    });
    app.post('/update-congratulation_letter',async (req, res) => {

      try{
      const{ senderAddress,letterdate,receiverName,reason,senderName,userId,letterId}=req.body;
      if (!senderAddress || !letterdate || !receiverName||!reason || !senderName || !userId || !letterId) {
          return res.status(400).send({ error: 'Feilds are required' });
      }
      const query = 'UPDATE  congratulations_letter SET USERID=?,SENDERADDRESS=?,LETTER_DATE=?,RECEIVERNAME=?,REASON=?,SENDERNAME=?  where USERID=? AND LETTERID=?';
      const [result] = await pool.query(query, [userId,senderAddress,letterdate,receiverName,reason,senderName,userId,letterId]);
    
      res.status(201).send({
        message: 'Data updated successfully',
      });
  }
  catch (error) {
      console.error('Error during registration:', error.stack);
      res.status(500).send({ error: 'Internal Server Error' });
  } 
    });


    app.get('/get-congratulations-letter', async (req, res) => {
      try {
          // Extract Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
        }
    
        // Decode Base64 and split userId and letterId
        const token = authHeader.split(' ')[1];
        const decodedToken = atob(token); // Decode Base64
        const [userIdPart, letterIdPart] = decodedToken.split(',');
    
        const userId = userIdPart.split(':')[1];
        const letterId = letterIdPart.split(':')[1];
    
        if (!userId || !letterId) {
          return res.status(400).send({ error: 'Invalid token format' });
        }

          const query = 'SELECT * FROM congratulations_letter WHERE USERID = ? AND LETTERID = ?';
          const [results] = await pool.query(query, [userId,letterId]);

          if (results.length === 0) {
              return res.status(404).send({ error: 'congratulations letter not found' });
          }

          res.status(200).send(results[0]); // Send the first letter data
      } catch (error) {
          console.error('Error fetching letter data:', error.stack);
          res.status(500).send({ error: 'Internal Server Error' });
      }
  });

  // Endpoint to create a new leave letter
  app.post('/leave_letter', async (req, res) => {
    try {
      const {
        senderAddress,
        letterDate,
        recipientName,
        recipientDesignation,
        organizationName,
        organizationAddress,
        startDate,
        endDate,
        reason,
        senderName,
        contactDetails,
        userId,
      } = req.body;

      // Check for required fields
      if (
        !senderAddress ||
        !letterDate ||
        !recipientName ||
        !recipientDesignation ||
        !organizationName ||
        !organizationAddress ||
        !startDate ||
        !endDate ||
        !reason ||
        !senderName ||
        !contactDetails ||
        !userId
      ) {
        return res.status(400).send({ error: 'Fields are required' });
      }

      // SQL query to insert data
      const query =
        'INSERT INTO leave_letter (USERID, SENDERADDRESS, LETTER_DATE, RECIPIENTNAME, RECIPIENTDESIGNATION, ORGANIZATIONNAME, ORGANIZATIONADDRESS, STARTDATE, ENDDATE, REASON, SENDERNAME, CONTACTDETAILS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      // Execute the query
      const [result] = await pool.query(query, [
        userId,
        senderAddress,
        letterDate,
        recipientName,
        recipientDesignation,
        organizationName,
        organizationAddress,
        startDate,
        endDate,
        reason,
        senderName,
        contactDetails,
      ]);

      // Send the generated LETTERID back to the frontend
      res.status(201).send({
        message: 'Data added successfully',
        letterId: result.insertId, // `insertId` contains the auto-incremented ID
      });
    } catch (error) {
      console.error('Error during leave letter creation:', error.stack);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Endpoint to update an existing leave letter
  app.post('/update-leave_letter', async (req, res) => {
    try {
      const {
        senderAddress,
        letterDate,
        recipientName,
        recipientDesignation,
        organizationName,
        organizationAddress,
        startDate,
        endDate,
        reason,
        senderName,
        contactDetails,
        userId,
        letterId,
      } = req.body;
    
      // Check for required fields
      if (
        !senderAddress ||
        !letterDate ||
        !recipientName ||
        !recipientDesignation ||
        !organizationName ||
        !organizationAddress ||
        !startDate ||
        !endDate ||
        !reason ||
        !senderName ||
        !contactDetails ||
        !userId ||
        !letterId
      ) {
        return res.status(400).send({ error: 'Fields are required' });
      }

      // SQL query to update data
      const query =
        'UPDATE leave_letter SET SENDERADDRESS=?, LETTER_DATE=?, RECIPIENTNAME=?, RECIPIENTDESIGNATION=?, ORGANIZATIONNAME=?, ORGANIZATIONADDRESS=?, STARTDATE=?, ENDDATE=?, REASON=?, SENDERNAME=?, CONTACTDETAILS=? WHERE USERID=? AND LETTERID=?';

      // Execute the query
      const [result] = await pool.query(query, [
        senderAddress,
        letterDate,
        recipientName,
        recipientDesignation,
        organizationName,
        organizationAddress,
        startDate,
        endDate,
        reason,
        senderName,
        contactDetails,
        userId,
        letterId,
      ]);

      // Respond with success
      res.status(200).send({
        message: 'Data updated successfully',
      });
    } catch (error) {
      console.error('Error during leave letter update:', error.stack);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

  app.get('/get-leave-letter', async (req, res) => {
    try {
      // Extract Authorization header
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
      }

      // Decode Base64 and split userId and letterId
      const token = authHeader.split(' ')[1];
      const decodedToken = Buffer.from(token, 'base64').toString('utf8'); // Decode Base64
      const [userIdPart, letterIdPart] = decodedToken.split(',');

      const userId = userIdPart.split(':')[1];
      const letterId = letterIdPart.split(':')[1];

      if (!userId || !letterId) {
        return res.status(400).send({ error: 'Invalid token format' });
      }

      // Query the database for leave letter
      const query = 'SELECT * FROM leave_letter WHERE USERID = ? AND LETTERID = ?';
      const [rows] = await pool.query(query, [userId, letterId]);

      if (rows.length === 0) {
        return res.status(404).send({ error: 'Letter not found' });
      }

      // Return the leave letter data
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching leave letter data:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });
  app.get('/get-letter-counts', async (req, res) => {
    try {
      const query = `
        SELECT 
          letter_type,
          COUNT(*) AS count
        FROM (
          SELECT 'invitation_letter' AS letter_type FROM invitation_letter
          UNION ALL
          SELECT 'birthday_wish' AS letter_type FROM birthday_wish
          UNION ALL
          SELECT 'congratulations_letter' AS letter_type FROM congratulations_letter
          UNION ALL
          SELECT 'leave_letter' AS letter_type FROM leave_letter
        ) AS all_letters
        GROUP BY letter_type;
      `;

      const [results] = await pool.query(query);

      // Organize counts into an object for easier access
      const counts = {
        invitation_count: 0,
        birthday_wish_count: 0,
        congratulations_count: 0,
        leave_letter_count: 0,
        total_letters: 0
      };

      results.forEach(row => {
        if (row.letter_type === 'invitation_letter') {
          counts.invitation_count = row.count;
        } else if (row.letter_type === 'birthday_wish') {
          counts.birthday_wish_count = row.count;
        } else if (row.letter_type === 'congratulations_letter') {
          counts.congratulations_count = row.count;
        } else if (row.letter_type === 'leave_letter') {
          counts.leave_letter_count = row.count;
        }
      });

      // Calculate the total count
      counts.total_letters = counts.invitation_count + counts.birthday_wish_count + 
                            counts.congratulations_count + counts.leave_letter_count;

      // Send the counts as JSON
      res.json(counts);
    } catch (error) {
      console.error('Error fetching letter counts:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });
  app.get('/users', async (req, res) => {
    try {
        console.log('Fetching users...');
        const [results] = await pool.query('SELECT USERNAME FROM USER_DETAILS'); // No .promise() needed
        console.log('Results:', results);
        res.json(results);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});


app.get('/user/:USERNAME', async (req, res) => {
  const username = req.params.USERNAME;

  try {
    // Fetch user details by USERNAME
    const [userResults] = await pool.execute('SELECT * FROM USER_DETAILS WHERE USERNAME = ?', [username]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResults[0].USERID; // Retrieve USERID from the user details

    // Fetch letter counts for the user
    const [letterCounts] = await pool.execute(`
      SELECT
        (SELECT COUNT(*) FROM invitation_letter WHERE USERID = ?) AS invitation_count,
        (SELECT COUNT(*) FROM birthday_wish WHERE USERID = ?) AS birthday_count,
        (SELECT COUNT(*) FROM congratulations_letter WHERE USERID = ?) AS congratulations_count,
        (SELECT COUNT(*) FROM leave_letter WHERE USERID = ?) AS leave_count,
        (
          (SELECT COUNT(*) FROM invitation_letter WHERE USERID = ?) +
          (SELECT COUNT(*) FROM birthday_wish WHERE USERID = ?) +
          (SELECT COUNT(*) FROM congratulations_letter WHERE USERID = ?) +
          (SELECT COUNT(*) FROM leave_letter WHERE USERID = ?)
        ) AS total_count;
    `, [userId, userId, userId, userId, userId, userId, userId, userId]);
    
    
    const letterData = letterCounts[0];
    console.log(`Letter counts for user ${userId}:`, letterData);

    const userData = userResults[0];


    res.json({
      user: userData,
      letter_counts: letterCounts
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/letters/total', async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT COUNT(*) AS Total_Letters
      FROM (
        SELECT LETTERID FROM invitation_letter
        UNION ALL
        SELECT LETTERID FROM birthday_wish
        UNION ALL
        SELECT LETTERID FROM congratulations_letter
        UNION ALL
        SELECT LETTERID FROM leave_letter
      ) AS all_letters
    `);

    // Return the count of all letters as a response
    res.json({
      total_letters: results[0].Total_Letters
    });
  } catch (err) {
    console.error('Error fetching total letter count:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assuming you're using Express and have a MySQL pool connection setup
app.get('/user-history', async (req, res) => {
  const userId = req.query.userId;  // Retrieve the user ID from the query parameter

  if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
  }

  try {
      // Query to get letter history for the user
      const query = `
          SELECT 
              ll.LETTER_TYPE,
              ll.OPERATION_DATE,
              u.USERNAME
          FROM 
              letter_logs ll
          JOIN 
              USER_DETAILS u ON ll.USERID = u.USERID  -- Correct table name here
          WHERE 
              ll.USERID = ?  -- Use the user ID from the query parameter
          ORDER BY 
              ll.OPERATION_DATE DESC;
      `;

      const [results] = await pool.execute(query, [userId]);
      res.json(results);  // Return the user's letter history
  } catch (err) {
      console.error('Error fetching letter history:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});




  app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Ensure the username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Query to get admin by username
        const [rows] = await pool.execute('SELECT * FROM admin_details WHERE ADMINNAME = ?', [username]);
        
        console.log('Database query result:', rows);  // Log the result of the query

        if (rows.length === 0) {
            console.log('Admin not found');
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const admin = rows[0];

        // Direct password comparison (without bcrypt)
        if (password !== admin.ADMINPASSWORD) {
            console.log('Password mismatch');
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Successful login
        console.log('Login successful');
        res.json({ message: 'Login successful', adminId: admin.ADMINID });
    } catch (error) {
        console.error('Error in /admin/login route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/letter-stats', async (req, res) => {
  try {
    // Execute the query and fetch results
    const [results] = await pool.execute(`
      SELECT DATE(OPERATION_DATE) AS generation_date, COUNT(*) AS total_letters
      FROM letter_logs
      GROUP BY generation_date
      ORDER BY generation_date;
    `);

    // Format the results for the frontend
    const labels = results.map(row => row.generation_date);
    const counts = results.map(row => row.total_letters);

    // Send the response as JSON
    res.json({ labels, counts });

    // Optionally log the results to check the query output
    console.log(results);
  } catch (err) {
    console.error('Error fetching letter stats:', err);
    res.status(500).send('Internal Server Error');
  }
});


  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });

