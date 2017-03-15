export default class StandardResistanceFinder {

  constructor () {
    // ============================================ //
    // ==================== ENUMS ================= //
    // ============================================ //
    this.eSeriesOptions = {
      E6: { value: 0, name: 'E6' },
      E12: { value: 1, name: 'E12' },
      E24: { value: 2, name: 'E24' },
      E48: { value: 3, name: 'E48' },
      E96: { value: 4, name: 'E96' },
      E192: { value: 5, name: 'E192' }
    }

    this.searchMethods = {
      CLOSEST: 0,
      CLOSEST_EQUAL_OR_HIGHER: 1,
      CLOSEST_EQUAL_OR_LOWER: 2
    }

    this.e24Values = [100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910, 1000]

    // Create E6 and E12 values from elements in E24 array
    this.e6Values = []
    this.e12Values = []
    var i
    for (i = 0; i < this.e24Values.length; i++) {
      if (i % 2 === 0) {
        this.e12Values.push(this.e24Values[i])
      }

      if (i % 4 === 0) {
        this.e6Values.push(this.e24Values[i])
      }
    }

    this.e192Values = [
      100, 101, 102, 104, 105, 106, 107, 109, 110, 111, 113, 114, 115, 117, 118, 120,
      121, 123, 124, 126, 127, 129, 130, 132, 133, 135, 137, 138, 140, 142, 143, 145,
      147, 149, 150, 152, 154, 156, 158, 160, 162, 164, 165, 167, 169, 172, 174, 176,
      178, 180, 182, 184, 187, 189, 191, 193, 196, 198, 200, 203, 205, 208, 210, 213,
      215, 218, 221, 223, 226, 229, 232, 234, 237, 240, 243, 246, 249, 252, 255, 258,
      261, 264, 267, 271, 274, 277, 280, 284, 287, 291, 294, 298, 301, 305, 309, 312,
      316, 320, 324, 328, 332, 336, 340, 344, 348, 352, 357, 361, 365, 370, 374, 379,
      383, 388, 392, 397, 402, 407, 412, 417, 422, 427, 432, 437, 442, 448, 453, 459,
      464, 470, 475, 481, 487, 493, 499, 505, 511, 517, 523, 530, 536, 542, 549, 556,
      562, 569, 576, 583, 590, 597, 604, 612, 619, 626, 634, 642, 649, 657, 665, 673,
      681, 690, 698, 706, 715, 723, 732, 741, 750, 759, 768, 777, 787, 796, 806, 816,
      825, 835, 845, 856, 866, 876, 887, 898, 909, 920, 931, 942, 953, 965, 976, 988
    ]

    // Create E6 and E12 values from elements in E24 array
    this.e48Values = []
    this.e96Values = []
    for (i = 0; i < this.e192Values.length; i++) {
      if (i % 2 === 0) {
        this.e96Values.push(this.e192Values[i])
      }

      if (i % 4 === 0) {
        this.e48Values.push(this.e192Values[i])
      }
    }

    // console.log('StandardResistanceFinder() finished. this =')
    // console.log(this)
  }

  find = (desiredResistance, eSeries, searchMethod) => {
    console.log('find() called with desiredResistance = ' + desiredResistance)
    // console.log('eSeries =')
    // console.log(eSeries)
    // console.log('and searchMethod = ')
    // console.log(searchMethod.name)

    if (!eSeries) throw new Error('eSeries variable provided to StandardResistanceFinder.find() must be a valid object.')

    // Check for special case where desired resistance is 0. Strictly speaking, this does not belong
    // in any E-series, but 0R links are common place so we will return 0.0 anyway.
    if (desiredResistance === 0.0) {
      return 0.0
    }

    var selectedRange = []

    // Find out what resistance series was selected
    switch (eSeries.value) {
      case this.eSeriesOptions.E6.value:
        selectedRange = this.e6Values
        break
      case this.eSeriesOptions.E12.value:
        selectedRange = this.e12Values
        break
      case this.eSeriesOptions.E24.value:
        selectedRange = this.e24Values
        break
      case this.eSeriesOptions.E48.value:
        selectedRange = this.e48Values
        break
      case this.eSeriesOptions.E96.value:
        selectedRange = this.e96Values
        break
      case this.eSeriesOptions.E192.value:
        selectedRange = this.e192Values
        break
      default:
        throw new Error('Provided eSeriesOption "' + eSeries.name + '" is not supported.')
    }
    // console.log('selectedRange =')
    // console.log(selectedRange)

    var order = this.findOrder(desiredResistance) - 2
    // console.log('order = ' + order)

    var scaledDesiredResistance = this.scaleWrtOrder(desiredResistance, order)
    // console.log('scaledDesiredResistance = ' + scaledDesiredResistance)

    var closestScaledResistance = this.findClosestMatch(scaledDesiredResistance, selectedRange, searchMethod)
    // console.log('closestScaledResistance = ' + closestScaledResistance)

    var scaleFactor = Math.pow(10, order)
    // console.log('scaleFactor = ' + scaleFactor)

    var closestResistance = closestScaledResistance * scaleFactor
    // console.log('closestResistance = ' + closestResistance)

    return closestResistance
  }

  /**
   * Finds the order of magnitude of a given resistance.
   * e.g. if var in range 1-10, order = 0, if var in range 10-100, order = 1
   * @param desRes The resistance you wish to find the magnitude of.
   * @return The magnitude of the resistance.
   */
  findOrder = (desiredResistance) => {
    var order = Math.log10(desiredResistance)
    order = Math.floor(order)
    return order
  }

  scaleWrtOrder = (desiredResistance, order) => {
    return desiredResistance / Math.pow(10, order)
  }

  findClosestMatch = (val, array, searchMethod) => {
    var i = 0

    switch (searchMethod) {
      case this.searchMethods.CLOSEST:
        // Iterate through array until we hit the first element which is bigger than the value we are
        // trying to find.
        // NOTE: Start of 2nd element of array!
        i = 1
        while (true) {
          if (array[i] > val) {
            break
          }

          if (i === array.length - 1) {
            break
          }
          i++
        }

        // At this point either:
        // 1) We have stopped somewhere in the middle of the array. val will be higher than array[i-1]
        //    and lower than array[i]. We need to find which one is closer (based on percentage difference)
        // 2) We have stopped either on the second or last element of the array. If it is the second, val will
        //    be closest to array[i-1], if it is the last, val will be closest to array[i].
        // console.log('Stopped when i = ' + i)
        // console.log('Closest value 1 = ' + array[i - 1])
        // console.log('Closest value 2 = ' + array[i])

        var lowerPercDiff = ((val - array[i - 1]) / array[i - 1]) * 100.0
        // console.log('Percentage diff 1 = ' + lowerPercDiff)
        var higherPercDiff = ((val - array[i]) / array[i]) * 100.0
        // console.log('Percentage diff 2 = ' + higherPercDiff)

        if (Math.abs(lowerPercDiff) < Math.abs(higherPercDiff)) {
          return array[i - 1]
        } else {
          return array[i]
        }
      case this.searchMethods.CLOSEST_EQUAL_OR_LOWER:
        // console.log('Finding closest equal or lower value to "' + val + '" in array =')
        // console.log(array)

        // First make sure there is a lower value in the array
        if (array[0] > val) {
          throw new Error('StandardResistanceFinder.Find() called with searchMethod = CLOSEST_EQUAL_OR_LOWER, but there way no value in the array lower than the provided value of ' + val)
        }

        i = 1
        while (i < array.length) {
          if (array[i] > val) {
            // We have found the first value in the array which is bigger than the value, so the closest smaller value must of been the value before this
            return array[i - 1]
          }
          i++
        }
        break

      case this.searchMethods.CLOSEST_EQUAL_OR_HIGHER:

        i = 0
        while (i < array.length) {
          if (array[i] >= val) {
            // We have found the first value in the array which is bigger than the value, so the closest smaller value must of been the value before this
            return array[i]
          }
          i++
        }

        // Special case here where the first larger number is the first number of the next series
        throw new Error('StandardResistanceFinder.Find() called with searchMethod = CLOSEST_EQUAL_OR_HIGHER, but there was no value in the array which was equal of higher than the provided value of ' + val)
    }

    throw new Error('Code reached invalid place. Case must not of been handled correctly in switch statement.')
  }
}
