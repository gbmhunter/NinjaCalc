export class Unit {
  constructor (initObj) {
    // console.log('Unit.constructor() called.')

    if (this.constructor === Unit) {
      throw new TypeError('Abstract class "Unit" cannot be instantiated directly.')
    }

    if (!initObj.name) throw new Error('Please provide a unit name via initObj.name to Unit.constructor().')
    this.name = initObj.name
    // To support vue binding with an select input, we duplictae the text as the "value"
    this.value = this.name
  }
}
