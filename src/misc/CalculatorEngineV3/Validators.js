export default class Validators {
  IsCoordinate (value) {
    console.log('IsCoordinate() called with value = ' + value)

    // Split string by commas
    var partsOfString = value.split(',')
    if (partsOfString.length !== 2) {
      return false
    }
    return true
  }
  IsNumber (value) {
    console.log('isNumber() called with value = ' + value)
    return !isNaN(value)
  }
}
