// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

   // use res.render to load up an ejs view file
      //Firebase admin config
      var admin = require("firebase-admin");
      var serviceAccount = require("./Google Service account JSON file here");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "Firebase project here"
      });
  //List All users code
      let allUsers = [];
      const listAllUsers = (nextPageToken) => {
        // List batch of users, 1000 at a time.
        admin
          .auth()
          .listUsers(1000, nextPageToken)
          .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
              allUsers.push(userRecord);
              //console.log('user', JSON.stringify(userRecord, null, "   "));
            });
            if (listUsersResult.pageToken) {
              // List next batch of users.
              listAllUsers(listUsersResult.pageToken);
            }
          })
          .catch((error) => {
            console.log('Error listing users:', error);
          });
      };
      // Start listing users from the beginning, 1000 at a time.
      listAllUsers();
// index page
app.get('/', function(req, res) {
  var tagline = "Firebase users";
  res.render('pages/users', {
      allUsers: allUsers,
      tagline: tagline
  });
});
// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
  //console.log(allUsers)
});

app.listen(8080);
console.log('8080 is the magic port');

