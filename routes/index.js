var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'CanvasFiddle', 
    content: 'var c = document.getElementById("output");\nvar ctx = c.getContext("2d");', 
    canUpdate: false });
});

module.exports = router;
