// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

Vue.use(Vuex)

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

// =========================================== //
// ==== CALCULATOR COMPONENT REGISTRATION ==== //
// =========================================== //
import CalcValue from 'misc/CalculatorEngineV2/view/CalcValue'
Vue.component('calc-value', CalcValue)
import CalcValueAndUnit from 'misc/CalculatorEngineV2/view/CalcValueAndUnit'
Vue.component('calc-value-and-unit', CalcValueAndUnit)
import CalcUnits from 'misc/CalculatorEngineV2/view/CalcUnits'
Vue.component('calc-units', CalcUnits)
import CalcVarString from 'src/misc/CalculatorEngineV2/view/CalcVarString'
Vue.component('calc-var-string', CalcVarString)
import CalcVarCheckbox from 'src/misc/CalculatorEngineV2/view/CalcVarCheckbox'
Vue.component('calc-var-checkbox', CalcVarCheckbox)

/* eslint-disable no-unused-vars */
const store = new Vuex.Store({
  state: {
    count: 0,
    showLeftSideBar: false,
    showCalculatorSelectionOverlay: false,

    // Complete list of calculators that the user can open.
    // These are presented to the user, but filtered first.
    availableCalcs: [],

    // This is updated whenever the search text is changed.
    filteredAvailableCalcs: [],
    openCalcs: [],
    activeTabId: '',
    searchText: ''
  },
  mutations: {
    showLeftSideBar (state, payload) {
      state.showLeftSideBar = payload.trueFalse
    },
    showCalculatorSelectionOverlay (state, payload) {
      state.showCalculatorSelectionOverlay = payload.trueFalse
    },
    registerCalc (state, payload) {
      state.availableCalcs.push(payload)
    },
    openCalculator (state, payload) {
      // Find a unique ID to use
      var maxId = 0
      state.openCalcs.forEach((calc, index) => {
        if (calc.uniqueId > maxId) {
          maxId = calc.uniqueId
        }
      })
      const newUniqueId = maxId + 1

      state.openCalcs.push({
        name: payload.name,
        componentName: payload.componentName,
        // Unique ID is used as a unique tab ID
        uniqueId: newUniqueId
      })
    },
    setNewCalcAsOpenTab (state, payload) {
      // console.log('setNewCalcAsOpenTab() called with payload =')
      // console.log(payload)
      state.activeTabId = state.openCalcs[state.openCalcs.length - 1].uniqueId
    },
    closeCalculator (state, payload) {
      console.log('closeCalculator() called with payload.uniqueId = ' + payload.uniqueId)
      if (!payload.uniqueId) {
        throw new Error('Please provide payload.uniqueId to closeCalculator().')
      }
      // We need to search through the open calculators and find the one which matches the
      // provided ID
      if (state.activeTabId === payload.uniqueId) {
        console.log('Closing currently active tab.')
        // Since the user wants to close the currently active tab, we need to find
        // the next best calculator tab to set as the active tab
        state.openCalcs.forEach((calc, index) => {
          console.log('calc =')
          console.log(calc)
          if (calc.uniqueId === payload.uniqueId) {
            console.log('Calculator found!')
            let nextCalc = state.openCalcs[index + 1] || state.openCalcs[index - 1]
            console.log('nextCalc =')
            console.log(nextCalc)
            if (nextCalc) {
              state.activeTabId = nextCalc.uniqueId
            }
          }
        })
      }

      // Now that we have selected the next best calculator that is going to remain open,
      // close the requested calculator by removing it from the openCalcs array
      state.openCalcs = state.openCalcs.filter(calc => calc.uniqueId !== payload.uniqueId)
    },
    setSearchText (state, payload) {
      state.searchText = payload
    },
    updateFilteredAvailableCalcs (state, payload) {
      // Update the filtered available calculators. If the search text is '' (i.e.
      // empty), return all the calculators.
      if (state.searchText === '') {
        state.filteredAvailableCalcs = state.availableCalcs
        return
      }
      state.filteredAvailableCalcs = state.availableCalcs.filter(calc => {
        // Create regex pattern from search text
        var regex = new RegExp(state.searchText, 'gi')
        // Search in calculator title (display name)
        if (calc.displayName.match(regex)) return true
        // Search through the tags
        for (var tag of calc.tags) {
          if (tag.match(regex)) return true
        }
      })
    }
  },
  actions: {
    /**
     * Call this to register a calculator with the app. This is typically done at
     * start-up.
     * @param context
     * @param value     The calculator you wish to register.
     */
    registerCalc (context, value) {
      context.commit('registerCalc', value)
      context.commit('updateFilteredAvailableCalcs')
    },
    /**
     * This will set the search text, and also update the filteredAvailableCalcs variable,
     * depending on the search text.
     * @param context
     * @param value
     */
    setSearchText (context, value) {
      context.commit('setSearchText', value)
      context.commit('updateFilteredAvailableCalcs')
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

