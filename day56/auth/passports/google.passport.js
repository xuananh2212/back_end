require('dotenv').config();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/index').User;
const Provider = require('../models/index').Provider;
async function handleProvider(profile) {
     const provider = await Provider.findOne({
          where: {
               name: profile?.provider
          }
     })
     let user = null;
     if (!provider) {
          user = await User.create({
               name: profile?.displayName,
               password: null,
               email: profile?.emails[0].value,
               Provider: {
                    name: profile?.provider
               }
          },
               {
                    include: [Provider]
               })
     } else {
          user = await User.create({
               name: profile?.displayName,
               password: null,
               email: profile?.emails[0].value,
               providerId: provider.id
          })
     }
     return user;
}
module.exports = new GoogleStrategy({
     clientID: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
     callbackURL: process.env.CALL_BACK_URL,
     scope: ['profile'],
     state: true
}, async function (accessToken, refreshToken, profile, done) {
     console.log(profile);
     try {
          const user = await User.findOne({
               where: {
                    email: profile?.emails[0].value,
               },
               include: Provider
          });
          let userNew = null;
          if (!user) {
               userNew = await handleProvider(profile);
               done(null, userNew);
          } else {
               if (user?.Provider) {
                    const { name } = user.Provider;
                    if (name !== profile?.provider) {
                         userNew = await handleProvider(profile);
                         done(null, userNew);
                    } else {
                         done(null, user);
                    }
               } else {
                    userNew = await handleProvider(profile);
                    done(null, userNew);
               }
          }
     } catch (err) {
          done(err, {});
     }


})