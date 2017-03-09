export default class PresetValidators {
  constructor (name) {
    this.name = name
  }
  toString () {
    return `PresetValidators.${this.name}`
  }
}
PresetValidators.IS_NUMBER = new PresetValidators('IS_NUMBER')
PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO = new PresetValidators('IS_GREATER_OR_EQUAL_TO_ZERO')
PresetValidators.IS_GREATER_THAN_ZERO = new PresetValidators('IS_GREATER_THAN_ZERO')
