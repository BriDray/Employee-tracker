const db = require("./db/connection");
const express = require("express");
const startInquirer = require("./lib/index");
const PORT = process.env.PORT || 3001;
const app = express();

// EXPRESS
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// DEFAULT RESPONSE 
app.use((_req, res) => {
  res.status(404).end();
});

// START SERVER AFTER DB CONNECTION
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startInquirer();
  });
});