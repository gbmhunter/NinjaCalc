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

// Setup v-select component
import vSelect from 'vue-select'
Vue.component(vSelect)

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

import VJstree from 'vue-jstree'
Vue.component('v-jstree', VJstree)

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

// =========================================== //
// ===== TREE VIEW COMPONENT REGISTRATION ==== //
// =========================================== //
import TreeView from 'misc/TreeView/TreeView'
Vue.component('tree-view', TreeView)

import TreeItem from 'misc/TreeView/TreeItem'
Vue.component('tree-item', TreeItem)

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

