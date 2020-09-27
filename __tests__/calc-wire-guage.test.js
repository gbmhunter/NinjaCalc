import { mount } from 'enzyme'

import { getValue, setValue } from 'utils/testing-utils'

import CalcWireGuage from 'pages/calculators/electronics/cabling/wire-guage-calculator'

describe('calc-ohms-law-tests', () => {
  it('is mountable', () => {
    const wrapper = mount(<CalcWireGuage />)
  })

  it('changing values works', () => {
    const wrapper = mount(<CalcWireGuage />)

    // Check default values
    expect(getValue(wrapper, 'voltageDc_V')).toBe('12')

    // Now set all values explicitly
    setValue(wrapper, 'voltageDc_V', '5')
    setValue(wrapper, 'voltageDrop_perc', '2')
    setValue(wrapper, 'cableLength_m', '5')
    setValue(wrapper, 'current_A', '3')
    setValue(wrapper, 'conductorMaterial', 'Copper')
    expect(getValue(wrapper, 'guage_awg')).toBe(13)

    // Change the conductor material
    setValue(wrapper, 'conductorMaterial', 'Aluminium')
    expect(getValue(wrapper, 'guage_awg')).toBe(11)
  })
})