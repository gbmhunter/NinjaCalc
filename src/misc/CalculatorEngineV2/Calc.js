export default class Calc {

  constructor () {
    this.calcVars = []
  }

  addVar = (calcVar) => {
    this.calcVars.push(calcVar)
  }

  getVar = (name) => {
//      console.log('getVar() called with name = ' + name)
    var variable = this.calcVars.find((element) => {
      return element.name === name
    })

    if (typeof variable === 'undefined') {
      throw new Error('Requested variable "' + name + '" does not exist in calculator.')
    }

    return variable
  }

  reCalcOutputs = () => {
    console.log('reCalcOutputs() called.')
    console.log(this)
    for (let calcVar of this.calcVars) {
      console.log(calcVar)
      if (calcVar.typeEqn() === 'output') {
        console.log('Recalculating "' + calcVar.name + '".')
        calcVar.reCalc()
      }
    }
  }
}
