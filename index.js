var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoClient = require('mongodb').MongoClient;


//Linking the routes to the 'routes' folder
// var home = require('./routes/home');
// var users = require('./routes/users');


//Initialise the express app
var app = express();

//My static folder will be set to 'public'
app.use(express.static('public'));

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
// app.use('', home);
// app.use('/users', users);

//Homepage Route
app.get('/', function(req, res) {
    res.render('home', {
        title: "Welcome"
    })
});

//SignUp Routes
// 1. For SignUp
app.get('/users/signup', function(req, res ){
    res.render('signup',{title:"SignUp"})
});

//Posting registration form
app.post('/users/signup', function(req, res) { 
    var ObjectID = require('mongodb').ObjectID;
    db.collection('userRegister').insertOne({_id:ObjectID, date: new Date(), name:req.body.name, email:req.body.email, username:req.body.username, password:req.body.password});
    res.render('signin',{title: 'Login', msg: 'Succefully registered. Now you may login.'});
    console.log(JSON.stringify(req.body) + " added to the db.userRegister"); 
});

//SignIn Routes
//  2. For SignIn
app.get('/users/signin', function(req, res ){
    res.render('signin',{title:"SignIn"})
});

app.post('/users/signin',function(req,res){
    var profileUser= {
        username: req.body.username,
        password: req.body.password
    }
    db.collection('userRegister').findOne(profileUser, function(err, result){ 
        if(err) throw err;
        else if(!result) {
            res.render('wrong')
        }else{
            req.session.loggedIn = true;
            req.session.username = req.body.username;
            console.log("Successful login for "+req.session.username);
            res.redirect('/users/profile'); 
        }
    });
});

//Reset Password
  //GET
  app.get('/users/reset', function(req, res) {
    res.render('reset', {
        title: "Reset Password"
    })
})
  //POST
  app.post('/users/reset', function(req, res) {
    console.log(req.body);
    var user = {
        username: req.body.username
    }
    var pswd = {
        password: req.body.password
    }
db.collection('userRegister').updateOne({username: req.body.username}, {$set: {password: req.body.password}}, function(err, reset){
        if(err) throw err;
        else{
            console.log('Password to resetted to '+ req.body.password + " for " + req.body.username)
            res.redirect('/users/signin')
        }
    })
})
//Profile routings
  //GET
  app.get('/users/profile', function(req, res){
    if(req.session.loggedIn===true) {
        res.render('profile', {title: 'Profile', msg: 'Welcome ' + req.session.username})
    }else{
        res.redirect('/')
    }
});
//Logout Route
app.get('/users/logout', function(req, res)  {
    console.log(req.session.username + " just logged out.")
    req.session.destroy();
    res.redirect('/users/signin');
    
})
//api for the individual expenses (originally in index.js -- not needed to put '/users/:id')
app.get('/:id', function(req, res) {
    var par = req.params;
    console.log(par);
    db.collection('expenseDetails').findOne({_id: require('mongodb').ObjectID(req.params.id)}, function(err, serf) {
        if(err) throw err;
        console.log(serf)
        res.render('edit-expense', {
            title: "EditingExpense",
            expense: serf 

        });
    });
});
//Posting the set-budget
app.post('/users/set-budget', function(req, res) {
    var budget = {
        "username": req.session.username,
        "budget": req.body.budget, 
        "month": req.body.month,
        "date": new Date()
        }
    console.log("This is the budget " + budget);
    db.collection('budgetDetails').insert(budget, function(err, budget){
        if(err) throw err
        else{
            console.log(JSON.stringify(budget) + " was added by " + req.session.username);
            res.redirect('/users/profile')
        }
    });
});

//Posting the add-expense
app.post('/users/add-expense', function(req, res) {
    var expense = {
    "id": Math.random(),  
    "username": req.session.username,    
    "amount": req.body.expense,
    "category": req.body.category,
    "currency": req.body.currency,
    "date": new Date(),
    "comment": req.body.comment
    }
    console.log(expense);
    db.collection('expenseDetails').insert(expense, function(err, result){
        if(err) throw err
        else{
            console.log(expense._id +" this is the ID");
            console.log(JSON.stringify(result) + " was added by " + req.session.username);
            res.redirect('/users/profile')
        }
    });
  });
//For the ajax
app.get('/users/api', function(req, res){
    var user={username: req.session.username}
    db.collection('expenseDetails').find(user).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

//EditExpense Route
app.post('/users/edit/:id', function(req, res) {
    var editedExpense = {   
        "amount": req.body.expense,
        "category": req.body.category,
        "currency": req.body.currency,
        "date": new Date(),
        "comment": req.body.comment
        }
     db.collection('expenseDetails').updateOne({_id: require('mongodb').ObjectID(req.params.id)}, {$set: editedExpense}, function(err, update) {
         if(err) throw err;
         else{
             console.log(update)
             res.redirect('/users/profile');            
        }
    });
});
//Delete Route
app.get('/users/deleteExpense/:id', function(req, res) {
    db.collection('expenseDetails').deleteOne({_id: require('mongodb').ObjectID(req.params.id)}, function(err, deleted) {
        if(err) throw err;
        console.log(deleted + " was deleted");
        res.redirect('/users/profile')
    });
});

//
app.get('/users/about', function(req, res) {
    res.render('about', {
        title: "AboutUS"
    });
});
console.log('Magic Happens at PORT 3000');
app.listen(process.env.PORT || 3000);
