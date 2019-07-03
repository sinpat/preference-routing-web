const routing = 'http://localhost:8000/routing/';
const user = 'http://localhost:8000/user/';

export default {
  // routing
  setSource: routing + 'source',
  setTarget: routing + 'target',
  fsp: routing + 'fsp',

  // user
  login: user + 'login',
  register: user + 'register',
  verifyToken: user + 'verify',
};
