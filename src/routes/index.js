const userRouter = require('./user.routes');
const siteRouter = require('./site.routes');
const titleRouter = require('./title.routes');
const bookRouter = require('./book.routes');
const orderRouter = require('./order.routes');
const cartRouter = require('./cart.routes');

function route(app){
    
    app.use('/user', userRouter);

    app.use('/title', titleRouter);

    app.use('/book', bookRouter);

    app.use('/order', orderRouter);

    app.use('/cart', cartRouter);

    app.use('/', siteRouter); 

}

module.exports = route;