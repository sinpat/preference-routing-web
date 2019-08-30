import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    },

    {
      path: '/register',
      name: 'register',
      component: () =>
        import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
    },
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: () =>
        import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');
  if (to.name === 'login' && loggedIn) {
    next({ name: 'home' });
  }

  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
