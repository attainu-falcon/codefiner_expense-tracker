var express = require('express');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var path = require('path');
var bodyparser=require("body-parser");
var mongoClient = require('mongodb').MongoClient;

//Linking the routes to the 'routes' folder
var home = require('./routes/home');
var users = require('./routes/users');


//Initialise the express app
var app = express();

//My static folder will be set to 'public'
app.use(express.static('public'));

//Initialise bodyParser and express-session
app.use(bodyparser.urlencoded({extended: true}));
app.use(session({secret: "Your secret key"}));

//Initialise template engine (handlebars)
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

//Connecting Mongo
var mongoClient = require('mongodb').MongoClient;
mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true}, function(err, client) {
    if(err) throw err;
    db = client.db('project_CodeFiner') //Our DB : "project_CodeFiner"
})


// Initialise the routes
app.use('', home);
app.use('/users', users);


app.listen(3009)
