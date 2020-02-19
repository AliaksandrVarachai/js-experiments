const express = require('express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const app = express();
var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });
// session
app.use(session({
  // secret: 'MySecret',
  resave: false,
  saveUnitialized: true,
  store: memoryStore,
}));

app.use(keycloak.middleware({
  logout: '/'
}));

// route protected with Keycloak
app.get('/secure', keycloak.protect(), function(req, res) {
  res.render(
    'test',
    {title: 'Test of the test'}
    );
});

app.listen(9000, function() {
  console.log('Listening at http://localhost:9000');
});
