const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rec'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.get('/data', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3003; // Changed port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
