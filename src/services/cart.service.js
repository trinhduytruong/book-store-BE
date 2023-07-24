const Cart = require('../app/models/cart.model');

class CartService{
    
    // getAll = async(userID) => {
    
    //     const items = await Cart.find({userID: userID}).sort({createdAt: -1});
    //     return items;

    // }

    getAll = async(userID, isChecked = false) => {
        let items;
        if(isChecked)
            items = await Cart.find({userID: userID, isChecked: true}).sort({createdAt: -1});
        else items = await Cart.find({userID: userID}).sort({createdAt: -1});
        return items;

    }

    findById = async(itemID) => {
        const item = await Cart.findById(itemID);
        return item ? item.toObject() : item;
    }

    findExistedTitle = async(userID, titleID) => {
        const cItem = await Cart.findOne({userID: userID, titleID: titleID});
        return cItem ? cItem.toObject() : cItem;
    }

    delete = async(itemID) => {

        const item = await Cart.findOneAndDelete({_id: itemID});
        return  item ? item.toObject() : item;

    }

    deleteCheckedItems = async() => {

        const items = await Cart.deleteMany({isChecked: true});
        return  items;

    }

    create = async(item) => {

        const nItem = await Cart.create(item);
        return  nItem ? nItem.toObject() : nItem;
    }
    
    update = async(itemID, data) => {
        await Cart.findOneAndUpdate({_id: itemID}, data);
        const nCart = await Cart.findById(itemID);
        return nCart ? nCart.toObject() : nCart;

    }

    checkAll = async(userID, checked) => {
        const nCart = await Cart.updateMany({userID: userID}, {isChecked: checked});
        return nCart; //? nCart.toObject() : nCart;

    }
}

module.exports = new CartService;