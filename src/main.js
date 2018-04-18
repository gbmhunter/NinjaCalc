// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/App/App'

/* eslint-disable no-unused-vars */

// vue-material is used for md-tooltips, which display
// calculator variable info
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
Vue.use(VueMaterial)

// BootstrapVue used for Buttons
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

// Setup v-select component
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

// KeenUI is used for the collapsable "Info"
// sections on each calculator
import KeenUI from 'keen-ui'
Vue.use(KeenUI)
import 'keen-ui/dist/keen-ui.css'

// v-tooltip is used for calculator variable tooltips
import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

// element UI component library
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

// =========================================== //
// ========== VUE GOOGLE MAPS PACKAGE ======== //
// =========================================== //
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBSBFQ3KuKEfQNXSAhQ1uhjVa1gXbHSlwk',
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})

// import VJstree from 'vue-jstree'
// Vue.component('v-jstree', VJstree)

import './style/style.css'

// =========================================== //
// ==== CALCULATOR COMPONENT REGISTRATION ==== //
// =========================================== //
import CalcValue from 'misc/CalculatorEngineV2/view/CalcValue.vue'
Vue.component('calc-value', CalcValue)
import CalcValueAndUnit from 'misc/CalculatorEngineV2/view/CalcValueAndUnit.vue'
Vue.component('calc-value-and-unit', CalcValueAndUnit)
import CalcUnits from 'misc/CalculatorEngineV2/view/CalcUnits.vue'
Vue.component('calc-units', CalcUnits)
import CalcVarString from 'src/misc/CalculatorEngineV2/view/CalcVarString.vue'
Vue.component('calc-var-string', CalcVarString)
import CalcVarCheckbox from 'src/misc/CalculatorEngineV2/view/CalcVarCheckbox.vue'
Vue.component('calc-var-checkbox', CalcVarCheckbox)
import VariableRowVerbose from 'src/misc/CalculatorEngineV2/view/VariableRowVerbose.vue'
Vue.component('variable-row-verbose', VariableRowVerbose)

// ============================================================================================= //
// ============================= REGISTER OUR CUSTOM VUE COMPONENTS ============================ //
// ============================================================================================= //

// =========================================== //
// ===== TREE VIEW COMPONENT REGISTRATION ==== //
// =========================================== //
import TreeView from 'misc/TreeView/TreeView'
Vue.component('tree-view', TreeView)

import TreeItem from 'misc/TreeView/TreeItem'
Vue.component('tree-item', TreeItem)

// PANEL COMPONENT
import Panel from 'misc/Panel/Panel'
Vue.component('panel', Panel)

// mn-button COMPONENT
import MnButton from 'misc/MnButton/MnButton'
Vue.component('mn-button', MnButton)

// =========================================== //
// ============= IMPORT VUEX STORE =========== //
// =========================================== //
import store from './store'

// =========================================== //
// ====== IMPORT ROUTER, SYNC WITH STORE ===== //
// =========================================== //
import { router } from './router'
import { sync } from 'vuex-router-sync'
sync(store, router)

// ROOT INSTANCE
/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App },
  router
})

