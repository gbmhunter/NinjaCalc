export class Unit {
  constructor (initObj) {
    // console.log('Unit.constructor() called.')

    if (this.constructor === Unit) {
      throw new TypeError('Abstract class "Unit" cannot be instantiated directly.')
    }

    // The name is used both as the binding value and the displayed text
    // with a vue select UI object.
    if (!initObj.name) throw new Error('Please provide a unit name via initObj.name to Unit.constructor().')
    this.name = initObj.name
  }
}
