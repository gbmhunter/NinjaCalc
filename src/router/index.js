import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })

// 1. Define route components.
// These can be imported from other files
// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

// NOTE: No routes are defined, because the router is used
// in a "vuex friendly fashion". All the router does is update
// the router variable in the store, all actions/mutations come from watching
// this store variable
// The line "sync(store, router)" connects the router to the store
const routes = [
  // { path: '/foo', component: Foo },
  // { path: '/bar', component: Bar }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const router = new Router({
  // Removes the "#" from the URL, making them look "normal". This also requires server configuration to
  // work correctly (e.g. a .htaccess file for an Apache server). Server config is located in <repo dir>/server-config
  mode: 'history',
  routes // short for routes: routes
})