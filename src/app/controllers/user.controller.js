const userService = require('../../services/user.service');
const Util = require('../../utils/util');
const bcrypt = require('bcrypt');
const { UserDTO } = require('../models/user.model');
const { Role } = require('../../configs/global')
// const redis = require('../../configs/db/redis')

class UserController {
    
    /** POST /user/login */ 
    login = async (req, res) => {

        try{
            const body = req.body;

            const user = await userService.findByPhoneNumber(body.phoneNumber);
            if(!user) return res.status(401).json({message: 'phone number does not exist'});

            const validPwd = await bcrypt.compare(body.password, user.password);
            if(!validPwd) return res.status(401).json({message: 'wrong password'});

            const accessToken = Util.generateAccessToken(user);
            // const refreshToken = Util.generateRefreshToken(user);

            // Util.setCookie(res, 'refreshToken', refreshToken);

            // redis.set(user._id, refreshToken, 'EX', 30*24*60*60, (err, reply) => {
            //   if (err) throw err;
            //   console.log(reply);
            // });

            return res.json({user: new UserDTO(user), accessToken});

        }catch (err){
            return Util.throwError(res, err);
        }

    }

    /** POST /user/create */
    create = async (req, res) => {

        try{
            const body = req.body;
        
            const phoneNumberCheck = await userService.checkPhoneNumber(body.phoneNumber);
            if(phoneNumberCheck)
                return res.status(409).json({message: 'phone number existed'});

            const hashedPwd = await Util.hashPwd(body.password);
            
            const user = await userService.create({
                phoneNumber: body.phoneNumber,
                password: hashedPwd,
                role: Role.USER,
            });

            if(!user) return res.status(500).json({message: 'cannot create user'});
            
            // login after register
            const accessToken = Util.generateAccessToken(user);
            // const refreshToken = Util.generateRefreshToken(user);

            // Util.setCookie(res, 'refreshToken', refreshToken);

            // redis.set(user._id, refreshToken, 'EX', 30*24*60*60, (err, reply) => {
            //   if (err) throw err;
            //   console.log(reply);
            // });


            return res.json({user: new UserDTO(user), accessToken});
        }catch(err){
            return Util.throwError(res, err);
        }
        

    }

    /** GET /user/profile */
    getProfile = async (req, res) => {
        try {
            const filter = req.query.f ?? '';
            const userID = req.user._id;

            const user = await userService.findById(userID, true, filter.split(';'));

            return res.json(user);

        }catch(err){
            return Util.throwError(res, err);
        }
        
    }

    // /** POST /account/change-password */
    updatePassword = async (req, res) => {

        try {
            const body = req.body;
            const userID = req.user._id;

            const user = await userService.findById(userID, false);
            
            const [oPwd, nPwd] = [body.oldPassword, body.newPassword];
           
            const validPwd = await bcrypt.compare(oPwd, user.password);
            if(!validPwd) return res.status(404).json({message: 'wrong old password'});

            user.password = await Util.hashPwd(nPwd); 
            const nUser = await userService.update(user._id, user);

            return res.json(new UserDTO(nUser));

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    /** POST /account/update-profile */
    updateProfile = async(req, res) => {

        try {
            const body = req.body;
            delete body.password; delete body.role; delete body._id;
            const userID = req.user._id;

            const phoneNumberCheck = await userService.checkPhoneNumber(body.phoneNumber);
            if(phoneNumberCheck)
                return res.status(409).json({message: 'phone number existed'});

            if(body.gender) body.gender = Util.formatGender(body.gender);
            
            const user = await userService.update(userID, body);

            return res.json(new UserDTO(user));

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    /** GET /account/logout */
    logout(req, res){

        try {
            // const userID = req.user._id;

            // res.clearCookie('refreshToken');

            // redis.del(userID, (err, reply) => {
            //     if(err) throw err;

            //     if(reply == 1)
            //         console.log('refreshToken has been deleted');
            //     else console.log('key does not exist');
            // })

            return res.json({message: 'log out successfully'});

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    /** GET /account/get-all-users */
    getAllUsers = async (req, res) => {
        try {
            const user = await userService.getAll({role: Role.USER});
            return res.json(user);

        }catch(err){
            return Util.throwError(res, err);
        }
        
    }

//     /** GET /account/lock-user */
//     lockUser = async (req, res) =>{

//         try{
//             const [userId, userStt] = [req.query.id, req.query.stt ?? true];

//             const userAcc = await accountService.findById(userId);
//             if(userAcc.role !== Role.USER) 
//                 return res.status(403).json('You are not allowed');

//             userAcc.isLock = userStt;
//             const account = await accountService.update(userAcc);

//             delete account.password; delete account.role;
            
//             return res.json(account);

//         }catch(err){
//             console.log(err);
//             return res.status(400).json({error: err.message});
//         }
        
//     };

}

module.exports = new UserController;