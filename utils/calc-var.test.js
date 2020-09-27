import { CalcVar } from '~/utils/calc-var'

test('constructor-numeric', () => {
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
    },
    helpText: 'Test help text.',
  })
  expect(myCalcVar.name).toBe('test')
  expect(myCalcVar.type).toBe('numeric')
  expect(myCalcVar.direction).toBe('input')
  expect(myCalcVar.dispVal).toBe('5.0')
  expect(myCalcVar.units).toStrictEqual([['V', 1e0]])
  expect(myCalcVar.metricPrefixes).toBe(true)
  expect(myCalcVar.sigFig).toBe(4)
  expect(myCalcVar.validation).toHaveProperty('fns')
  expect(myCalcVar.helpText).toBe('Test help text.')
})

test('constructor-select', () => {
  const myCalcVar = new CalcVar({
    name: 'test',
    type: 'select',
    direction: 'input',    
    options: [
      'Option 1',
      'Option 2',
    ],
    selOption: 'Option 2',
    validation: {
      fns: [
        () => {}
      ]
    },
    helpText: 'Test help text.',
  })
  expect(myCalcVar.name).toBe('test')
  expect(myCalcVar.type).toBe('select')
  expect(myCalcVar.direction).toBe('input')
  expect(myCalcVar.options).toEqual(
    [
      'Option 1',
      'Option 2',
    ]
  )
  expect(myCalcVar.selOption).toBe('Option 2')
  expect(myCalcVar.validation).toHaveProperty('fns')
  expect(myCalcVar.helpText).toBe('Test help text.')
})