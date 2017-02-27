export default class PresetValidators {
  constructor (name) {
    this.name = name
  }
  toString () {
    return `PresetValidators.${this.name}`
  }
}
PresetValidators.IS_NUMBER = new PresetValidators('IS_NUMBER')
PresetValidators.IS_POSITIVE = new PresetValidators('IS_POSITIVE')
