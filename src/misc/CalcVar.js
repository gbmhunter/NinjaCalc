export default class CalcVar {

  constructor (initObj) {
    console.log('CalcVar.constructor() called with name = ')
    console.log(initObj.name)
    this.name = initObj.name

    console.log('initRawVal =')
    console.log(initObj.initRawVal)
    this.rawVal = initObj.initRawVal

    console.log('units =')
    console.log(initObj.units)
    this.units = initObj.units

    console.log('selUnit =')
    console.log(initObj.selUnit)

    var selUnitObj = initObj.units.find((element) => {
      return element.text === initObj.selUnit
    })

    if (typeof selUnitObj === 'undefined') {
      throw new Error('Selected unit "' + initObj.selUnit + '" cannot be found in units array.')
    }

    this.selUnit = selUnitObj.value

    // We can now work out the initial displayed value
    this.dispVal = this.rawVal / this.selUnit
  }
}
