export default class CalcVar {

  constructor (initObj) {
    console.log('CalcVar.constructor() called with name = ')
    console.log(initObj.name)
    this.name = initObj.name

    console.log('voltageInput =')
    console.log(initObj.valueInput)

    // ============================================ //
    // ========= UI INPUT FOR VALUE SETUP ========= //
    // ============================================ //
    if (typeof initObj.uiInputValue === 'undefined') {
      throw new Error('Valid UI input element for value was not provided to calculator variable "' + this.name + '".')
    }
    this.valueInput = initObj.uiInputValue

    this.valueInput.addEventListener('keyup', () => {
      this.displayValChanged()
    })

    // ============================================ //
    // ========= UI SELECT FOR UNITS SETUP ======== //
    // ============================================ //
    if (typeof initObj.uiSelectUnits === 'undefined') {
      throw new Error('Valid UI select element for units was not provided to calculator variable "' + this.name + '".')
    }
    this.uiSelectUnits = initObj.uiSelectUnits

    this.units = initObj.units

    // Populate unit dropdowns
    for (let unit of this.units) {
      var option = document.createElement('option')
      option.text = unit.text
      this.uiSelectUnits.add(option)
    }

    // Set the default unit
    var selUnitObj = initObj.units.find((element) => {
      return element.text === initObj.selUnit
    })
    if (typeof selUnitObj === 'undefined') {
      throw new Error('Selected unit "' + initObj.selUnit + '" cannot be found in units array.')
    }
    this.selUnit = selUnitObj

    this.rawVal = initObj.initRawVal

    // We can now work out the initial displayed value
    this.dispVal = this.rawVal / this.selUnit.multi

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
    this.dispVal = this.rawVal * this.selUnit.multi
  }

  displayValChanged () {
    this.dispVal = this.valueInput.value
    console.log('this.dispVal = ' + this.dispVal)

    this.rawVal = this.dispVal * this.selUnit.multi
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
    this.dispVal = this.rawVal * this.selUnit.multi

    // Update input that user sees
    this.valueInput.value = this.dispVal
  }
}
