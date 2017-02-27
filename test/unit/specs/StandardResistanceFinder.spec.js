import StandardResistanceFinder from '../../../src/misc/StandardResistanceFinder/StandardResistanceFinder'

describe('Hello.vue', () => {
  it('should render correct contents', () => {
    var standardResistanceFinder = new StandardResistanceFinder()
    expect(standardResistanceFinder.find(101, standardResistanceFinder.eSeriesOptions.E6, standardResistanceFinder.searchMethods.CLOSEST).to.equal(100))
  })
})
