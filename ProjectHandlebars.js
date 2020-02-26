var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
var credentials = require('./credentials.js');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: credentials.sessionpwd}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3128);

function checkSession(req, res){
	if(!req.session.name){
		var context={};
		res.render('getSession',context);
		return true;
	}
	return false;
}

function setContext(req, res){
	var context = {};
	context.name = req.session.name;
	context.age = req.session.age;
	return context;
}

app.get('/',function(req,res){
  if(checkSession(req,res)){
	  return;
  }
  var context = setContext(req,res);
  res.render('home',context);
});

app.post('/', function(req,res,next){
  if(req.body.Name&& req.body.age){
	  req.session.name = req.body.Name;
	  req.session.cityName = req.body.age;
  }
  if(checkSession(req,res)){
	  return;
  }
  
  var context = setContext(req,res);
	res.render('home',context);
});

app.post('/findWeather', function(req,res,next){
  if(checkSession(req,res)){
	  return;
  }
  
  if(req.body.cityName){
	 request('http://api.openweathermap.org/data/2.5/weather?q='+req.body.cityName+'&APPID=' + credentials.owApiKey, function(err, response, body){
		if(!err && response.statusCode < 400){
		  var response = JSON.parse(body);
		  var yourTemperature = Math.floor(response.main.temp - 273);
		  
		   request('http://api.openweathermap.org/data/2.5/weather?q=seattle&APPID=' + credentials.owApiKey, function(err, response, body){
			if(!err && response.statusCode < 400){
		      var context = setContext(req,res);
			  var response = JSON.parse(body);
			  var myTemperature = Math.floor(response.main.temp - 273);
			  
			  var diffTemp = yourTemperature - myTemperature;
			  var weatherMessage = "todays weather"
			  context.weatherMessage = "It is "+ yourTemperature+ " C in "+req.body.cityName+ ". ";
			  if(diffTemp>0){
				  context.weatherMessage = context.weatherMessage + " That sounds nice! That is " + diffTemp + " C warmer than Seattle";
			  }else{
				  context.weatherMessage = context.weatherMessage + " You should also consider Seattle. "+req.body.cityName+" is " + diffTemp + " colder than Seattle";
			  }
			 
			  res.render('traveled',context);
			  
			} else {
				next(err);
			}
			
		  });
		  
		} else {
		  if(response.statusCode >= 400 && response.statusCode < 500){
			var context= {};
			var context = setContext(req,res);
			context.error = "City not found. Please try again";
			res.render('traveled',context);
			
		  }else{
			next(err);
		  }
		}
		
	  });
  }else{
	var context = setContext(req,res);
	res.render('traveled',context);
  }
});

app.post('/stock', function(req,res,next){
  if(checkSession(req,res)){
	  return;
  }
  
  if(req.body.stockTicker){
	 request( "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+req.body.stockTicker+"&apikey="+ credentials.stockApiKey, function(err, response, body){
		if(!err && response.statusCode < 400){
		  var response = JSON.parse(body);
		  var context = setContext(req,res);
		  context.stockMessage = response[1];
		  res.render('hobbies',context);
		   
		  
		} else {
		  if(response.statusCode >= 400 && response.statusCode < 500){
			var context = setContext(req,res);
			context.error = "Stock ticker not found. Please try again";
			res.render('hobbies',context);
			
		  }else{
			next(err);
		  }
		}
		
	  });
  }else{
	var context = setContext(req,res);
	res.render('hobbies',context);
  }
});

app.get('/professional',function(req,res){
  if(checkSession(req,res)){
	  return;
  }
  var context = setContext(req,res);
  res.render('professional',context);
});

app.get('/hobbies',function(req,res){
  if(checkSession(req,res)){
	  return;
  }
  var context = setContext(req,res);
  res.render('hobbies',context);
});

app.get('/traveled',function(req,res){
  if(checkSession(req,res)){
	  return;
  }
  var context = setContext(req,res);
  res.render('traveled',context);
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
