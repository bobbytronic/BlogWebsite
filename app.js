//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

const postSchema = new mongoose.Schema({
  title: "String",
  content: "String"
});

const Posts = new mongoose.model("Post", postSchema);
let posts = [];


app.get("/", async (req, res) => {

  try {
    const foundPosts = await Posts.find();
    res.render("home", {publishedPosts: foundPosts});
    }    
   catch (error) {
    console.log(error);
  }
});

app.get("/posts/:topic", async (req, res) =>{
  
var requestedTitle = _.lowerCase(req.params.topic);
const foundPosts = await Posts.find();
  foundPosts.forEach(function(post){
    var recordedTitle = _.lowerCase(post.title)
    if(recordedTitle === requestedTitle){
      res.render("post.ejs", {title: post.title, content: post.content})
    }
  })
})


app.get("/about",  (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) =>{

  const post = new Posts ({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  await post.save();
  res.redirect("/");
})













app.listen(3000, function() {
  console.log("Server started on port 3000");
});
