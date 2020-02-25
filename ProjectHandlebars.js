var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
var credentials = require('./credentials.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: credentials.sessionpwd}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3128);

function checkSession(req, res){
	if(!req.session.name){
		res.render('getSession');
		return true;
	}
	return false;
}

app.get('/',function(req,res){
  if(checkSession(req,res)){
	  return;
  }
  var context= {};
  res.render('home',context);
});

app.post('/', function(req,res){
  if(req.body.Name&& req.body.cityName && req.body.countryCode){
	  req.session.name = req.body.Name;
	  req.session.cityName = req.body.cityName;
	  req.session.countryCode = req.body.countryCode;
  }
if(checkSession(req,res)){
	  return;
  }
  var context = {};
  res.render('home',context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
