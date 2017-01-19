var express = require('express');
var hashwords = require('hashwords');

var Fiddle = require('../models/fiddle');

var router = express.Router();
var hw = hashwords();

var saveFiddle = function (newFiddle, req, res) {
  // Check if a fiddle with same hash already exists
  Fiddle.find({ hash: newFiddle.hash }, function(err, fiddle) {
    if (fiddle.length > 0) {
      // Create new hash
      var hash = hw.hash(newFiddle.hash + 'salt');
      newFiddle.hash = hash[0] + hash[1] + hash[2];

      // Try to save again
      saveFiddle(newFiddle, req, res);
    } else {
      // Create the fiddle and send a response if successful
      newFiddle.save(function(err, data) {
        if (err) throw err;

        console.log('Fiddle created with hash: ' + data.hash);
        var redirectUrl = req.protocol + '://' + req.get('host') + req.originalUrl + data.hash;
        res.end(redirectUrl);
      });
    }
  });
}

router.get('/:hash', function(req, res, next) {
  Fiddle.find({ hash: req.params.hash }, function(err, fiddle) {
    if (err) {
      res.render('error', { error: err });
    } else {
      res.render('index', { title: fiddle[0].title, content: fiddle[0].content, canUpdate: true });
    }
  });
});

router.put('/:hash', function(req, res, next) {
  Fiddle.findOneAndUpdate({ hash: req.params.hash }, { title: req.body.title, content: req.body.content }, function(err, fiddle) {
    if (err) {
      res.render('error', { error: err });
    } else {
      res.end('Fiddle updated');
    }
  });
});

router.post('/', function(req, res, next) {
  var add = '';
  var hash = hw.hash(req.body.title);

  var fiddle = new Fiddle({
    title: req.body.title,
    content: req.body.content,
    hash: hash[0] + hash[1] + hash[2]
  });

  saveFiddle(fiddle, req, res);
});

module.exports = router;
