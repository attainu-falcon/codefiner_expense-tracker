var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var db;
//Setting public as my static folder
app.use(express.static('public'));

//Connecting Mongo
var mongoClient = require('mongodb').MongoClient;
mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true}, function(err, client) {
    if(err) throw err;

    db = client.db('project_CodeFiner') //Our DB : "project_CodeFiner"
    console.log(db.project_CodeFiner)

    db.collection('userRegister').find().toArray(function(err, result) {
        if(err) throw err;
        console.log(result)
    })
})


//Before Using the form we must put the bodyParser in use. So that the form data can be parsed.
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


//signup route routings
app.get('/signup', function(req, res) {
    res.sendfile('public/signup.html')
});

//login routings
app.get('/signin', function(req, res) {
        res.sendfile('public/signin.html')
})


//Posting registration form
app.post('/reg-form', function(req, res) { 
    db.collection('userRegister').insert(req.body);
    res.redirect('/signin');
    console.log(JSON.stringify(req.body) + " added to the db.userRegister"); 
});


//Express-Session
app.use(session({
    secret: "some secret"
}))

//For Login
app.post('/form-login', function(req, res) {
    // var db = req.app.locals.db;
    db.collection('userRegister').findOne({username: req.body.username}, function(err, response){
        if(err) throw err;
        else if(!response) {
            console.log("There is no data corresponding to this data.");
        }else {
            db.collection('userRegister').find({"password": {$eq:"req.body.password"}}, function(err, result){
                if(err) throw err;
                else if(!result) {
                    console.log("Wrong Inputs");
                }else{
                    req.session.loggedIn = true;
                    req.session.user_id = response.id;
                    res.redirect('/profile');
                }
            } )
        }
    })
    
})

//The profile route

app.get('/profile', function(req, res) {
    if(req.session.loggedIn == true) {
        res.sendfile('./public/profile.html')
        // res.send("Welcome " + req.session.username + ". <a href='/logout'>Logout</a>")
    }else {
        res.send('Sorry <a href="/signin">Login</a>')
    }
});

//addExpense

app.post('/addExpense', function(req, res){
    console.log(req.session.username + ' added newExpense.');
    db.collection('userRegister').updateOne({username: req.session.username}, { $set: {expense: req.body.expense}});
    res.send(alert('Expense added for ' + req.body.session));
})

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
})


app.listen(4000)