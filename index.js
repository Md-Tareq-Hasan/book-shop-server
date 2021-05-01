const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 7000;

app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c7nzy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const booksCollection = client.db("bookshop").collection("books");
    const ordersCollection = client.db("bookshop").collection("ordersCollection");

    console.log("database connected");

    app.get('/books', (req, res) => {
        booksCollection.find({})
            .toArray((err, items) => {
                res.send(items);
            })

    })
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        booksCollection.insertOne(newEvent)
            .then(result => {
                console.log(result.insertedCount);
            })
        console.log('newEvent', newEvent);
    })

    app.get('/books/:id', (req, res) => {
        booksCollection.find({ _id: ObjectId(req.params.id) })

            .toArray((err, documents) => {
                res.send(documents)
            })
        console.log(booksCollection)
    })

    app.post('/addOrder', (req, res) => {
        const orders = req.body;
        console.log(orders);
        ordersCollection.insertOne(orders)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        booksCollection.deleteOne({ _id: id })
            .then(result => {
                console.log(result);
            })
    })

    app.get('/oderBook', (req, res) => {
        ordersCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(items);
            })

    })

});


app.get('/', (req, res) => {
    res.send("<h1>This Is Working</h1>")
})

app.listen(port)