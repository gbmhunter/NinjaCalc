import {Unit} from './Unit'

export class UnitMulti extends Unit {
  constructor (initObj) {
    super(initObj)
    if (typeof initObj.multi !== 'number') throw new Error('Please provide a multiplier (number) via initObj.multi to UnitMulti.constructor(). this.name = ' + this.name)
    this.multi = initObj.multi
  }
}
