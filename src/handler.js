const { nanoid } = require('nanoid');
const books = require('./books');

const saveBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon ini nama buku',
        });
        response.code(400);
        return response;
    }

    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readpage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }  

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt ;

    const newBook = {
        id,
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading, 
        insertedAt, 
        updatedAt
    };

      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      };

      const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
      
};


const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

  let containerBooks = books;

  if (name !== undefined) {

    containerBooks = containerBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

  }

  if (reading !== undefined) {

    containerBooks = containerBooks.filter((book) => book.reading == reading);

  }

  if (finished !== undefined) {

    containerBooks = containerBooks.filter((book) => book.finished == finished);

  }
    
    const response = h.response({
            status: 'success',
            data: {
               books: Books.map((dataBook) => ({
                id: dataBook.id,
                name: dataBook.name,
                publisher: dataBook.publisher,
               }))
            }
        });
        response.code(200);
        return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
            book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
  };

  const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (pageCount > readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readpage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }  

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };

        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            })
            .code(200);
        return response;
    }
 
    const response = h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};

module.exports = { saveBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
