var express = require('express');
var router = express.Router();

// 1. For SignUp
router.get('/signup', function(req, res ){
    res.render('signup',{title:"SignUp"})
});

//Posting registration form
router.post('/signup', function(req, res) { 
    db.collection('userRegister').insertOne({name:req.body.name, email:req.body.email, username:req.body.username, password:req.body.password});
    res.render('signin',{title: 'Login', msg: 'Succefully registered. Now you may login.'});
    console.log(JSON.stringify(req.body) + " added to the db.userRegister"); 
});

//  2. For SignIn
router.get('/signin', function(req, res ){
    res.render('signin',{title:"SignIn"})
});

router.post('/signin',function(req,res){
    var User= {
           user: req.body.username,
           pass: req.body.password
    }
    
    db.collection('userRegister').findOne(User, function(err, result){
      
        if(err) throw err;
        else if(!result) {
            res.render('signin', {error: 'Not a valid username.'})
        }else{
            if(result) {
                req.session.loggedIn = true; 
                console.log("Success")
                res.render('profile', {msg: "Welcome"})   // allow the user
            }else{
                res.render('signin', {error: "Invalid credentials"})
                console.log('Invalid credentials.')
            }
        }
    })
    
});

//Profile routings

router.get('/profile', function(req, res){
    if(req.session.loggedIn===true) {
        res.render('profile', {title: 'Profile'})
    }  res.render('profile', {title: 'Profile'})
}) 


module.exports = router;