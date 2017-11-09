var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/test");



var app = express();
app.use(express.static(__dirname+ "/public"));
app.use(bodyParser.json());

app.use("/api",require("./routes/controller"));

app.listen(3000);
console.log("Server running on port 3000");
