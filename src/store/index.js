import Vue from 'vue'
import Vuex from 'vuex'
import core from './modules/core'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    showLeftSideBar: false,
    showCalculatorSelectionOverlay: false,
    activeTabId: ''
  },
  mutations: {
    showLeftSideBar (state, payload) {
      state.showLeftSideBar = payload.trueFalse
    },
    showCalculatorSelectionOverlay (state, payload) {
      state.showCalculatorSelectionOverlay = payload.trueFalse
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
        state.core.openCalcs.forEach((calc, index) => {
          console.log('calc =')
          console.log(calc)
          if (calc.uniqueId === payload.uniqueId) {
            console.log('Calculator found!')
            let nextCalc = state.core.openCalcs[index + 1] || state.core.openCalcs[index - 1]
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
      state.core.openCalcs = state.core.openCalcs.filter(calc => calc.uniqueId !== payload.uniqueId)
    },
    setSearchText (state, payload) {
      state.searchText = payload
    },
    setLastCalcAsActive (state, payload) {
      console.log('setLastCalcAsActive() called.')
      state.activeTabId = state.core.openCalcs[state.core.openCalcs.length - 1].uniqueId
    }
  },
  actions: {},
  modules: {
    core
  }
})
