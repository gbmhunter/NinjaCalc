

const initialState = {
  voltageValue: '',
  currentValue: '',
  resistanceValue: '',

  calcWhat: 'Resistance',
}

export default function defaultReducer(state = initialState, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}