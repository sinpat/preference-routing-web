const routing = 'http://localhost:8000/routing/';
const user = 'http://localhost:8000/user/';

// const routing = 'http://algohol03.informatik.uni-stuttgart.de:8000/routing/';
// const user = 'http://algohol03.informatik.uni-stuttgart.de:8000/user/';

export default {
  // routing
  closest: routing + 'closest',
  fsp: routing + 'fsp',
  preference: routing + 'preference',
  calcPref: routing + 'calc_preference',
  reset: routing + 'reset',

  // user
  login: user + 'login',
  register: user + 'register',
  verifyToken: user + 'verify',
};
