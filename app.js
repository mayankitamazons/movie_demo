var express = require('express');
const Movie = require("./models/Movie");
const apiResponse=require('./helpers/apiResponse');
require("dotenv").config();
// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var OMB_API_KEY = process.env.OMB_API_KEY;
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log('Connected to database');
	
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
var app = express();

var port = process.env.PORT || 8080;
var API_KEY = process.env.PORT || '793ff06c';

app.set("view engine", "ejs");
app.use(express.static("public"));

var request = require('request');
app.get("/favmovielist", function(req, res){
    try {
        Movie.find().then((movies)=>{
            console.log(movies);
            if(movies.length > 0){
              //  var data = JSON.parse(movies);
                res.render("favlist", {data: movies});
              }else{
                res.redirect("error");
            }
        });
    } catch (err) {
        //throw error in json response with status 500. 
        return apiResponse.ErrorResponse(res, err);
    }

});
app.get("/makefav", function(req, res){
    if(req.query.movie_name){
       
        var myData = new Movie({
            movie_name:req.query.movie_name,
            cover_image:req.query.cover_image
        });
        myData.save()
          .then(item => {
            res.send("Movie saved to database");
          })
          .catch(err => {
            res.status(400).send("unable to save to database");
          });
       
       
    }
    else{
        res.status(400).send("unable to save to database");
    }
    
   
	
    // console.log(req.query.movie_name);
});
app.get("/", function(req,res){
    res.render("search");
});
app.get("/favlist", function(req,res){
    res.render("favlist");
});  

app.get("/request", function(req, res){
    var query = encodeURIComponent(req.query.search);
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey="+OMB_API_KEY;
    request(url, function(error, response, body){
        var data = JSON.parse(body);
        if(!data["Error"] && response.statusCode === 200){
            
            res.render("results", {data: data});
        }
        else{
            res.redirect("error");
        }
    })
});


app.get("*", function(req, res){
    res.render("error");
});

app.listen(port, function(){
    console.log("Server running");
});
