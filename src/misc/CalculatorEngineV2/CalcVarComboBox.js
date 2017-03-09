import CalcVar from './CalcVar'

export class CalcVarComboBox extends CalcVar {
  constructor (initObj) {
    initObj.typeEqn = () => {
      return 'input'
    }
    super(initObj)

    this.options = initObj.options
    this.val = initObj.defaultVal
  }

  /**
   * Designed to be called by vue after the bound this.val is changed when
   * the user selects something in the combobox.
   */
  onValChange = () => {
    console.log('onValChange() called. this.val = ' + this.val)
    this.triggerReCalcOutputsAndValidate()
  }

  getVal = () => {
    return this.val
  }
}
