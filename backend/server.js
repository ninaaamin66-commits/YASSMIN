const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5003;



app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port', PORT);
});



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = require('./db'); 


// routes
const adminProducts = require('./routes/products');
const productspub = require('./routes/productspub');

const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);

app.use('/admin/products', adminProducts);
app.use('/api/products', productspub);
app.use('/products', productspub);
app.use('/productspub', productspub);

app.get('/', (req, res) => res.send('API running'));

app.get('/api/wilayas', (req, res) => {
  db.query(
    `SELECT DISTINCT wilaya_code AS id, COALESCE(NULLIF(wilaya_name_ascii, ''), wilaya_name) AS name
     FROM algeria_cities
     ORDER BY name ASC`,
    (err, rows) => {
      if (err) {
        console.error('Error /api/wilayas', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(rows);
    }
  );
});


app.get('/api/communes/:wilayaId', (req, res) => {
  const wid = req.params.wilayaId;
  db.query(
    `SELECT id, COALESCE(NULLIF(commune_name_ascii, ''), commune_name) AS name
     FROM algeria_cities
     WHERE wilaya_code = ?
     ORDER BY name ASC`,
    [wid],
    (err, rows) => {
      if (err) {
        console.error('Error /api/communes/:wilayaId', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(rows);
    }
  );
});
app.get('/', (req, res) => res.send('API running'));


app.listen(5003, '0.0.0.0', () => {
  console.log('Server running on port 5003');
});

