import CalcVar from './CalcVar'
console.log(CalcVar)
/**
 * A calculator variable which accepts a generic string.
 */
export class CalcVarString extends CalcVar {
  constructor (initObj) {
    super(initObj)
    this.test = 'test'
  }
}
