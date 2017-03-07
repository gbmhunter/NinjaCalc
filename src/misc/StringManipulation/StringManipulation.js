class StringManipulation {
  formatHex = (hexString, numBits) => {
    // Convert to upper-case (bigInt.toString() returns lower-case hex characters)
    hexString = hexString.toUpperCase()
    // Now pad with zero's until it is the same width as the polynomial (in hex)
    var numHexChars = Math.ceil(numBits / 4)
    while (hexString.length < numHexChars) {
      hexString = '0' + hexString
    }
    return hexString
  }

  isHex = (inputString) => {
    var regExp = /^[0-9A-Fa-f]+$/

    if (typeof inputString !== 'string') {
      return false
    }

    if (regExp.test(inputString)) {
      return true
    } else {
      return false
    }
  }
}
export let stringManipulation = new StringManipulation()
