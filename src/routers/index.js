import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/home'),
    meta: {
      title: 'home'
    }
  },
  {
    path: '/simple-force',
    name: 'SimpleForce',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/d3/simple-force'),
    meta: {
      title: 'simple-force'
    }
  },
  {
    path: '/new-force',
    name: 'NewForce',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/d3/force-cluster'),
    meta: {
      title: 'new-force'
    }
  },
  {
    path: '/force',
    name: 'Force',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/d3/force'),
    meta: {
      title: 'force'
    }
  },
  {
    path: '/tree',
    name: 'Tree',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/d3/tree'),
    meta: {
      title: 'tree'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
