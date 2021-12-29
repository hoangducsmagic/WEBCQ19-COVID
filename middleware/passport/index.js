const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const accountModel = require('../../models/accountModel');

passport.use(new LocalStrategy(
    async function(username, password, done){
        const user = await accountModel.checkLogin(username, password);
        if (!user)
            return done(null, false, {message: 'Incorrect username or password.'});
        console.log(user);
        return done(null, user);
    }
));

passport.serializeUser(function(user, done)
{
    console.log(user);
    done(null,user.username);
});

passport.deserializeUser(function(username,done)
{
    accountModel.get(username).then((user) =>{done(null, user)})
    
})


module.exports = passport;