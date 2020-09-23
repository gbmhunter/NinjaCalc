import { mount } from 'enzyme';

import CalcOhmsLaw from './index'

describe('calc-ohms-law-tests', () => {
  it('default values should be set', () => {
    const wrapper = mount(<CalcOhmsLaw />)    
    expect((wrapper.find('input[name="voltage"]')).props().value).toBe("12")
    expect((wrapper.find('input[name="current"]')).props().value).toBe("1")
    expect((wrapper.find('input[name="resistance"]')).props().value).toBe("12.00")
  });
});