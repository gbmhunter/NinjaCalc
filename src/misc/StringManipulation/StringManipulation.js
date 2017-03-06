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
}
export let stringManipulation = new StringManipulation()
