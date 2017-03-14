import {Unit} from './Unit'

export class UnitFunc extends Unit {
  constructor (initObj) {
    super(initObj)
    this.toUnit = initObj.toUnit
    this.fromUnit = initObj.fromUnit
  }
}
