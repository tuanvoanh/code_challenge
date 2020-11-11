const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PharmaSchema = new Schema({
    medicine: {
        type: String
    },
    quality: {
        type: Number
    }
})
PharmaSchema.index({medicine: 1}, {unique: true})

const Pharma = mongoose.model('Pharma', PharmaSchema)
module.exports = Pharma