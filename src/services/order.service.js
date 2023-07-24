const Order = require('../app/models/order.model');
const mongoose = require('mongoose');
const { OrderStatus } = require('../configs/global');

class OrderService{
    
    getAll = async(userID, type = OrderStatus.ALL) => {
        let query;
        if(type === OrderStatus.ALL)
            query = userID ? {userID: userID} : {};
        else query = userID ? {userID: userID, status: type} : {status: type};
        
        const allOrders = await Order.find(query)
                            .sort({
                                createdAt: (type === OrderStatus.PENDING || type === OrderStatus.PROCESSING 
                                    ? 1 : -1)
                            });
        return allOrders;

    }

    getMine = async(userID, type = OrderStatus.ALL, limit = null) => {
        let query = {userID: userID}
        if(+type != OrderStatus.ALL)
            query = {userID: userID, status: +type};
        const orders = limit ? await Order.find(query).sort({createdAt: -1}).limit(+limit)
                            : await Order.find(query).sort({createdAt: -1});
        return orders;

    }

    findById = async(orderID) => {

        const order = await Order.findById(orderID);

        return order;// ? order.toObject() : order;

    }

    update = async(orderID, data) => {

        await Order.findOneAndUpdate({_id: orderID}, data);
        const nOrder = await Order.findById(orderID);

        return nOrder;

    }

    create = async(order) => {
     
        const nOrder = await Order.create(order);
        return nOrder ? nOrder.toObject() : nOrder;

    }

    getNumberOfOrderTypes = async(userID) => {
        const objectId = mongoose.Types.ObjectId(userID);
        console.log(objectId)

        const counts = await Order.aggregate([
            { $match: { userID: objectId } }, 
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } }
          ]);
      
          // make result object
          const result = {
            pending: 0, processing: 0, completed: 0, canceled: 0
          };
          counts.forEach(({ status, count }) => {
            if(status == OrderStatus.PENDING)
                result.pending = count;
            else if(status == OrderStatus.PROCESSING)
                result.processing = count;
            else if(status == OrderStatus.COMPLETED)
                result.completed= count;
            else if(status == OrderStatus.CANCELED)
                result.canceled = count;

          });
          return result;

    }
    
}

module.exports = new OrderService;