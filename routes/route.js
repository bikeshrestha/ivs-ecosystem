const router = require("express").Router();
const fs = require('fs');

fs.readdir('./controllers' , (err , files) => {

    files.forEach(file => {

        router.use('/' , require('../controllers/' + file))

    });

});

module.exports = router;