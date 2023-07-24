const Util = require('../../utils/util');
// const redis = require('../../configs/db/redis')

class SiteController{
    
    // refreshToken = async(req, res) => {
        
    //     try{
            
    //         const user = req.user

    //         const accessToken = Util.generateAccessToken(user);
    //         const refreshToken = Util.generateRefreshToken(user);

    //         Util.setCookie(res, 'refreshToken', refreshToken);

    //         redis.set(user._id, refreshToken, 'EX', 30*24*60*60, (err, reply) => {
    //           if (err) throw err;
    //           console.log(reply);
    //         });

    //         return res.json({accessToken, refreshToken});

    //     }catch(err){
    //         return Util.throwError(res, err);
    //     }
    // }

}

module.exports = new SiteController;