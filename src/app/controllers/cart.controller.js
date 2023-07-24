const cartService = require('../../services/cart.service');
const titleService = require('../../services/title.service');
const Util = require('../../utils/util');

class CartController{

    getCart = async(req, res) => {

        try {
            const userID = req.user._id;
            const isChecked = req.query.isChecked
            const carts = await cartService.getAll(userID, isChecked == 'true' ? true : false);

            for (let i in carts){
                carts[i] = carts[i].toObject();
                const title = await titleService.findById(carts[i].titleID, true);
                carts[i]['title'] = {
                    _id: title._id,
                    name: title.name,
                    price: title.price,
                    image: title.image,
                    slug: title.slug,
                    quantity: title.quantity,
                    deletedAt: title.deletedAt,
                }
                delete carts[i].titleID;

                // re-check count of items and delete if out of stock
                if(title.quantity == 0){
                    await cartService.delete(carts[i]._id)
                    carts.slice(i, 1);
                }
                else if(carts[i].count > title.quantity) {
                    await cartService.update(carts[i]._id, {count: carts[i].count});
                    carts[i].count = title.quantity;
                }
                    
            }

            return res.json(carts);

        }catch(err) {
            return Util.throwError(res, err);
        } 

    }

    addToCart = async(req, res) => {

        try {
            let body = req.body;
            body.userID = req.user._id;
            let nItem;
            
            const title = await titleService.findById(body.titleID, false);
            if(!title) 
                return res.status(404).json({message: 'the title is not existed'});

            const item = await cartService.findExistedTitle(body.userID, body.titleID);

            let flag = false;
            if(item){
                body.count += item.count;
                if(item.isChecked === true) body.isChecked = true;
                flag = true;
            }
            
            // check count
            if(body.count > title.quantity)
                return res.status(400).json({message: `${body.count} items are not available`});
            
            if(flag) nItem = await cartService.update(item._id, body);
            else nItem = await cartService.create(body);  

            if(!nItem) return res.status(500).json({message: 'cannot add to cart'});
            return res.json(nItem);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    updateCart = async(req, res) => {

        try {
            const itemID = req.query.id;
            const body = req.body; delete body.titleID;
            const userID = req.user._id;
           
            const item = await cartService.findById(itemID);
            if(item.userID != userID) return res.status(400).json({message: 'you are not allowed'});

            if(body.count){
                const title = await titleService.findById(item.titleID, true);
                if(!title) 
                    return res.status(400).json({message: 'the title is not existed'});

                // check count
                if(body.count > title.quantity)
                    return res.status(400).json({message: `${body.count} items are not available`});
            }

            const nItem = await cartService.update(itemID, body);

            if(!nItem) return res.status(500).json({message: 'update failed'});

            return res.json(nItem);
        }catch(err){
            return Util.throwError(res, err);
        }

    }

    checkAll = async(req, res) => {

        try {
            const checked = req.query.checked ?? false;
            const userID = req.user._id;

            const nCart = await cartService.checkAll(userID, checked == 'true' ? true : false);

            if(!nCart) return res.status(500).json({message: 'update failed'});

            return res.json(nCart);
        }catch(err){
            return Util.throwError(res, err);
        }

    }

    deleteFromCart = async(req, res) => {

        try {
            const itemID = req.query.id;
            const userID = req.user._id;

            const item = await cartService.findById(itemID);

            if(item.userID != userID) return res.status(400).json({message: 'you are not allowed'});

            const deletedItem = await cartService.delete(itemID);

            if(!deletedItem) return res.status(500).json({message: 'delete failed'});

            return res.json({message: 'delete successfully'});

        }catch(err){
            return Util.throwError(res, err);
        }
        
    }

}

module.exports = new CartController;