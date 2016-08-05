var pg = require('pg');

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools
var postgreURL = 'postgres://localhost/twitterdb'
var client = new pg.Client(postgreURL);



client.connect();

// connect to our database
// client.connect(function (err) {
//   if (err) throw err;
//   router.get('/tweets/:id', function(req, res, next){
//     var username = res.params.id;
//     var tweetsWithThatUser = client.query('SELECT $1::text as name', [username], function (err, result) {
//     if (err) throw err;
//   });

  // var tweetsWithThatId = client.find({ id: Number(req.params.id) });



//   // execute a query on our database
//   client.query('SELECT $1::text as name', ['username'], function (err, result) {
//     if (err) throw err;

//     // just print the result to the console
//     console.log(result.rows[0]); // outputs: { name: 'brianc' }

//     // disconnect the client
//     client.end(function (err) {
//       if (err) throw err;
//     });
//   });
// });

module.exports = client;