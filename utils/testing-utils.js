export function getValue(wrapper, calcVarName) {
  // Have to specify a parent .value class here because the value and unit input elements
  // both have the same name
  return wrapper.find('.value input[name="' + calcVarName + '"]').props().value
}

export function setValue(wrapper, calcVarName, value) {  
  // Have to specify a parent .value class here because the value and unit input elements
  // both have the same name
  let component = wrapper.find('.value [name="' + calcVarName + '"]')  
  component.at(0).instance().value = value
  component.simulate('change')    
}