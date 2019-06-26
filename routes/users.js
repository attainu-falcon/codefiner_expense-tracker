var express = require('express');
var router = express.Router();

// 1. For SignUp
router.get('/signup', function(req, res ){
    res.render('signup',{title:"SignUp"})
});

//Posting registration form
router.post('/signup', function(req, res) { 
    db.collection('userRegister').insert({name:req.body.name, email:req.body.email, username:req.body.username, password:req.body.password});
    res.render('signin',{title: 'Login', msg: 'Succefully registered. Now you may login.'});
    console.log(JSON.stringify(req.body) + " added to the db.userRegister"); 
});

//  2. For SignIn
router.get('/signin', function(req, res ){
    res.render('signin',{title:"SignIn"})
});

router.post('/signin',function(req,res){
    db.collection('userRegister').findOne(req.body.username, function(err, result){
        if(err) throw err;
        else if(!result) {
            res.render('signin', {error: 'Not a valid username.'})
        }else{
            if(req.body.password === result.password) {
                req.session.loggedIn = true; 
                res.render('profile', {msg: "Welcome"})   // allow the user
            }else{
                res.render('signin', {error: "Invalid credentials"})
                console.log('Invalid credentials.')
            }
        }
    })
    
});
    


module.exports = router;