import Vue from 'vue'

// vue-router used to SEO
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 1. Define route components.
// These can be imported from other files
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const router = new VueRouter({
  // Removes the "#" from the URL, making them look "normal". This also requires server configuration to
  // work correctly (e.g. a .htaccess file for an Apache server). Server config is located in <repo dir>/server-config
  mode: 'history',
  routes // short for routes: routes
})
