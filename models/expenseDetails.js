var mongoose = require('mongoose');


//Set schema
var expenseSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    expense: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

let Expense = module.exports = mongoose.model('Expense', expenseSchema);