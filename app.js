var express = require('express'); // require express
var path = require('path'); //
var mongoose = require('mongoose'); // database connector
var bodyParser = require('body-parser');
var app = express();// instance of express

app.set('view engine','pug');
app.use(express.static(path.join(__dirname,'./public')));
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb://localhost/lec1homework');// connect to database
// get objectId
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductSchema = {
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    stock: Number,
    onSale: Boolean
};

var ProductModel = mongoose.model('Product', // model name
    //{name: String, age: Number, school: String}, // schema
    ProductSchema,
    'product' // collection name (students under webdxd db)
);

// router, 4 different request( call back function)
// req -- request
// res -- response
app.get('/', function (req, res) {
    // res.send('Hello World!') // send String
    ProductModel.find().exec(function(err, doc){
        if (err) {
            res.send("Network Error")
        } else {
            res.render(path.join(__dirname, './views','index.pug'),{productlist:doc})
            //res.send(doc) // 2
        }

    });
    //res.sendFile(path.join(__dirname, './public','index.html')) 1
    // if 2 and 1 at the same time, 1 run faster than 2 and will render, 2 wont
});


app.get('/new',function(req, res){
    res.render(path.join(__dirname, './views','add.pug'),{})
});
app.post('/new',function(req, res){
    var productObject = new ProductModel(req.body);
    productObject.save(); // mongoose save function
    res.redirect('/')   // console.log(req.body);
    // need body-parser to achieve .body ()
});

app.get('/update/:id',function(req, res){
    // 1. get student and render
    // 2. update
    ProductModel.findById(req.params.id, function (err,doc){
        if (err) {
            res.send("Network Error")
        } else {
            res.render(path.join(__dirname, './views','update.pug'),{product:doc, actionUrl: "/update/" + doc._id})
        }
    });
});
app.post('/update/:id',function(req, res){
    ProductModel.update({_id: req.params.id}, {$set: req.body}, function(err,doc){
        if (err) {
            res.send("update fail")
        } else {
            // redirect URL
            res.redirect('/' + req.params.id)
        }
    })

});

app.get('/delete/:id', function (req, res) {
    // use exct
    ProductModel.remove({_id: req.params.id}).exec( function(err) {
        if (err) {
            res.send("update fail")
        }
        else {
            res.redirect('/')
        }
    });
});

app.get('/:id',function(req, res){
    ProductModel.findById(req.params.id, function(err, doc) {
        if (err) {
            res.send("Network Error")
        } else {

            res.render(path.join(__dirname, './views', 'detail.pug'), {product: doc})
        }
    })
});

// 3000 is the port number, console will show "Example app listening on port 3000!" when server is running
app.listen(3000, function () {
    //var foo = 'bar';
    //var foo = function(){
    //    var foo = 'rab';
    //}
    //foo();
    //console.log(foo); return [function: foo]

    console.log('Example app listening on port 3000!');
    //console.log('20170128' - 8 == '20170120');
    //console.log('1' + 1 ); // == '11'


});

