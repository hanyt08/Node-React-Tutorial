const passport = require('passport');

module.exports = (app) => {
  app.get(
    '/auth/google', 
    passport.authenticate('google', {
      //what access to have
      scope: ['profile', 'email']
  }));
  
  app.get('/auth/google/callback', passport.authenticate('google'));

  app.get('/api/logout', (req, res) => {
    //function provided by passport
    req.logout();
    res.send(req.user);
  });
  
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
}
