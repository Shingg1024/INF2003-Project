require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const port = 3000;

// Log requests
app.use(morgan('tiny'));

// Parse request to body-parser
app.use(bodyParser.urlencoded({ extended: true}));

// Set view engine
app.set('view engine', 'ejs');

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
        app.listen(port, () => {
            console.log(`Node.js App is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

app.get('/', (req, res) => {
    res.render('index')
});

app.use(restaurantRoutes);
app.use(hostelRoutes);
app.use(userRoutes);
