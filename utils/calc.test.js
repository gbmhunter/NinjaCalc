const { default: CalcHelper } = require('./calc-helper')

import { Calc } from '~/utils/calc'
import { CalcVar } from '~/utils/calc-var'

test('constructor', () => {
  const myCalc = new Calc({
    calcVars: {
      voltage: new CalcVar({
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
    },
    eqFn: () => {
      // Dummy function
    }
  })
  expect(myCalc).toHaveProperty('calcVars')
  expect(myCalc).toHaveProperty('eqFn')
})