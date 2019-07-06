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
            console.log('Oops')
            res.render('signin', {error: 'Not a valid username.'})
        }else{
                req.session.loggedIn = true; 
                req.session.username = req.body.username;
                console.log("Successful login for "+req.session.username);
                // res.render('profile', {msg: "Welcome"})   // allow the user                        
    }
    // console.log('OOps')
    res.redirect('/users/profile')      
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
        res.render('profile', {title: 'Profile', msg: 'Welcome ' + req.session.username})
    }
}) 

router.get('/logout', function(req, res)  {
    console.log(req.session.username + " just logged out.")
    req.session.destroy();
    res.redirect('/users/signin');
    
})
//Posting the set-budget
router.post('/set-budget', function(req, res) {
    var budget = {
        "username": req.session.username,
        "budget": req.body.budget, 
        "date": new Date()
        }
    console.log("This is the budget " + budget);
    db.collection('budgetDetails').insert(budget, function(err, budget){
        if(err) throw err
        else{
            console.log(JSON.stringify(budget) + " was added by " + req.session.username);
            res.redirect('/users/profile')
        }
    })
})

//Posting the add-expense
router.post('/add-expense', function(req, res) {
    var expense = {
    "username":req.session.username,    
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
            console.log(JSON.stringify(result) + " was added by " + req.session.username);
            res.redirect('/users/profile')
            // res.render('profile', {msg: "New Expense added"})
        }
    })
  }
)

router.get('/api', function(req, res){
    var user={username: req.session.username}
    db.collection('expenseDetails').find(user).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    })
})
router.get('/apio', function(req, res){
    var user={username: req.session.username}
    db.collection('userRegister').find(user).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    })
})

module.exports = router;