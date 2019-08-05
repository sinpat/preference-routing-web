const routing = 'http://localhost:8000/routing/';
const user = 'http://localhost:8000/user/';

export default {
  // routing
  closest: routing + 'closest',
  fsp: routing + 'fsp',
  newPref: routing + 'preference',

  // user
  login: user + 'login',
  register: user + 'register',
  verifyToken: user + 'verify',
};
