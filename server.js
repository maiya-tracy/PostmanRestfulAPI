var express = require("express");

var path = require("path");
var session = require('express-session');

var app = express();
var bodyParser = require('body-parser');
const server = app.listen(1337);
const io = require('socket.io')(server);

app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}))

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restfulAPI');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
  limit: '5mb'
}));

var TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5
  },
  description: {
    type: String,
    minlength: 2,
    default: ''
  },
  completed: {
    type: Boolean,
    minlength: 2,
    default: false
  }
}, {
  timestamps: true
})
mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');



app.get('/tasks', (req, res) => {
    Task.find({}, (err, tasks) => {
        if(err){
           console.log("Returned error", err);
           res.json({message: "Error", error: err})
        }
        else {
           res.json({message: "Success", data: tasks})
        }
     })
})

app.get('/tasks/:id', (req,res) => {
  Task.findById(req.params.id, (err, tasks) => {
      if(err){
         console.log("Returned error", err);
         res.json({message: "Error", error: err})
      }
      else {
         res.json({message: "Success", data: tasks})
      }
   })
})

app.post('/tasks', (req,res) => {
  Task.create(req.body, (err, tasks) => {
    if(err){
       console.log("Returned error", err);
       res.json({message: "Error", error: err})
    }
    else {
       res.json({message: "Success", data: tasks})
    }
  })
})

app.put('/tasks/:id', (req,res) => {
  Task.findByIdAndUpdate(req.params.id, req.body, {runValidators:true, new: true}, (err, tasks) =>{
    if(err){
       console.log("Returned error", err);
       res.json({message: "Error", error: err})
    }
    else {
       res.json({message: "Success", data: tasks})
    }
  })
})

app.delete('/tasks/:id', (req,res) => {
  Task.findByIdAndRemove(req.params.id, (err) => {
    if(err){
       console.log("Returned error", err);
       res.json({message: "Error", error: err})
    }
    else {
       res.json({message: "Success"})
    }
  })
})
