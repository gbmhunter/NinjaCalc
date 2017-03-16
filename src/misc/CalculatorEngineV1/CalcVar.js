export default class CalcVar {

  constructor (initObj) {
    this.name = initObj.name

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
    // ================= UNITS SETUP ============== //
    // ============================================ //
    if (typeof initObj.uiSelectUnits === 'undefined') {
      throw new Error('Valid UI select element for units was not provided to calculator variable "' + this.name + '".')
    }
    this.uiSelectUnits = initObj.uiSelectUnits

    // Attach listener to dropdown
    this.uiSelectUnits.addEventListener('change', () => {
      this.unitDropdownChanged()
    })

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

    // ============================================ //
    // ============== RAW/DISP VAL SETUP ========== //
    // ============================================ //
    this.rawVal = initObj.initRawVal

    // We can now work out the initial displayed value
    this.dispVal = this.rawVal / this.selUnit.multi

    // Save reference to calculator
    this.calc = initObj.calc

    this.eqn = initObj.eqn
    this.typeEqn = initObj.typeEqn
  }

  getRawVal () {
    return this.rawVal
  }

  setRawVal (value) {
    this.rawVal = value
    this.dispVal = this.rawVal * this.selUnit.multi
  }

  displayValChanged () {
    this.dispVal = this.valueInput.value

    this.rawVal = this.dispVal * this.selUnit.multi

    this.calc.reCalcOutputs()
  }

  unitDropdownChanged () {
    // Find unit object based of text in dropdown
    var selUnitObj = this.units.find((element) => {
      return element.text === this.uiSelectUnits.value
    })
    this.selUnit = selUnitObj

    if (this.typeEqn() === 'input') {
      // Recalculate raw value from displayed value
      this.rawVal = this.dispVal * this.selUnit.multi
    }

    this.calc.reCalcOutputs()
  }

  getDispVal () {
    return this.dispVal
  }

  reCalc = () => {
    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    this.rawVal = this.eqn()
    this.dispVal = this.rawVal / this.selUnit.multi

    // Update input that user sees
    this.valueInput.value = this.dispVal
  }
}
