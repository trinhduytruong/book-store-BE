const mongoose = require('mongoose');
const { BookStatus } = require('../../configs/global');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        titleID: {
            type: Schema.Types.ObjectId, required: true, trim: true, ref: 'Title'
        },
        status: {
            type: Number, required: true, trim: true, default: BookStatus.AVAILABLE,
        }
    },
    {
        timestamps: true,
    },
);

const Book = mongoose.model('Book', schema);

module.exports = Book;