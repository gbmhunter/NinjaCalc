class CalculatorService {
  constructor (name) {
    this.name = name

    this.calculators = []
  }

  registerCalc (calculator) {
    console.log('CalculatorService.registerCalc() called with calculator =')
    console.log(calculator)

    this.calculators.push(calculator)
  }

  setupStore (store) {
    console.log('CalculatorService.setupStore() called.')

    console.log('this.calculators = ')
    console.log(this.calculators)

    for (var calculator of this.calculators) {
      console.log('calculator = ')
      console.log(calculator)

      store.commit('registerCalc', { name: calculator.displayName, componentName: calculator.name })
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
