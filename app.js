const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://bookstoreUser2:mQQUamR9NukEtP5@cluster0.itfwp.mongodb.net/Bookstore-Project?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true
});

mongoose.connection.on('error', console.error);
mongoose.connection.on('open', function(){
    console.log('Database connection extablished ... banana');
});

app.use(express.urlencoded({extended: true}));
app.use(session({secret: "secrets", saveUninitialized: false, resave: false}));
app.use(express.static(__dirname + "/public"));

// set CORS
// const setCors = require('./middleware/security');
// app.use((req, res, next) => {
//     setCors(req, res);
//     next();
// });
  

// import routes
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
app.use('/books', booksRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);


// Home Route
app.get('/', (req, res) => {
    res.sendFile('index.html');
});


app.listen(port, () => console.log(`Listening at: ${port}`) )