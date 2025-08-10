const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// MongoDB connection
// The connection string can be configured via environment variables in a real-world scenario.
const uri = "mongodb://localhost:27017/cdss-tcm";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
connection.on('error', (err) => {
    console.error("MongoDB connection error:", err);
    process.exit();
});


// A simple test route
app.get('/', (req, res) => {
  res.send('TCM Clinical Decision Support System Backend is running!');
});

// API Routes
const medicationRouter = require('./routes/medication.routes');
app.use('/api/medications', medicationRouter);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app; // for potential testing
