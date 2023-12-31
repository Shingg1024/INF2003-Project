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
const port = 3001;
const localhostLink = `http://localhost:${port}`;

// Log requests
//app.use(morgan('tiny'));

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
// app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
// app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

app.use('/assets', express.static('assets', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    },
}));

// Define routes
const restaurantRoutes = require('./server/routes/restaurantRoutes');
const hostelRoutes = require('./server/routes/hostelRoutes');
const userRoutes = require('./server/routes/userRoutes');
const reviewRoutes = require('./server/routes/reviewRoutes');
const bookingRoutes = require('./server/routes/bookingRoutes');

app.use(express.json());

const server = app.listen(port, () => {
    console.log(`Node.js App is running on port ${port}`);
    console.log(`Link to the server here: ${localhostLink}`);
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
        response = await axios.get('http://localhost:3001/user/alluser');
        data = response.data;

        res.render('userStats', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/hostelFull', async (req, res) => {
    try {
        response = await axios.get('http://localhost:3001/hostel/allhostels');
        data = response.data;

        res.render('hostelFull', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});


app.get('/hostels', async (req, res) => {
    try {
        response = await axios.get('http://localhost:3001/hostel/allhostelsSQL');
        data = response.data;

        res.render('hostel', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/indivHostel/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`http://localhost:3001/hostel/hos/${id}`);
        const data = response.data;

        res.render('indivHostel', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});


app.get('/restaurantFull', async (req, res) => {
    try {
        response = await axios.get('http://localhost:3001/restaurant/allrestaurants');
        data = response.data;

        res.render('restaurantFull', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/restaurants', async (req, res) => {
    try {
        response = await axios.get('http://localhost:3001/restaurant/allrestaurantSQL');
        data = response.data;

        res.render('restaurants', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/indivRestaurant/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`http://localhost:3001/restaurant/res/${id}`);
        const data = response.data;

        res.render('indivRestaurant', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});


app.get('/booking', async (req, res) => {
    try {
        id = req.session.user.user_id;
        response = await axios.get('http://localhost:3001/booking/getBooking/' + id);
        data = response.data;

        res.render('booking', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/review', async (req, res) => {
    try {
        id = req.session.user.user_id;
        response = await axios.get('http://localhost:3001/review/getReview/' + id);
        data = response.data;

        res.render('review', { data });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/aboutus', async (req, res) => {
    res.render('aboutus');
});

app.get('/search', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    const params = [`%${searchTerm}%`];

    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const queryHostel = "SELECT * FROM hostel WHERE hostel_name LIKE ?";
        connection.query(queryHostel, params, (err, hostelResults) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }
                
                const queryRestaurant = "SELECT * FROM restaurant WHERE restaurant_name LIKE ?";
                connection.query(queryRestaurant, params, (err, restaurantResults) => {
                    try {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: 'An error occurred' });
                        }

                        const dataObj = {
                            hostels: hostelResults,
                            restaurants: restaurantResults
                        };

                        console.log("------------- SQL query for hostels: " + queryHostel + " -------------");
                        console.log("------------- SQL query for restaurants: " + queryRestaurant + " -------------");

                        res.render('search', { data: dataObj });
                    } finally {
                        db.releaseConnection(connection);
                    }
                });
            } finally {
                db.releaseConnection(connection);
            }
        });
    });
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
        db.closePool(); 
        console.log('---Server closed---');
        process.exit(0); 
    });
};

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, cleanUp.bind(null, eventType));
})
