var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoClient = require('mongodb').MongoClient;


//Linking the routes to the 'routes' folder
var home = require('./routes/home');
var users = require('./routes/users');


//Initialise the express app
var app = express();

//My static folder will be set to 'public'
app.use(express.static('public'));

//Initialising the 'models'
var Expense = require('./models/expenseDetails');


//Initialise bodyParser and express-session
app.use(express.urlencoded());
app.use(session({secret: "Your secret key"}));

// parse application/json
app.use(bodyParser.json())


//Initialise template engine (handlebars)
app.set('views', __dirname + '/views')
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

app.get('/:id', function(req, res) {
    var par = req.params;
    console.log(par);
    db.collection('expenseDetails').findOne(par, function(err, serf) {
        if(err) throw err;
        console.log(serf)
        res.json(serf);
    })
})
console.log('Magic Happens at PORT 8000');
app.listen(process.env.PORT || 8000);
