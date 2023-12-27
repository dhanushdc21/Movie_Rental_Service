const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    rent_date: {
        type: Date,
        required: true
    },
    return_date: {
        type: Date,
        required: true
    },
    movies: [
        {
            title: {
                type: String,
                required: true
            },
            year: {
                type: String
            }
        }
    ],
});

module.exports = mongoose.model('order',orderSchema)
