var express = require('express');
var app = express();

app.use(express.urlencoded());
app.use(express.static('public'));
app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req,res) {
  res.sendfile('index.html');
});

app.get('/signup', function(req,res) {
  res.send('Sign-up page');
});

app.get('/login', function(req,res) {
  res.send('login page <a href="/user"> Login Link </a>');
});

app.get('/user', function(req,res) {
  res.send('Expense Details <a href="/user/add"> Add Expense </a> <br/><a href="/user/graph"> View Graph </a> <br/> <a href="/user/setbudget"> Set Budget </a>');
});

app.get('/user/add', function(req,res) {
  res.send('Add new Expense');
});

app.get('/user/graph', function(req,res) {
  res.send('Catgory Wise Expenses <br/><a href="/user/graph/month"> View month </a> <br/> <a href="/user/graph/year"> View year </a> <br/> <a href="/user/graph/alltime"> View All time </a> ');
});

app.get('/user/graph/month', function(req,res) {
  res.send('Monthly graph');
});

app.get('/user/graph/year', function(req,res) {
  res.send('Yearly graph');
});

app.get('/user/graph/alltime', function(req,res) {
  res.send('All time Expense graph');
});

app.get('/user/setbudget', function(req,res) {
  res.send('Set Budget and see expenditure vs budget');
});


app.listen(3000);
