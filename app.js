/**
 * Module dependencies.
 */
var express = require('express'),
    mongoose = require('mongoose');

var app = module.exports = express.createServer();

//to do sample model
mongoose.connect('mongodb://bmaurer:bmaurer@flame.mongohq.com:27072/benmHQ');

var Todo = mongoose.model('Todo', new mongoose.Schema({
  text: String,
  done: Boolean,
  order: Number
}));


//table of contents: use to build nav bar with links (title is also the page header)
var pages = [
    {title: 'Home', link: 'home'},
    {title: 'TODO App', link: 'todo'},
    {title: 'About', link: 'about'},
    {title: 'Bio', link: 'bio'}  
    /*'home': "Home",
    'todo': "TODO App",
    'about': "About",
    'bio': "Bio"*/
];  //now its url/page header (title)

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false }); //necessary for block templ inheritance
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes



app.get('/', function(req, res) {
   // res.render('layout', {locals: {title: pagestitle}});    //"Welcome to Ben Maurer's website!"});
    res.render('layout', {title: "Welcome to Ben Maurer's website!", tab: 0});
    console.log(req.route.path);
});
 
app.get('/todo', function(req, res) {
    res.render('todo', {title: "MongoDB Backed TODO App", tab: 1});
});

app.get('/About', function(req, res) {
    res.render('layout', {title: "About", tab: 2});
    console.log(req.route.path);
});


//set up the page routes using the pages variable
/*
for(var i=1; i<pages.length; i++) {
    var fnGet = 'g
    fnGet = function()
    
}
*/

//first level gets for the NAV section

//these probably must be defined prior to generation

/*app.get('*', function(req, res, next) {
    
    var path = req.route.path;
    var nSlashes = path.split('/').length;
    if (nSlashes > 0) {
        next();
    } else {
    //its a first level
    var title = pages.path;  //this will never load...
    console.log(title);
    //console.log(pages[path]);
         res.render('layout', {title: pages.path});
    
    }
        
    
});*/


app.get('/api/todos', function(req, res){
   
  return Todo.find(function(err, todos) {
    return res.send(todos);
  });
 
});

app.get('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    if (!err) {
      return res.send(todo);
    }
  });
});

app.put('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    todo.text = req.body.text;
    todo.done = req.body.done;
    todo.order = req.body.order;
    return todo.save(function(err) {
      if (!err) {
        console.log("updated");
      }
      return res.send(todo);
    });
  });
});

app.post('/api/todos', function(req, res){
  var todo;
  todo = new Todo({
    text: req.body.text,
    done: req.body.done,
    order: req.body.order
  });
  todo.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(todo);
});

app.delete('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    return todo.remove(function(err) {
      if (!err) {
        console.log("removed");
        return res.send('')
      }
    });
  });
});

app.listen(process.env.PORT, function(){
  console.log("Express server running");
});
