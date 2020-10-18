import { mount } from 'enzyme'

import { getValue, setValue } from 'utils/testing-utils'

import CalcOhmsLaw from 'pages/calculators/electronics/basics/ohms-law'

describe('calc-ohms-law-tests', () => {
  it('changing values works', () => {
    const wrapper = mount(<CalcOhmsLaw />)
    let voltageInput = wrapper.find('input[name="voltage_V"]')
    let currentInput = wrapper.find('input[name="current_A"]')
    let resistanceInput = wrapper.find('input[name="resistance_Ohms"]')

    expect(getValue(wrapper, 'voltage_V')).toBe("12")
    expect(getValue(wrapper, 'current_A')).toBe("1")
    expect(getValue(wrapper, 'resistance_Ohms')).toBe("12.00")

    setValue(wrapper, 'voltage_V', '6')
    expect(getValue(wrapper, 'resistance_Ohms')).toBe("6.000")             
  });
});