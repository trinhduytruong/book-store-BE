const { BookStatus } = require('../../configs/global');
const bookService = require('../../services/book.service');
const titleService = require('../../services/title.service');
const Util = require('../../utils/util');

class BookController{
    
    getAllBooks = async(req, res) => {
        
        try{
            const titleID = req.params.titleID;
            const status = req.query.status ?? BookStatus.ALL;

            const books = await bookService.getAll(titleID, +status);

            return res.json(books);

        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }
    }

    getBook = async(req, res) => {

        try{
            const bookID = req.params.id;

            const book = await bookService.findById(bookID);

            if(!book) return res.status(404).json({message: 'not found'});

            return res.json(book);

        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }

    }

    createBook = async(req, res) => {

        try{
            const body = req.body;
            delete body.status;

            if(!(await titleService.findById(body.titleID, false)))
                return res.status(400).json({message: 'title is not found'});

            const nBook = await bookService.create({titleID: body.titleID});

            if(!nBook) return res.status(500).json({message: 'cannot create book'});
            return res.json(nBook);

        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }

    }

    updateBook = async(req, res) => {

        try{
            const bookID = req.query.id;
            const body = req.body;

            if(body.status) body.status = Util.formatStatus(res, body.status);

            const book = await bookService.update(bookID, body);

            if(!book) return res.status(500).json({message: 'cannot update book'});

            return res.json(book);


        }catch(err){
            console.log(err);
            return res.status(400).json({error: err.message});
        }

    }

    deleteBook(req, res){

        res.json({content: 'delete book'});

    }

}

module.exports = new BookController;