import { mount } from 'enzyme';

import CalcWireGuage from './index'

describe('calc-ohms-law-tests', () => {
  it('changing values works', () => {
    const wrapper = mount(<CalcWireGuage />)
    // let voltageInput = wrapper.find('input[name="voltage"]')
    // let currentInput = wrapper.find('input[name="current"]')
    // let resistanceInput = wrapper.find('input[name="resistance"]')

    // expect(voltageInput.props().value).toBe("12")
    // expect(currentInput.props().value).toBe("1")
    // expect(resistanceInput.props().value).toBe("12.00")

    // voltageInput.at(0).instance().value = '6'
    // voltageInput.simulate('change')    
    // expect(wrapper.find('input[name="resistance"]').props().value).toBe("6.000")
  });
});