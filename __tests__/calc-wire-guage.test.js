import { mount } from 'enzyme'

import { getValue, setValue } from 'utils/testing-utils'

import CalcWireGuage from 'pages/calculators/electronics/cabling/wire-guage-calculator'

describe('calc-ohms-law-tests', () => {
  it('changing values works', () => {
    const wrapper = mount(<CalcWireGuage />)

    expect(getValue(wrapper, 'voltageDc_V')).toBe('12')
    setValue(wrapper, 'voltageDc_V', 5)
    expect(getValue(wrapper, 'guage_awg')).toBe(7)
  })
})