const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId, required: true, trim: true, ref: 'User',
        },
        titleID: {
            type: Schema.Types.ObjectId, required: true, trim: true, ref: 'Title',
        },
        count: {
            type: Number, default: 1,
        },
        isChecked: {
            type: Boolean, default: false,
        }
    },
    {
        timestamps: true,
    },
);

const Cart = mongoose.model('Cart', schema);

module.exports = Cart;