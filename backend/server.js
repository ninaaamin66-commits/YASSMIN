// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5003;

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'frontend')));

// database
const db = require('./db');

// routes
const adminProducts = require('./routes/products');
const productspub = require('./routes/productspub');
const ordersRouter = require('./routes/orders');

app.use('/admin/products', adminProducts);
app.use('/api/products', productspub);
app.use('/orders', ordersRouter);

// wilayas
app.get('/api/wilayas', (req, res) => {
  db.query(
    `SELECT DISTINCT wilaya_code AS id,
     COALESCE(NULLIF(wilaya_name_ascii, ''), wilaya_name) AS name
     FROM algeria_cities
     ORDER BY name ASC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(rows);
    }
  );
});

// communes
app.get('/api/communes/:wilayaId', (req, res) => {
  const wid = req.params.wilayaId;
  db.query(
    `SELECT id,
     COALESCE(NULLIF(commune_name_ascii, ''), commune_name) AS name
     FROM algeria_cities
     WHERE wilaya_code = $1
     ORDER BY name ASC`,
    [wid],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(rows);
    }
  );
});

// default route → frontend
app.use(express.static(path.join(__dirname, 'frontend')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// start server
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
