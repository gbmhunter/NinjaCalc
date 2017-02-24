export default class CalcVar {

  constructor (initObj) {
    console.log('CalcVar.constructor() called with name = ')
    console.log(initObj.name)
    this.name = initObj.name

    console.log('voltageInput =')
    console.log(initObj.valueInput)
    this.valueInput = initObj.valueInput

    this.valueInput.addEventListener('keyup', () => {
      this.displayValChanged()
    })

    this.rawVal = initObj.initRawVal

    this.units = initObj.units

    var selUnitObj = initObj.units.find((element) => {
      return element.text === initObj.selUnit
    })

    if (typeof selUnitObj === 'undefined') {
      throw new Error('Selected unit "' + initObj.selUnit + '" cannot be found in units array.')
    }

    this.selUnit = selUnitObj.value

    // We can now work out the initial displayed value
    this.dispVal = this.rawVal / this.selUnit

    // Save reference to calculator
    this.calc = initObj.calc

    this.eqn = initObj.eqn
    this.typeEqn = initObj.typeEqn

    console.log('calcVar =')
    console.log(this)
  }

  getRawVal () {
    return this.rawVal
  }

  setRawVal (value) {
    console.log('setRawVal() called.')
    this.rawVal = value
    this.dispVal = this.rawVal * this.selUnit
  }

  displayValChanged () {
    this.dispVal = this.valueInput.value
    console.log('this.dispVal = ' + this.dispVal)

    this.rawVal = this.dispVal * this.selUnit
    console.log('this.rawVal = ' + this.rawVal)

    this.calc.reCalcOutputs()
  }

  getDispVal () {
    console.log('getDispVal() called.')
    return this.dispVal
  }

  reCalc = () => {
    console.log('reCalc() called.')

    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    this.rawVal = this.eqn()
    this.dispVal = this.rawVal * this.selUnit

    // Update input that user sees
    this.valueInput.value = this.dispVal
  }
}
