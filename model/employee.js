const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    employee_name: {
        type: String,
        require: true
    },
    work_place: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('employee_details', EmployeeSchema, 'Employees')