import StandardResistanceFinder from '@/misc/StandardResistanceFinder/StandardResistanceFinder'

describe('Users factory', function () {
  var standardResistanceFinder = new StandardResistanceFinder()

  it('has a dummy spec to test 2 + 2', function () {
    // An intentionally failing test. No code within expect() will never equal 4.
    var res = standardResistanceFinder.find(101, standardResistanceFinder.eSeriesOptions.E6, standardResistanceFinder.searchMethods.CLOSEST)
    expect(res).toEqual(100)
  })
})
