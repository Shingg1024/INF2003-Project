require("dotenv").config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const path = require('path');
const axios = require('axios');
const db = require('./server/dataset/db'); // Import your database connection

const app = express();
const port = 3000;

// Log requests
app.use(morgan('tiny'));

// Parse request to body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

// Configure Session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Load assets
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

// Define routes
const restaurantRoutes = require('./server/routes/restaurantRoutes');
const hostelRoutes = require('./server/routes/hostelRoutes');
const userRoutes = require('./server/routes/userRoutes');

app.use(express.json());

// Connect to the MongoDB Server
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB Server");
        const server = app.listen(port, () => {
            console.log(`Node.js App is running on port ${port}`);
        });

        process.on('SIGUSR2', () => {
            console.log('Received SIGUSR2. Closing server...');
            server.close(() => {
                // Perform cleanup tasks here
                console.log('Server closed. Cleaning up...');

                // Close database connections
                db.closePool((err) => {
                    if (err) {
                        console.error('Error closing database connections:', err);
                    } else {
                        console.log('Database connections closed.');
                    }

                    // Exit the process
                    process.exit(0);
                });
            });
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/test', async (req, res) => {
    try {
        // Make an Axios request to fetch data from an API
        const response = await axios.get('http://localhost:3000/alluser'); // Replace with your API endpoint
        const data = response.data;

        // Render the EJS template and pass the fetched data to it
        res.render('test', { data });
    } catch (error) {
        // Handle errors, e.g., data fetch failed
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.use(restaurantRoutes);
app.use(hostelRoutes);
app.use(userRoutes);
