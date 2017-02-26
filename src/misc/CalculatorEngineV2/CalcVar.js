export default class CalcVar {

  constructor (initObj) {
    this.name = initObj.name
    this.typeEqn = initObj.typeEqn
    this.eqn = initObj.eqn

    this.units = initObj.units
    this.selUnit = initObj.selUnit

    this.calc = initObj.calc

    this.rawVal = initObj.rawVal

    // We can now work out the initial displayed value
    if (this.rawVal === '') {
      this.dispVal = ''
    } else {
      this.dispVal = this.rawVal / this.selUnit.value
    }

    console.log('calcVar =')
    console.log(this)
  }

  onDispValChange = () => {
    console.log('onDispValChange() called.')
    console.log('this.dispVal =' + this.dispVal)

    this.rawVal = this.dispVal * this.selUnit
    console.log('this.rawVal = ' + this.rawVal)

    this.calc.reCalcOutputs()
  }

  onUnitChange = () => {
    console.log('onUnitsChange() called.')

    if (this.typeEqn() === 'input') {
      // Recalculate raw value from displayed value
      this.rawVal = this.dispVal * this.selUnit
    }

    this.calc.reCalcOutputs()
  }

  reCalc = () => {
    console.log('reCalc() called.')

    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    this.rawVal = this.eqn()
    this.dispVal = this.rawVal / this.selUnit
  }

}
