import { mount } from 'enzyme';

import CalcOhmsLaw from 'pages/calculators/electronics/basics/ohms-law'

describe('calc-ohms-law-tests', () => {
  it('changing values works', () => {
    const wrapper = mount(<CalcOhmsLaw />)
    let voltageInput = wrapper.find('input[name="voltage_V"]')
    let currentInput = wrapper.find('input[name="current_A"]')
    let resistanceInput = wrapper.find('input[name="resistance_Ohms"]')

    expect(voltageInput.props().value).toBe("12")
    expect(currentInput.props().value).toBe("1")
    expect(resistanceInput.props().value).toBe("12.00")

    voltageInput.at(0).instance().value = '6'
    voltageInput.simulate('change')    
    expect(wrapper.find('input[name="resistance_Ohms"]').props().value).toBe("6.000")
  });
});