const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Customers',CustomerSchema, 'customers')