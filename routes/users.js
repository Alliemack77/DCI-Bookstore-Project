const express = require('express');
const usersRouter = express.Router();
const {validationResult} = require('express-validator');
const { userValidator, resultsValidator } = require('../validation/userValidator');
const controller = require('../controller/usersController');
const { auth } = require('../middleware/auth');



// /users/login
usersRouter.post('/login', (req, res) => {
    controller.logIn(req, res);
});



// /users
usersRouter.get('/', (req, res) => {
    controller.getUsers(req, res);
});



// /users/new
usersRouter.post('/new', userValidator(), (req, res) => {

    const errors = validationResult(req).array();

    if(errors.length > 0) {
        resultsValidator(req, res, errors);
    }else {
        controller.addUser(req, res);
    }

});



// users/:id
usersRouter.get('/:id', (req, res) => {
    controller.findUser(req, res);
});

usersRouter.put('/:id', (req, res) => {
    controller.updateUser(req, res);
});

usersRouter.delete('/:id', auth, (req, res) => {
    controller.deleteUser(req, res);
});






module.exports = usersRouter;