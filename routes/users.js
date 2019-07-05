var express = require('express');
var router = express.Router();

// 1. For SignUp
router.get('/signup', function(req, res ){
    res.render('signup',{title:"SignUp"})
});

//Posting registration form
router.post('/signup', function(req, res) { 
    var ObjectID = require('mongodb').ObjectID;
    db.collection('userRegister').insertOne({_id:ObjectID, date: new Date(), name:req.body.name, email:req.body.email, username:req.body.username, password:req.body.password});
    res.render('signin',{title: 'Login', msg: 'Succefully registered. Now you may login.'});
    console.log(JSON.stringify(req.body) + " added to the db.userRegister"); 
});

//  2. For SignIn
router.get('/signin', function(req, res ){
    res.render('signin',{title:"SignIn"})
});

router.post('/signin',function(req,res){
    var profileUser= {
           username: req.body.username,
           password: req.body.password
    } 
    
    db.collection('userRegister').findOne(profileUser, function(err, result){
      
        if(err) throw err;
        else if(!result) {
            res.render('signin', {error: 'Not a valid username.'})
        }else{
                req.session.loggedIn = true; 
                req.session.username = req.body.username;
                console.log("Success")
                res.render('profile', {msg: "Welcome"})   // allow the user                        
        }
    })
    // for(var i=0; i<allData.length; i++) {
    //     if(profileUser){
    //         req.session.loggedIn=true;
    //         req.session.username = req.body.username;
    //         res.render('profile', {msg: "Welcome"})
    //     }else{
    //         res.render('signin', {error: "Oops wrong credentials"});
    //         }
    //     }
    });

//Profile routings

router.get('/profile', function(req, res){
    if(req.session.loggedIn===true) {
        res.render('profile', {title: 'Profile', msg: 'Welcome Home'})
    }res.render('profile', {title: 'Profile', msg: 'Welcome Home'})
}) 

//Posting the add-expense
router.post('/add-expense', function(req, res) {
    console.log(req.body);
    var expense = {
    "amount": req.body.expense,
    "category": req.body.category,
    "currency": req.body.currency,
    "date": new Date(),
    "comment": req.body.comment
    }
    db.collection('expenseDetails').insert(expense, function(err, result){
        if(err) throw err
        else{
            console.log(result);
            res.render('profile', {msg: "New Expense added"})
        }
    })
    }
)

module.exports = router;