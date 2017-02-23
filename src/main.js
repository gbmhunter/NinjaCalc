// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

Vue.use(Vuex)

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
Vue.use(VueMaterial)

import BootstrapVue from 'bootstrap-vue'
// Globally register bootstrap-vue components
Vue.use(BootstrapVue)
// Loading of bootstrap CSS is required for BootstrapVue to work correctly
// import './assets/bootstrap.css'

/* eslint-disable no-unused-vars */
const store = new Vuex.Store({
  state: {
    count: 0,
    showLeftSideBar: false,
    showCalculatorSelectionOverlay: false,
    availableCalcs: [],
    openCalcs: []
  },
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    },
    showLeftSideBar (state, payload) {
      state.showLeftSideBar = payload.trueFalse
    },
    showCalculatorSelectionOverlay (state, payload) {
      state.showCalculatorSelectionOverlay = payload.trueFalse
    },
    openCalculator (state, payload) {
      console.log('openCalculator() called. payload.name = "' + payload.name + '".')
      state.openCalcs.push({
        name: payload.name,
        componentName: payload.componentName
      })
    },
    registerCalc (state, payload) {
      state.availableCalcs.push({ name: payload.name, componentName: payload.componentName, imagePath: payload.imagePath })
    }
  }
})

// ROOT INSTANCE
/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})

