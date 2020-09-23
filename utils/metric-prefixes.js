
const prefixMap = new Map([
  [-4, 'f'],
  [-3, 'p'],
  [-3, 'n'],
  [-2, 'u'],
  [-1, 'm'],
  [0, ''],
  [1, 'k'],
  [2, 'M'],
  [3, 'G'],
  [4, 'T'],
  [5, 'P'],
])

/**
 * Makes sure the input string is a number, with no additional alphabetical
 * characters after a valid number (which isNaN() won't pick up on!).
 * 
 * @param {string} s String to test if numeric.
 */
function isNumeric(s) {
  return !isNaN(s - parseFloat(s));
}

export class MetricPrefixes {
  static numToString(num, precision) {  
    // console.log('numToString() called with num=' + num)  
    const origNum = num // Save for later
    // Need to deal with positive numbers only, we'll add the
    // negative back in later
    num = Math.abs(num)
    let log1000 = Math.floor(Math.log10(num)/3)
    // console.log(log1000)
    num = num/(Math.pow(1000, log1000))
    const prefix = prefixMap.get(log1000)
    // console.log('prefix=' + prefix)
    let output = null
    if (prefix) {
      output = num.toPrecision(precision) + prefix
      // console.log('output=' + output)
      if(origNum < 0)
        output = '-' + output
    } else {
      // No metric prefix found in input, just do a standard number
      // to string conversion
      output = origNum.toPrecision(precision)
    }
    return output
  } 

  static stringToNum(string) {
    const lastChar = string.charAt(string.length - 1)
    let foundPrefix = null
    for (let prefix of prefixMap) {
      if (prefix[1] == lastChar) {
        foundPrefix = prefix
      }
    }    
    if (!foundPrefix) {
      // No metric prefix found, treat entire string as a number
      if (!isNumeric(string))
        return NaN  
      
      return parseFloat(string)
    }
    const numberStr = string.slice(0, string.length - 1)
    if (!isNumeric(numberStr))
        return NaN 
    const numberUnscaled = parseFloat(numberStr)
    const numberScaled = numberUnscaled * Math.pow(1000, foundPrefix[0])
    return numberScaled
  }
}