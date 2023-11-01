require("dotenv").config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require("body-parser");  
const path = require('path');
const axios = require('axios');

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
}).then(() => {
    console.log("Connected to MongoDB Server");
    const server = app.listen(port, () => {
        console.log(`Node.js App is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


app.get('/', (req, res) => {
    res.render('index', { session: req.session });
});

app.get('/adminuser', async (req, res) => {
    try {
        // Make an Axios request to fetch data from an API
        const response = await axios.get('http://localhost:3000/alluser'); // Replace with your API endpoint
        const data = response.data;

        // Render the EJS template and pass the fetched data to it
        res.render('adminuser', { data });
    } catch (error) {
        // Handle errors, e.g., data fetch failed
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.use(restaurantRoutes);
app.use(hostelRoutes);
app.use(userRoutes);
