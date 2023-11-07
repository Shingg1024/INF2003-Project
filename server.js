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
const reviewRoutes = require('./server/routes/reviewRoutes');
const bookingRoutes = require('./server/routes/bookingRoutes');

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
        res.redirect('/'); 
    });
});

app.get('/userStats', async (req, res) => {
    try {
        response = await axios.get('http://localhost:3000/user/alluser');
        data = response.data;

        res.render('userStats', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/hostelFull', async (req, res) => {
    try {
        response = await axios.get('http://localhost:3000/hostel/allhostels'); 
        data = response.data;

        res.render('hostelFull', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/restaurantFull', async (req, res) => {
    try {
        response = await axios.get('http://localhost:3000/restaurant/allrestaurants'); 
        data = response.data;

        res.render('restaurantFull', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/booking', async (req, res) => {
    try {
        id = req.session.user.user_id;
        response = await axios.get('http://localhost:3000/booking/getBooking/'  + id); 
        data = response.data;

        res.render('booking', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/review', async (req, res) => {
    try {
        id = req.session.user.user_id;
        response = await axios.get('http://localhost:3000/review/getReview/' + id); 
        data = response.data;

        res.render('review', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});


app.use(restaurantRoutes);
app.use(hostelRoutes);
app.use(userRoutes);
app.use(reviewRoutes);
app.use(bookingRoutes);

app.use((err, req, res, next) => {
    console.error(err); 
  
    if (res.headersSent) {
      return next(err); 
    }
  
    res.status(500).send('An internal server error occurred. Please refresh the page or restart the application.');
  
  });

const cleanUp = (eventType) => {
    server.close(() => {
        console.log('Server closing...');
        db.closePool(); // Close the connection pool and the SSH tunnel
        console.log('---Server closed---');
        process.exit(0); // Exit with success status
    });
};

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, cleanUp.bind(null, eventType));
})
