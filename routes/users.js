var express = require('express');
var router = express.Router();

// 1. For SignUp
router.get('/signup', function(req, res ){
    res.render('signup',{title:"SignUp"})
});

//Posting registration form
router.post('/signup', function(req, res) { 
    db.collection('userRegister').insert({name:req.body.name, email:req.body.email, username:req.body.username, password:req.body.password});
    res.render('signin',{title: 'Login'});
    console.log(JSON.stringify(req.body) + " added to the db.userRegister"); 
});

//  2. For SignIn
router.get('/signin', function(req, res ){
    res.render('signin',{title:"SignIn"})
});

router.post('/',function(req,res){
    var db = req.app.locals.db; 
    
});
    


module.exports = router;