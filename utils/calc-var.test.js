import { CalcVar } from '~/utils/calc-var'

test('constructor', () => {
  const myCalcVar = new CalcVar({
    name: 'test',
    type: 'numeric',
    direction: 'input',
    dispVal: '5.0',
    units: [
      ['V', 1e0],
    ],
    selUnit: 'V',
    metricPrefixes: true,
    sigFig: 4,
    validation: {
      fns: [
        () => {}
      ]
    }
  })
  expect(myCalcVar.name).toBe('test')
  expect(myCalcVar.type).toBe('numeric')
  expect(myCalcVar.direction).toBe('input')
  expect(myCalcVar.dispVal).toBe('5.0')
  expect(myCalcVar.units).toStrictEqual([['V', 1e0]])
  expect(myCalcVar.metricPrefixes).toBe(true)
  expect(myCalcVar.sigFig).toBe(4)
  expect(myCalcVar.validation).toHaveProperty('fns')
})