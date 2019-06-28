var express = require('express');
var app = express();

var exphbs  = require('express-handlebars');
app.engine('.hbs', exphbs({extname: '.hbs',defaultLayout: 'main'}));
app.set('view engine', '.hbs');

var mongoClient = require('mongodb').MongoClient;
var db;

mongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function(err, client) {
  if (err) throw err;
  db = client.db('project_CodeFiner');
});


app.use(express.urlencoded());
app.use(express.static('public'));
// app.use(function(req,res,next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.get('/', function (req,res) {
//   res.sendfile('index.html');
// });
//
// app.get('/signup', function(req,res) {
//   res.send('Sign-up page');
// });
//
// app.get('/login', function(req,res) {
//   res.send('login page <a href="/user"> Login Link </a>');
// });
//
// app.get('/user', function(req,res) {
//   res.send('Expense Details <a href="/user/add"> Add Expense </a> <br/><a href="/user/graph"> View Graph </a> <br/> <a href="/user/setbudget"> Set Budget </a>');
// });
//
// app.get('/user/add', function(req,res) {
//   res.send('Add new Expense');
// });





// res.send('Catgory Wise Expenses <br/><a href="/user/graph/month"> View month </a> <br/> <a href="/user/graph/year"> View year </a> <br/> <a href="/user/graph/alltime"> View All time </a> ');





app.get('/user/graph', function(req,res) {

  db.collection('expenseDetails').find({id:'001'}).toArray( function(err, result) {
    var marketing,transport,grocery;
    if (err) throw err;
    console.log(result);
    marketing = 0; transport = 0; grocery = 0;
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
      }

    }
    console.log(marketing) ;
    return res.render('groupexpense', {title:"Expenses Category",
                                      mktamount: marketing,
                                      trpamount: transport,
                                      grcamount: grocery
                                    });
  });

});







// app.get('/user/graph/month', function(req,res) {
//   res.send('Monthly graph');
// });
//
// app.get('/user/graph/year', function(req,res) {
//   res.send('Yearly graph');
// });
//
// app.get('/user/graph/alltime', function(req,res) {
//   res.send('All time Expense graph');
// });










// app.get('/user/setbudget', function(req,res) {
//   res.send('Set Budget and see expenditure vs budget');
// });


app.listen(3000);
