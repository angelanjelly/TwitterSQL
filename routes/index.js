'use strict';
var express = require('express');
var router = express.Router();
var client = require('../db/index.js');

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query('SELECT * FROM tweets JOIN users ON users.id = tweets.userid', function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('index', {
        title: 'Twitter.js',
        showForm: true,
        tweets: result.rows
      });
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:user', function(req, res, next){
    var username = req.params.user;
    client.query('SELECT * FROM tweets JOIN users ON users.id = tweets.userid WHERE users.name=$1', [username], function (err, result) {
      if (err) throw err; // pass errors to Express
      res.render('index', { 
        title: 'Twitter.js', 
        tweets: result.rows, 
        showForm: true 
      });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    var tweetID = req.params.id;
    client.query('SELECT * FROM tweets JOIN users ON users.id = tweets.userid WHERE tweets.id=$1', [tweetID], function (err, result) {
      if (err) throw err; // pass errors to Express
      res.render('index', { 
        title: 'Twitter.js', 
        tweets: result.rows, 
        showForm: true 
      });
    });
  });

  // creates a new tweet
  router.post('/tweets', function(req, res, next){
    var newName = req.body.name;
    var newContent = req.body.content;
    client.query('SELECT * FROM users WHERE name=$1', [newName], function(err, nameExists) {
      if (err) throw error;
      if (nameExists.rows[0]) {
        var nameID = nameExists.rows[0].id;
        client.query('INSERT INTO tweets (userid, content) VALUES ($1, $2) RETURNING *', [nameID, newContent], function(err, result) {
          if (err) throw error;
        });
      } 
      else if (!nameExists.rows[0]) {
        client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [newName], function(err, result) {
          if (err) throw error;
        });
        client.query('SELECT id FROM users WHERE name=$1', [newName], function(err, newNameID) {
          if (err) throw error;
          client.query('INSERT INTO tweets (userid, content) VALUES ($1, $2) RETURNING *', [newNameID, newContent], function(err, result) {
            if (err) throw error;
            res.redirect('/');
          })
        })
      }
    });
    res.redirect('/');
  });



  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}



