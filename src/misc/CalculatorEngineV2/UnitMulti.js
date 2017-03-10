import {Unit} from './Unit'

export class UnitMulti extends Unit {
  constructor (initObj) {
    super(initObj)
    this.multi = initObj.multi
  }
}
