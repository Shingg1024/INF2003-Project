require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const restaurantRoutes = require('./routes/restaurantRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

//Connect to the MongoDB Server
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

// Routes
app.get('/', (req, res) => {
    res.send("Hello");
});

app.use(restaurantRoutes);
app.use(hostelRoutes);
app.use(userRoutes);
