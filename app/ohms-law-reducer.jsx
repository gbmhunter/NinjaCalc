import * as ohmsLawActions from './ohms-law-actions.js';

const initialState = {
  voltageValue: '',
  currentValue: '',
  resistanceValue: '',

  calcWhat: 'Resistance',
}

export default function defaultReducer(state = initialState, action) {
	console.log('defaultReducer() called.');

	switch (action.type) {
		case ohmsLawActions.SET_CALC_WHAT:
			console.log('ohmsLawActions.SET_CALC_WHAT action received.');
			return Object.assign({}, state, {
				calcWhat: action.variableName,	
			});	
			return state;
		default:
			return state;
	}
}