const express = require('express')
require('dotenv').config();
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const cors = require('cors');
app.use(cors());

const port = 3001


//console.log(process.env.DB_USER , process.env.DB_PASS)

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqgfx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("Products");
  const orderCollection = client.db("emaJohnStore").collection("orders");
  const adminCollection = client.db("emaJohnStore").collection("Admin");
 
    app.post('/addProducts',(req,res)=>{
        const product = req.body;
        productsCollection.insertMany(product)
        .then(result=>{
            console.log(result);
        })
    })

    app.get('/products',(req,res)=>{
        productsCollection.find({})
        .toArray((err,document)=>{
            res.send(document);
        })
    })

    app.get('/product/:key',(req,res)=>{
        productsCollection.find({key: req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })

    app.post('/productsByKeys',(req,res)=>{
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys }})
        .toArray((err,document)=>{
            res.send(document);
        })
    })

    app.post('/addOrder',(req,res)=>{
        const order = req.body;
        orderCollection.insertOne(order)
        .then(result=>{
            res.send(result.insertedCount)
        })
    })

    
    app.get('/admins',(req,res)=>{
        adminCollection.find({})
        .toArray((err,document)=>{
            res.send(document);
        })
    })

});



app.listen(port)