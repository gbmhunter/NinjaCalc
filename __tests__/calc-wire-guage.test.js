import { mount } from 'enzyme'

import { getValue, setValue } from 'utils/testing-utils'

import CalcWireGauge from 'pages/calculators/electronics/cabling/wire-gauge-calculator'

describe('calc-ohms-law-tests', () => {
  it('is mountable', () => {
    const wrapper = mount(<CalcWireGauge />)
  })

  it('changing values works', () => {
    const wrapper = mount(<CalcWireGauge />)

    // Check default values
    expect(getValue(wrapper, 'voltageDc_V')).toBe('12')

    // Now set all values explicitly
    setValue(wrapper, 'voltageDc_V', '5')
    setValue(wrapper, 'voltageDrop_perc', '2')
    setValue(wrapper, 'cableLength_m', '5')
    setValue(wrapper, 'current_A', '3')
    setValue(wrapper, 'conductorMaterial', 'Copper')
    expect(getValue(wrapper, 'gauge_awg')).toBe(13)

    // Change the conductor material
    setValue(wrapper, 'conductorMaterial', 'Aluminium')
    expect(getValue(wrapper, 'gauge_awg')).toBe(11)
  })
})