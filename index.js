var express = require('express');
var app = express();

var exphbs  = require('express-handlebars');
var hbsEngine = exphbs.create({extname: '.hbs'});

app.engine('.hbs',hbsEngine.engine);
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views')


var mongoClient = require('mongodb').MongoClient;
var db;

mongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function(err, client) {
  if (err) throw err;
  db = client.db('projectCodefiner');
});


app.use(express.urlencoded());
app.use(express.static('public'));


app.get('/user/graph', function(req,res) {

  db.collection('expenseDetails').find({id:'001'}).toArray( function(err, result) {
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
      }else if (result[i].category == 'household') {
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



app.get('/user/graph/month', function(req,res) {
  db.collection('expenseDetails').find({id:"001"}).toArray( function(err, result) {
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    
    }
    console.log(amount);
    return res.render('monthExp',{title:"Monthly Graph",
                                 amount:amount
                          });

  });

});




app.get('/user/graph/year', function(req,res) {
  db.collection('expenseDetails').find({ $expr: { $eq: [{ $year: "$date" },{$year:{ date: new Date() }}] },category:"marketing"}).toArray( function(err, result) {
    if (err) throw err;
    console.log(result);
  });
  res.render('yearExp');
});

app.get('/user/graph/alltime', function(req,res) {
  res.render('allTimeExp');
});

app.get('/user/setbudget',function (req,res){
  db.collection('expenseDetails').find({"id":"001"}).toArray( function(err, result) {
    if (err) throw err;
    var amount = [];
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      var expAmt = result[i].amount;
      amount.push(expAmt);
    }
    console.log(amount);
    return res.render('expvsbgt',{title:"Monthly Graph",
                                 amount:amount,
                          });
  });
  db.collection('budget').find({"id":"001"}).toArray( function(err,result){
    if (err) throw err;
    var budget = [];
    for (var i=0;i<result.length;i++){
      var bgt = result[i].budget;
      budget.push(bgt);
    } 
    console.log(budget);
    return res.render('expvsbgt') , {title: "Monthly Graph",
                                     budget : budget,
                                    };
  })
 
})


app.listen(3000);
