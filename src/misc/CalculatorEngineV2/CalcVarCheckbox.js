import CalcVar from './CalcVar'

export class CalcVarCheckbox extends CalcVar {
  constructor (initObj) {
    // Checkboxes are always inputs
    initObj.typeEqn = () => {
      return 'input'
    }
    super(initObj)

    this.val = initObj.defaultVal
    this.helpText = initObj.helpText
  }

  /**
   * Designed to be called by vue after the bound this.val is changed when
   * the user selects something in the combobox.
   */
  onValChange = () => {
    console.log('CalcVarCheckbox.onValChange() called. this.val = ' + this.val)
    this.triggerReCalcOutputsAndValidate()
  }

  getVal = () => {
    return this.val
  }

  validate = () => {
    // Do nothing
  }
}
