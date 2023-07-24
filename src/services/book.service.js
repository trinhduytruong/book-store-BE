const Book = require('../app/models/book.model');
const { BookStatus } = require('../configs/global');

class BookService{
    
    getAll = async(titleID, status = BookStatus.ALL) => {
        let query;
        if(status == BookStatus.ALL) query = {titleID: titleID};
        else query = {titleID: titleID, status: status}

        const books = await Book.find(query);
        for(let i in books)
            books[i] = books[i].toObject();
        
        return books;

    }

    findById = async(bookID) => {
        const book = await Book.findById(bookID);
        return book ? book.toObject() : book;
    }

    update = async(bookID, data) => {
        await Book.findOneAndUpdate({_id: bookID}, data);
        const nBook = await Book.findById(bookID);
        return nBook ? nBook.toObject() : nBook;
    }

    delete = async(bookID) => {
        // code here
    }

    create = async(book) => {

        const nBook = await Book.create(book);
        return  nBook ? nBook.toObject() : nBook;
    }
    
}

module.exports = new BookService;