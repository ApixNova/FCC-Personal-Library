/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let id = "";

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .type("form")
            .send({
              title: "test",
            })
            .end(function (err, res) {
              id = res.body._id;
              assert.equal(res.status, 200);
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .end(function (err, res) {
              console.log("res.body: " + JSON.stringify(res.body));
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/000000000000")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/" + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "title");
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/" + id)
            .type("form")
            .send({
              comment: "test comment",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              assert.property(res.body, "comments");
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/" + id)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/000000000000")
            .type("form")
            .send({
              comment: "test comment",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete("/api/books/" + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete("/api/books/000000000000")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });
    });
  });
});
