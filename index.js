//http://localhost:9000/rental_system
const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/Movie_Rental_System'
const app = express()

const path = require('path');

// Configure express.static middleware
app.use(express.static(__dirname));

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log('Connected Successfully.')
})

app.use(express.json())   //To let the system know we are sending data as json.

const detailRouter = require('./routes/rental_system')
app.use('/rental_system',detailRouter)
app.use('/rental_system/getLoggedInUser', (req, res, next) => {
    res.status(500).send('Internal Server Error');
  });
app.listen(9000, () => {
    console.log('Server started.')
})