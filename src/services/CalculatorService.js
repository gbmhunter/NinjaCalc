import Vue from 'vue'

class CalculatorService {
  constructor (name) {
    this.name = name

    this.calculators = []
  }

  registerCalc (calculator) {
    console.log('CalculatorService.registerCalc() called with calculator =')
    console.log(calculator)

    this.calculators.push(calculator)

    // Register Vue component
    Vue.component(calculator.mainView.name, calculator.mainView)
  }

  setupStore (store) {
    console.log('CalculatorService.setupStore() called.')

    console.log('this.calculators = ')
    console.log(this.calculators)

    for (var calculator of this.calculators) {
      console.log('calculator = ')
      console.log(calculator)

      store.commit('registerCalc', calculator)
    }
  }
}

export var CalculatorServiceSingleton = (function () {
  var instance

  function createInstance () {
    /* eslint-disable no-new-object */
    var object = new CalculatorService('I am the instance')
    return object
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    }
  }
})()