const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, BCRYPT_SALT} = require('../configs/config');
const {Gender, BookStatus} = require('../configs/global');

class Util {

    generateAccessToken = (data) => {
        return jwt.sign({
            _id: data._id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            name: data.name,
            role: data.role,
        }, ACCESS_SECRET_KEY, { expiresIn: '3d' });
    }

    generateRefreshToken = (data) => {
        return jwt.sign({
            _id: data._id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            name: data.name,
            role: data.role,
        }, REFRESH_SECRET_KEY, { expiresIn: 30*24*60*60 });
    }

    setCookie = (res, cookieName, cookieData) => {
        res.cookie(cookieName, cookieData, {
            httpOnly: false, // fix later
             secure: false, // true if in deployment env
            path: '/',
            sameSite: 'strict',
        });
    }

    formatGender = (gender) => {
        if(gender == Gender.MALE) 
            return Gender.MALE;
        else if(gender == Gender.FEMALE) 
            return Gender.FEMALE;
        else return Gender.OTHER;
    }

    formatStatus = (res, status) => {
        if(status == BookStatus.AVAILABLE)
            return BookStatus.AVAILABLE;
        else if(status == BookStatus.SOLD)
            return BookStatus.SOLD;
        else if(status == BookStatus.PENDING)
            return BookStatus.PENDING;
        else return res.status(400).json({message: 'config failed'});
    }

    removeVietnameseTones = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }

    hashPwd = async (pwd) => {
        const salt = await bcrypt.genSalt(BCRYPT_SALT);
        return await bcrypt.hash(pwd, salt);
    }

    throwError = (res, err) => {
        console.log(err);
        return res.status(400).json({error: err.message});
    }

}

module.exports = new Util; 