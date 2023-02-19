const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../index.js');          //use this locally
// const server = 'https://issue-tracker.isimeri.repl.co';      //use this on repl

let delId;

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite("POST tests", function(){

        test("Create an issue with every field: POST request to /api/issues/{project}", function(done){
            chai.request(server)
            .post("/api/issues/apitest")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({issue_title: "glorious title",
                issue_text: "very detailed description",
                created_by: "good guy greg", 
                assigned_to: "george the issue demolisher",
                status_text: "in progress"})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                delId = res.body._id;
                assert.equal(res.body.issue_title, "glorious title");
                assert.equal(res.body.issue_text, "very detailed description");
                assert.equal(res.body.created_by, "good guy greg");
                assert.equal(res.body.assigned_to, "george the issue demolisher");
                assert.equal(res.body.status_text, "in progress");
                 done();
            });
        });

        test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done){
            chai.request(server)
            .post("/api/issues/apitest")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({issue_title: "glorious title",
                issue_text: "very detailed description",
                created_by: "crombopulous michael",
                assigned_to: "",
                status_text: ""
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, "glorious title");
                assert.equal(res.body.issue_text, "very detailed description");
                assert.equal(res.body.created_by, "crombopulous michael");
                assert.equal(res.body.assigned_to, "");
                assert.equal(res.body.status_text, "");
                done();
            });
        });

        test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done){
            chai.request(server)
            .post("/api/issues/apitest")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({issue_title: "",
                issue_text: "",
                created_by: "", 
                assigned_to: "george the issue demolisher",
                status_text: "new"})
            .end(function (err, res) {
                assert.equal(res.body.err, "required field(s) missing");
                done();
            });
        });
    });
    suite("GET requests", function(){

        test("View issues on a project: GET request to /api/issues/{project}", function(done){
            chai.request(server)
            .get("/api/issues/apitest")
            .end(function(err, res){
                const obj = res.body[0];
                assert.equal(res.status, 200);
                assert.equal(obj.issue_title, "epic title");
                assert.equal(obj.issue_text, "description is right here");
                assert.equal(obj.created_by, "good guy greg");
                assert.equal(obj.assigned_to, "carlos");
                done()
            });
        });
        test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done){
            chai.request(server)
            .get('/api/issues/apitest')
            .query({
                created_by: "good guy greg"
            })
            .end(function(err, res){
                const obj = res.body[0];
                assert.equal(res.status, 200);
                assert.equal(obj.issue_title, "epic title");
                assert.equal(obj.issue_text, "description is right here");
                assert.equal(obj.created_by, "good guy greg");
                assert.equal(obj.assigned_to, "carlos");
                done();
            });
        });
        test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function(done){
            chai.request(server)
            .get('/api/issues/apitest')
            .query({
                created_by: "good guy greg",
                assigned_to: "leita morchena"
            })
            .end(function(err, res){
                const obj = res.body[0];
                assert.equal(res.status, 200);
                assert.equal(obj.issue_title, "magnesium");
                assert.equal(obj.issue_text, "crab rave");
                assert.equal(obj.created_by, "good guy greg");
                assert.equal(obj.assigned_to, "leita morchena");
                done();
            });
        });
    });
    suite("PUT requests", function(){
        test("Update one field on an issue: PUT request to /api/issues/{project}", function(done){
            chai.request(server)
            .put("/api/issues/apitest")
            .send({
                _id: "63f0e91e2cc7073368c7f09a",
                assigned_to: "larry"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.doc.assigned_to, "larry");
                done();
            });
        });
        test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function(done){
            chai.request(server)
            .put("/api/issues/apitest")
            .send({
                _id: "63f0e91e2cc7073368c7f09a",
                assigned_to: "alejandro",
                status_text: "ja"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.doc.assigned_to, "alejandro");
                assert.equal(res.body.doc.status_text, "ja");
                done();
            });
        });
        test("Update an issue with missing _id: PUT request to /api/issues/{project}", function(done){
            chai.request(server)
            .put("/api/issues/apitest")
            .send({
                assigned_to: "lady gaga"
            })
            .end(function(err, res){
                assert.equal(res.body.msg, "missing _id");
                done();
            });
        });
        test("Update an issue with no fields to update: PUT request to /api/issues/{project}", done => {
            chai.request(server)
            .put("/api/issues/apitest")
            .send({_id: "63f0e91e2cc7073368c7f09a"})
            .end((err, res) => {
                assert.equal(res.body.msg, "no update field(s) sent");
                done();
            });
        });
        test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", done => {
            chai.request(server)
            .put("/api/issues/apitest")
            .send({
                _id: "63f0e91e2cc7073368c7f09b",
                assigned_to: "jimbo"
            })
            .end((err, res) => {
                assert.equal(res.body.msg, "issue not found");
                done();
            });
        });
    });
    suite("DELETE requests", function(){
        test("Delete an issue: DELETE request to /api/issues/{project}", done => {
            chai.request(server)
            .delete("/api/issues/apitest")
            .send({_id: delId})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully deleted");
                done();
            });
        });
        test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", done => {
            chai.request(server)
            .delete("/api/issues/apitest")
            .send({_id: "abcdefghij69xy"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "could not delete");
                done();
            });
        });
        test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", done => {  
            chai.request(server)
            .delete("/api/issues/apitest")
            .send({_id: ""})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "missing _id");
                done();
            });
        });
    });
})
