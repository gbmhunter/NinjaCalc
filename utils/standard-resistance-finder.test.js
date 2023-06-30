import { StandardResistanceFinder } from 'utils/standard-resistance-finder.js'

test('e24-99.0-closest', () => {
  let srf = new StandardResistanceFinder()
  let closestResistance = srf.find(99.0, srf.eSeriesOptions.E24, srf.searchMethods.CLOSEST)
  expect(closestResistance).toBeCloseTo(100.0)
})

test('e48-87.0-closest', () => {
  let srf = new StandardResistanceFinder()
  let closestResistance = srf.find(87.0, srf.eSeriesOptions.E48, srf.searchMethods.CLOSEST)
  expect(closestResistance).toBeCloseTo(86.6)
})

test('e96-1.005-closest', () => {
  let srf = new StandardResistanceFinder()
  let closestResistance = srf.find(1.005, srf.eSeriesOptions.E96, srf.searchMethods.CLOSEST)
  expect(closestResistance).toBeCloseTo(1.0)
})

test('e96-10.05-closest', () => {
  let srf = new StandardResistanceFinder()
  let closestResistance = srf.find(10.05, srf.eSeriesOptions.E96, srf.searchMethods.CLOSEST)
  expect(closestResistance).toBeCloseTo(10.0)
})

test('e96-99.0-closest', () => {
  let srf = new StandardResistanceFinder()
  let closestResistance = srf.find(99.0, srf.eSeriesOptions.E96, srf.searchMethods.CLOSEST)
  expect(closestResistance).toBeCloseTo(100.0)
})

test('e96-99.0-equal-or-higher', () => {
  let srf = new StandardResistanceFinder()
  let closestResistance = srf.find(99.0, srf.eSeriesOptions.E96, srf.searchMethods.CLOSEST_EQUAL_OR_HIGHER)
  expect(closestResistance).toBeCloseTo(100.0)
})

test('e96-100.05-closest', () => {
  let srf = new StandardResistanceFinder()
  let closestResistance = srf.find(100.5, srf.eSeriesOptions.E96, srf.searchMethods.CLOSEST)
  expect(closestResistance).toBeCloseTo(100.0)
})



