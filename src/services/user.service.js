const {User, UserDTO} = require('../app/models/user.model');

class UserService{
    
    getAll = async(query) => {
    
        const users = await User.find(query);
        for (let i in users)
            users[i] = new UserDTO(users[i]);
        
        return users;

    }

    update = async(userID, data) => {

        await User.findOneAndUpdate({_id: userID}, data);
        const nUser = await User.findById(userID);

        return nUser ? new UserDTO(nUser) : nUser;

    }

    create = async(data) => {

        const nUser = await User.create(data);

        return nUser ? nUser.toObject() : nUser;

    }

    checkEmail = async(param) => {

        return await User.exists({email: param});
    }

    checkPhoneNumber = async(param) => {

        return await User.exists({phoneNumber: param});
    }

    // dont need dto
    findByPhoneNumber = async(phoneNumber) => {

        const user = await User.findOne({phoneNumber: phoneNumber});

        return user ? user.toObject() : user;

    }

    findById = async(userID, dto = true, filter = []) => {
        const fields = filter.join(' ');
        const user = await User.findById(userID).select(fields);
        
        return user ? (dto ? new UserDTO(user) : user.toObject()) : user;

    }

    
}

module.exports = new UserService;