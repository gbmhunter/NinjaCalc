export default class Calculator {

  constructor () {
    console.log('Calculator.constructor() called.')

    this.vars = []
  }

  addVariable (variable) {
    this.vars.push(variable)
  }

  getVar (name) {
    var variable = this.vars.find((element) => {
      return element.name === name
    })

    if (typeof variable === 'undefined') {
      throw new Error('Requested variable "' + name + '" does not exist in calculator.')
    }

    return variable
  }
}
