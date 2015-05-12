var localStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var users = {};
module.exports = function(passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
       console.log('serializing user:',user.username);
       return done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        return done('we have not implemented this', false);
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            return done('we have not implemented this', false);
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            if(users[username]){
                console.log('User already exists with username ' + username);
            }

            // save user
            users[username] = {
                username: username,
                password: createHash(password)
            }

            console.log(users[username].username + ' Registration successful');
            return done(null, users[username]);

        }
    ));

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};
