import { mount } from 'enzyme'

import { getValue, setValue } from 'utils/testing-utils'

import Calc555TimerAstableRtRbC from 'pages/calculators/electronics/ics/555-timer-astable-rt-rb-c'

describe('555-timer-astable-rt-rb-c-tests', () => {
  it('is mountable', () => {
    const wrapper = mount(<Calc555TimerAstableRtRbC />)
  })

  it('changing values works', () => {
    const wrapper = mount(<Calc555TimerAstableRtRbC />)

    // Check default values
    expect(getValue(wrapper, 'period_s')).toBe('100u')
    expect(getValue(wrapper, 'timeHigh_s')).toBe('60.0u')
    expect(getValue(wrapper, 'timeLow_s')).toBe('40.0u')
    expect(getValue(wrapper, 'r1_Ohms')).toBe('5.77k')
    expect(getValue(wrapper, 'r2_Ohms')).toBe('2.89k')

    // Now set all values explicitly
    // setValue(wrapper, 'voltageDc_V', '5')
    // setValue(wrapper, 'voltageDrop_perc', '2')
    // setValue(wrapper, 'cableLength_m', '5')
    // setValue(wrapper, 'current_A', '3')
    // setValue(wrapper, 'conductorMaterial', 'Copper')
    // expect(getValue(wrapper, 'gauge_awg')).toBe(13)

    // // Change the conductor material
    // setValue(wrapper, 'conductorMaterial', 'Aluminium')
    // expect(getValue(wrapper, 'gauge_awg')).toBe(11)
  })
})