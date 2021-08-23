const mongoose = require('mongoose');
const { nanoid } = require('nanoid')

const Schema = mongoose.Schema;

const shortURLSchema = new Schema({
    shortURL: {
        type: String,
        required: true,
        default: nanoid(6)
    },
    longURL: {
        type: String,
        required: true
    },
    uses: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ShortURL', shortURLSchema);