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
    var email = req.body.email;
    db.collection('userRegister').findOne({email: email}, function (err, emailPresent) {
        if(err) throw err;
        else if (emailPresent) {
                 res.render('already', {
                     title: "Already registered email"
                 })
        } else {
            db.collection('userRegister').insertOne({_id:ObjectID, date: new Date(), name:req.body.name, email:req.body.email, username:req.body.username, password:req.body.password});
            console.log(JSON.stringify(req.body) + " added to the db.userRegister");
            res.render('signin',{
                title: 'Login', msg: 'Succefully registered. Now you may login.'
            });
        }
    });
    // db.collection('userRegister').insertOne({_id:ObjectID, date: new Date(), name:req.body.name, email:req.body.email, username:req.body.username, password:req.body.password});
    // res.render('signin',{title: 'Login', msg: 'Succefully registered. Now you may login.'});
    // console.log(JSON.stringify(req.body) + " added to the db.userRegister");
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
        res.render('profile', {
            title: 'Profile',
            msg: 'Welcome, ' + req.session.username
        })
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
        title: "AboutUS",
        msg: 'Welcome, ' + req.session.username
    });
});
// View category wise expense
app.get('/user/graph', function(req,res) {

  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] }}).toArray( function(err, result) {
    var marketing,transport,grocery,household,utilities,entertainment,others;
    if (err) throw err;
    marketing = 0; transport = 0; grocery = 0; household =0; utility = 0; entertainment = 0; others = 0;
    for (var i = 0; i < result.length; i++) {
      if ( result[i].category == 'marketing') {
        var amt = parseInt(result[i].amount);
        marketing += Number(amt);
      } else if (result[i].category == 'transport') {
        var amt = parseInt(result[i].amount);
        transport += Number(amt);
      } else if (result[i].category == 'grocery') {
        var amt = parseInt(result[i].amount);
        grocery += Number(amt);
      }else if (result[i].category == 'households') {
        var amt = parseInt(result[i].amount);
        household += Number(amt);
      }else if (result[i].category == 'utilities') {
        var amt = parseInt(result[i].amount);
        utility += Number(amt);
      }else if (result[i].category == 'entertainment') {
        var amt = parseInt(result[i].amount);
        entertainment += Number(amt);
      }else if (result[i].category == 'others') {
        var amt = parseInt(result[i].amount);
        others += Number(amt);
      }

    }
    return res.render('groupExp', {title:"Expenses Category",
                                      mktamount: marketing,
                                      trpamount: transport,
                                      grcamount: grocery,
                                      hslamount: household,
                                      utlamount: utility,
                                      entamount: entertainment,
                                      othamount: others,

                                    });

  });

});

app.get('/user/graph/month/marketing', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] },category:"marketing"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount,
                          });

  });

});

app.get('/user/graph/month/transport', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] },category:"transport"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount,
                          });

  });

});

app.get('/user/graph/month/grocery', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] },category:"grocery"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount,
                          });

  });

});

app.get('/user/graph/month/household', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] },category:"households"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount,
                          });

  });

});

app.get('/user/graph/month/utilities', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] },category:"utilities"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount,
                          });

  });

});

app.get('/user/graph/month/entertainment', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] },category:"entertainment"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount,
                          });

  });

});

app.get('/user/graph/month/others', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] },category:"others"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount,
                          });

  });

});

app.get('/user/graph/year/marketing', function(req,res) {
  var marketing = 0;
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"marketing"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      marketing += Number(amt);
    }
    res.render('yearExp',{title:"Yearly Expense",
                          totalExp: marketing,
                         category: "marketing"});
  });


});

app.get('/user/graph/year/transport', function(req,res) {
  var transport = 0;
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"transport"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      transport += Number(amt);
    }
    res.render('yearExp',{title:"Yearly Expense",
                          totalExp: transport,
                         category: "transport"});
  });


});

app.get('/user/graph/year/grocery', function(req,res) {
  var grocery = 0;
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"grocery"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      grocery += Number(amt);
    }
    res.render('yearExp',{title:"Yearly Expense",
                          totalExp: grocery,
                         category: "grocery"});
  });


});

app.get('/user/graph/year/utilities', function(req,res) {
  var utl = 0;
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"utilities"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      utl += Number(amt);
    }
    res.render('yearExp',{title:"Yearly Expense",
                          totalExp: utl,
                         category: "utilities"});
  });


});

app.get('/user/graph/year/entertainment', function(req,res) {
  var entertainment = 0;
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"entertainment"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      entertainment += Number(amt);
    }
    res.render('yearExp',{title:"Yearly Expense",
                          totalExp: entertainment,
                         category: "entertainment"});
  });


});

app.get('/user/graph/year/household', function(req,res) {
  var hhl = 0;
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"households"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      hhl += Number(amt);
    }
    res.render('yearExp',{title:"Yearly Expense",
                          totalExp: hhl,
                         category: "households"});
  });


});

app.get('/user/graph/year/others', function(req,res) {
  var others = 0;
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"others"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      others += Number(amt);
    }
    res.render('yearExp',{title:"Yearly Expense",
                          totalExp: others,
                         category: "others"});
  });


});

app.get('/user/alltime/marketing', function(req,res) {
  var marketingAmt = 0;
  db.collection('expenseDetails').find({username:req.session.username,category:"marketing"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      marketingAmt += Number(amt);
    }
    res.render('allTimeExp',{title:"All Time Expense",
                          totalExp: marketingAmt,
                         category: "marketing"});
  });

});

app.get('/user/alltime/transport', function(req,res) {
  var transpAmt = 0;
  db.collection('expenseDetails').find({username:req.session.username,category:"transport"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      transpAmt += Number(amt);
    }
    res.render('allTimeExp',{title:"All Time Expense",
                          totalExp: transpAmt,
                         category: "transport"});
  });

});

app.get('/user/alltime/grocery', function(req,res) {
  var grcAmt = 0;
  db.collection('expenseDetails').find({username:req.session.username,category:"grocery"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      grcAmt += Number(amt);
    }
    res.render('allTimeExp',{title:"All Time Expense",
                          totalExp: grcAmt,
                         category: "grocery"});
  });

});

app.get('/user/alltime/utilities', function(req,res) {
  var utlAmt = 0;
  db.collection('expenseDetails').find({username:req.session.username,category:"utilities"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      utlAmt += Number(amt);
    }
    res.render('allTimeExp',{title:"All Time Expense",
                          totalExp: utlAmt,
                         category: "utilities"});
  });

});

app.get('/user/alltime/household', function(req,res) {
  var hhlAmt = 0;
  db.collection('expenseDetails').find({username:req.session.username,category:"households"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      hhlAmt += Number(amt);
    }
    res.render('allTimeExp',{title:"All Time Expense",
                          totalExp: hhlAmt,
                         category: "households"});
  });

});

app.get('/user/alltime/entertainment', function(req,res) {
  var entAmt = 0;
  db.collection('expenseDetails').find({username:req.session.username,category:"entertainment"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      entAmt += Number(amt);
    }
    res.render('allTimeExp',{title:"All Time Expense",
                          totalExp: entAmt,
                         category: "entertainment"});
  });

});

app.get('/user/alltime/others', function(req,res) {
  var othAmt = 0;
  db.collection('expenseDetails').find({username:req.session.username,category:"others"}).toArray( function(err, result) {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      othAmt += Number(amt);
    }
    res.render('allTimeExp',{title:"All Time Expense",
                          totalExp: othAmt,
                         category: "others"});
  });

});



app.get('/user/expvsbgt', function(req,res) {
  db.collection('expenseDetails').find({username:req.session.username, $expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] }}).toArray( function(err, result) {
    var amount = 0;var budget;
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var amt = parseInt(result[i].amount);
      amount += Number(amt);
    }
    db.collection('budgetDetails').find({username:req.session.username,$expr: { $eq: [{ $month: "$date" },{$month:{ date: new Date() }}] }}).toArray( function(err,result) {
      if (err) throw err;
      console.log(parseInt(result[0].budget));
      budget = parseInt(result[0].budget);
      return res.render('expvsbgt',{title:"Expense Vs Budget",
                                   amount:amount,budget:budget
                                    });
    });


  });

});


























console.log('Magic Happens at PORT 3000');
app.listen(process.env.PORT || 3000);
