

const initialState = {
  voltageValue: '',
  currentValue: '',
  resistanceValue: '',

  calcWhat: 'resistance',
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