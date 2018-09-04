'use strict';

let express = require('express');

let app = express();

let handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  extname: '.hbs'
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/files'));

app.get('/', function(req, res){
  res.render('index');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started at http://localhost:' +
  app.get('port') + '; press Ctrl+C to interrupt.' );
});
