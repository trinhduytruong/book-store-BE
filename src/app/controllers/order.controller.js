const orderService = require('../../services/order.service');
const cartService = require('../../services/cart.service');
const userService = require('../../services/user.service');
const bookService = require('../../services/book.service');
const titleService = require('../../services/title.service');
const Util = require('../../utils/util');
const { OrderStatus, BookStatus } = require('../../configs/global');

class OrderController{
    
    getAllOrders = async(req, res) => {
        
        try {
            const userID = req.query.userID;
            const type = req.query.type ?? OrderStatus.ALL;
            console.log(+type)
            let allOrders = await orderService.getAll(userID, +type);

            for(let i in allOrders)
                allOrders[i] = await this.formatAdminOrder(allOrders[i]);

            return res.json(allOrders);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getAllMyOrders = async(req, res) => {
        
        try {
            const userID = req.user._id;
            const type = req.query.type ?? OrderStatus.ALL;
            const limit = req.query.limit

            console.log(type)
            let allOrders = await orderService.getMine(userID, type, limit);

            console.log(allOrders);

            for(let i in allOrders)
                allOrders[i] = await this.formatUserOrder(allOrders[i]);
            
            return res.json(allOrders);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getOrder = async(req, res) => {

        try {
            const orderID = req.params.id;

            let order = await orderService.findById(orderID);

            if(!order) return res.status(404).json({message: "not found"});

            // order = await this.formatOrder(order);

            return res.json(order);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getOrderForAdmin = async(req, res) => {

        try {
            const orderID = req.params.id;

            const order = await orderService.findById(orderID);

            if(!order) return res.status(404).json({message: "not found"});

            const bookIDList = await this.getBookIDListForAdmin(order);

            return res.json({order, bookIDList});

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    checkoutOrder = async(req, res) => {

        try{
            const body = req.body;
            const userID = req.user._id;
            let cOrder = {
                address: null,
                items: [],
                cartIDs: []
            };

            const user = await userService.findById(userID);

            if(user.address) cOrder.address = user.address;

            body.forEach(async item => {
                cOrder.cartIDs.push(item.cartID);
                delete item.cartID;
                cOrder.items.push(item);
            })

            return res.json(cOrder);
        }catch(err){
            return Util.throwError(res, err);
        }
    }

    createOrder = async(req, res) => {

        try{
            const body = req.body;
            body.userID = req.user._id;
         
            const titlesInfo = body.items;

            for(let i in titlesInfo){
                const title = await titleService.findById(titlesInfo[i].titleID, false);
                if(!title || title.quantity == 0 || titlesInfo[i].count > title.quantity)
                    return res.status(500).json({message: 'an error occurred, please try again'});
            }

            const deleteCheckedItems = await cartService.deleteCheckedItems()
            console.log(deleteCheckedItems);

            const order = await orderService.create(body);

            if(!order) return res.status(500).json({message: 'cannot create order'});

         
            
            return res.json(order);
        }catch(err){
            return Util.throwError(res, err);
        }
    }

    updateOrder = async(req, res) => {

        try{
            const body = req.body;
            const orderID = req.query.id;

            const order = await orderService.findById(orderID);
            if(!order) return res.status(404).json({message: 'not found'});

            const nOrder = await orderService.update(orderID, body);

            return res.json(nOrder);
            

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getNumberOfOrderTypes = async(req, res) => {
        
        try {
            const userID = req.user._id;

            let result = await orderService.getNumberOfOrderTypes(userID);

            return res.json(result);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    formatAdminOrder = async (order) => {
        
        const formattedOrder = {}
        formattedOrder['_id'] = order._id;
        formattedOrder['recipientInfo'] = order.recipientInfo;
        formattedOrder['finalPrice'] = order.finalPrice;
        formattedOrder['status'] = order.status;
        formattedOrder['createdAt'] = order.createdAt;
        
        return formattedOrder;
    }

    formatUserOrder = async (order) => {
        
        const formattedOrder = {}
        formattedOrder['_id'] = order._id;
        formattedOrder['recipientInfo'] = order.recipientInfo[0]??'';
        formattedOrder['finalPrice'] = order.finalPrice;
        formattedOrder['status'] = order.status;
        formattedOrder['createdAt'] = order.createdAt;
        
        return formattedOrder;
    }

    getBookIDListForAdmin = async (order) => {
        let bookIDList = {}
        for(let i=0 ; i<order.items.length ; i++){
            bookIDList[order.items[i].titleID] = [];
            const bookList = await bookService.getAll(order.items[i].titleID, BookStatus.AVAILABLE);
            bookList.forEach((e) => 
                bookIDList[order.items[i].titleID].push(e._id)
            )
            
        }
        return bookIDList;
    }

}

module.exports = new OrderController;