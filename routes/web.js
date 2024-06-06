
const express = require('express');

const route= express.Router();

const TestController = require('../app/controllers/TestController');

route.get('/', (req, res) => {
    res.send('Hello World');
});

route.get('/test', TestController.index);


module.exports = route;
