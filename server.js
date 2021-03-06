var path = require("path");

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
//use for json
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "./client/views"));
app.set("view engine", "ejs");

const server = app.listen(5000);
console.log("SERVER ===========> listening on port: 5000");

//mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/1955_api_db");
mongoose.Promise = global.Promise;

//schema model
const PersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20
    }
  },
  {
    timestamps: true
  }
);
mongoose.model("Person", PersonSchema);

var Person = mongoose.model("Person");

//routes
app.get("/", function(req, res) {
  Person.find({}, function(err, ppl) {
    if (err) {
      console.log("Returned error", err);
      res.json({ message: "Error", error: err });
    } else {
      res.json({ message: "Success", data: ppl });
    }
  });
});

app.get("/new/:name", function(req, res) {
  console.log("\nreq.params.name =>", req.params.name);
  var new_name = new Person({ name: req.params.name });
  new_name.save(function(err) {
    if (err) {
      console.log("something went wrong inserting");
      res.json({
        message: "ERROR",
        error: err
      });
    } else {
      console.log("added person!");
      res.json({ message: "success" });
    }
  });
});

app.get("/remove/:name/", function(req, res) {
  Person.remove({ name: req.params.name }, function(err) {
    if (err) {
      console.log("Returned error", err);
      res.json({ message: "Error", error: err });
    } else {
      res.json({ message: "Removed" });
    }
  });
});

app.get("/:name", function(req, res) {
  Person.find({ name: req.params.name }, function(err, per) {
    if (err) {
      console.log("Returned error", err);
      res.json({ message: "Error", error: err });
    } else {
      res.json({ message: "Success", data: per });
    }
  });
});
