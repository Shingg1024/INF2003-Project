require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const restaurant = require('./models/restaurant');
const hostel = require('./models/hostel');

app.use(express.json());
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Nodejs App is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });

// Routes
app.get('/', (req, res) => {
    res.send("Hello");
});

app.post('/addrestaurant', (req, res) => {
    const test = new restaurant({
        name: req.body.name,
        japaneseName: req.body.japaneseName
        //  ...
    });
    test.save().then((result) => {
        res.send(result)
    })
        .catch((error) => {
            console.log(error);
        })
});

app.get('/restaurants', async (req, res) => {
    restaurant.find().then((result) => {
        res.send(result);
    }).catch((error) => {
        console.log(error);
    });
});

app.get('/restaurant', async (req, res) => {
    const name = req.query.name + '  ';
    console.log(name);
    restaurant.findOne({ Name: name }).then((result) => {
        res.send(result);
    }).catch((error) => {
        console.log(error);
    });
});


app.get('/hostel', async (req, res) => {
    hostel.find({ city: "Kyoto" })
        .then((result) => {
            res.send(result);
        }).catch((error) => {
            console.log(error);
        });
});