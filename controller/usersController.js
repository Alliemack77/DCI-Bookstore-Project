require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const objectID = require('mongodb').ObjectID;

// require Model
const {UserModel} = require('../models/userModel');


// Handlers
// /users
const getUsers = async (req, res) => {
    await UserModel.find({}).then(docs => {
        res.json(docs);
    }).catch(err => {
        res.json(err);
    });
}

// /users/new
const addUser = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({error: err});
        }else {
            const user = new UserModel({
                fname: req.body.fname, 
                lname: req.body.lname, 
                email: req.body.email, 
                password: hash
            });
        
            const newAddress = {
                city: req.body.city,
                street: req.body.street
            }
        
            user.address.push(newAddress);
        
            user.save().then(() => {
                console.log(`You added: ${user}`);
                res.send(user);
            }).catch(err => {
                res.json(err);
            });
        }
    });
}

// /users/login
const logIn = (req, res) => {
    UserModel.find({email: req.body.email}).exec().then(user => {
        if(user.length < 1) {
            return res.status(401).json({message: "Whoops, looks like you are not registered."});
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({message: 'Your password is incorrect.'});
            }
            if (result) {
                const userName = req.body.fname;
                const userEmail = req.body.email;
                const user = {name: userName, email: userEmail};
                const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

                return res.status(200).json({message: "Success", accessToken: accessToken});
            }
            return res.status(401).json({message: 'Oh, your password is incorrect.'})

        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err, message: 'Something went wrong.'})
    });
}


// /users/:id
const findUser = (req, res) => {
    const id = req.params.id;
    const filter = {"_id": objectID(id)};

    UserModel.findById(filter, (err, doc) => {
        if(err) {
            res.json(err);
        }else {
            console.log(doc);
            res.send(`Your user is ${doc}`);
        };
    });
}

const updateUser = (req, res) => {
    const id = req.params.id;
    const filter = {"_id": objectID(id)};

    UserModel.findById(filter, (err, doc) => {
        if(err) {
            res.json(err);
        }else {
            UserModel.updateOne(filter, {
                fname: req.body.fname || doc.fname,
                lname: req.body.lname || doc.lname,
                email: req.body.email || doc.email,
                password: req.body.password || doc.password
            }, (err, doc) => {
                if(err) {
                    res.json(err);
                }else {
                    console.log(doc);
                    res.json({success: "OK"});
                };
            });
        };
    });
}

const deleteUser = (req, res) => {
    const id = req.params.id;
    const filter = {"_id": objectID(id)};

    UserModel.deleteOne(filter, (err) => {
        if(err) {
            res.json(err);
        }else {
            console.log('Your user was deleted');
            res.json({success: "OK"});
        };
    });
}



exports.getUsers = getUsers;
exports.addUser = addUser;
exports.findUser = findUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.logIn = logIn;
