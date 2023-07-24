const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Gender } = require('../../configs/global')

const schema = new Schema(
    {
        email: {
            type: String, trim: true, default: null,
        },
        phoneNumber: {
            type: String, required: true, trim: true,
        },
        password: {
            type: String, required: true, trim: true,
        },
        role: { 
            type: Number, required: true, trim: true,
        },
        firstname: {
            type: String, trim: true, default: null,
        },
        lastname: {
            type: String, trim: true, default: null,
        },
        gender: {
            type: Number, trim: true, default: Gender.OTHER,
        },
        address: { 
            type: [{
                type: String,
                trim: true,
                required: true,
            }], trim: true, default: null,
            // ["Duong QT", "0123456789", "Ha Noi", "HBT", "Dong Tam", "357 Vong"]
        }
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', schema);

class UserDTO {
    _id;
    email;
    phoneNumber;
    firstname;
    lastname;
    gender;
    address;
    createdAt;
    updatedAt;

    constructor (user){
        this._id = user._id;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.gender = user.gender;
        this.address = user.address;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    };
}

module.exports = { User, UserDTO };