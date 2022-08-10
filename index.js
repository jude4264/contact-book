var express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var app = express();

const config = require('./server/config/key');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected...'))
.catch(err=>console.log(err))

// // DB setting
// mongoose.connect(process.env.MONGO_DB); // 1
// var db = mongoose.connection; //2
// //3
// db.once('open', function(){
//   console.log('DB connected');
// });
// //4
// db.on('error', function(err){
//   console.log('DB ERROR : ', err);
// });

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//DB schema
var contactSchema = mongoose.Schema({
    name:{type:String, require:true, unique:true},
    email:{type:String},
    phone:{type:String}
});
var Contact = mongoose.model('contact',contactSchema);


//Routes
//Home 
app.get('/',function(req,res){
    res.redirect('/contacts')
})

//Contacts - index 
app.get('/contacts', function(rq,res){
    Contact.find({}, function(err, contacts){
        if(err) return res.json(err);
        res.render('contacts/index',{contacts:contacts})
    })
})

//Contacts - New
app.get('/contacts/new', function(req,res){
    res.render('contacts/new')
})

//Contacts - create
app.get('/contacts', function(req,res){
    console.log(req.body)
    Contact.create(req.body, function(err,contact){
        if(err) return res.json(err)
        res.redirect('/contacts')
    })
})


// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});