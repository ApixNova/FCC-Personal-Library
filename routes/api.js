/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
  title: String,
  comments: [String],
});

let Book = mongoose.model("book", bookSchema);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      try {
        const bookList = await Book.find({});
        let bookRes = [];
        bookList.map((book) => {
          bookRes.push({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
          });
        });
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        res.json(bookRes);
      } catch (e) {
        console.log(e.message);
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (title == undefined) {
        res.json("missing required field title");
      } else {
        try {
          let book = await Book.create({
            title: title,
            comments: [],
          });
          //response will contain new book object including atleast _id and title
          res.json(book);
        } catch (e) {
          console.log(e.message);
        }
      }
    })

    .delete(async function (req, res) {
      try {
        const deleteAll = await Book.deleteMany();
        res.json("complete delete successful");
      } catch (e) {
        console.log(e.message);
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (book == null) {
          res.json("no book exists");
        } else {
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
          res.json(book);
        }
      } catch (e) {
        console.log(e.message);
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (comment == undefined) {
        res.json("missing required field comment");
      } else {
        try {
          let bookToUpdate = await Book.findById(bookid);
          if (bookToUpdate == null) {
            res.json("no book exists");
          } else {
            bookToUpdate.comments.push(comment);
            const update = { comments: bookToUpdate.comments };
            let updatedBook = await Book.findByIdAndUpdate(bookid, update);
            //json res format same as .get
            res.json(bookToUpdate);
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        let deletedBook = await Book.findByIdAndDelete(bookid);
        if (deletedBook == null) {
          res.json("no book exists");
        } else {
          //if successful response will be 'delete successful'
          res.json("delete successful");
        }
      } catch (e) {
        console.log(e.message);
      }
    });
};
