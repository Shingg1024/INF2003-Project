require("dotenv").config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const path = require('path');
const axios = require('axios');
const db = require('./server/dataset/db')

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

const server = app.listen(port, () => {
    console.log(`Node.js App is running on port ${port}`);
});

// Connect to the MongoDB Server
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Server");
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

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/edit', (req, res) => {
    res.render('edit');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/'); // Redirect to the login page or any other desired destination
    });
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

// Add an exit handler to ensure proper cleanup when the program ends
process.on('exit', () => {
    db.closePool(); // Close the connection pool and the SSH tunnel
});

// Additional exit signals to handle (SIGINT, SIGTERM)
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closing...');
        db.closePool(); // Close the connection pool and the SSH tunnel
        process.exit(0); // Exit with success status
    });
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closing...');
        db.closePool(); // Close the connection pool and the SSH tunnel
        process.exit(0); // Exit with success status
    });
});