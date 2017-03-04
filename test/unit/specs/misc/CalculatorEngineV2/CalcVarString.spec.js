import { CalcVarString } from 'src/misc/CalculatorEngineV2/CalcVarString'

describe('CalcVarString tests.', function () {
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

  it('Name should be assigned correctly.', function () {
    expect(calcVarString.name).to.equal('input')
  })
})
