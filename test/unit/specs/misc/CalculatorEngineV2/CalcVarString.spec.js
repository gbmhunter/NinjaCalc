import { CalcVarString } from 'src/misc/CalculatorEngineV2/CalcVarString'

describe('CalcVarString', function () {
  var calcVarString = new CalcVarString({
    name: 'input',
    typeEqn: () => {
        return 'input'
    },
    eqn: () => {},
    defaultVal: 'default input',
    validators: [ ],
    helpText: 'The textual input.'
  })

  it('E6 series test', function () {
    expect(true).to.equal(true)
  })
})
