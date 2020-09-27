export function getValue(wrapper, calcVarName) {
  return wrapper.find('input[name="' + calcVarName + '"]').props().value
}

export function setValue(wrapper, calcVarName, value) {
  let component = wrapper.find('input[name="' + calcVarName + '"]')
  component.at(0).instance().value = value
  component.simulate('change')    
}