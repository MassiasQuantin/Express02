const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my_database'
};

const dbConnection = mysql.createConnection(dbConfig);

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id:', dbConnection.threadId);
});

app.get('/api/users', (req, res) => {
  dbConnection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error');
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  dbConnection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error');
      return;
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send('Not Found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  dbConnection.end(() => {
    console.log('MySQL connection closed.');
    process.exit(0);
  });
});
