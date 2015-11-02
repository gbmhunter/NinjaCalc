import * as ohmsLawActions from './ohms-law-actions.js';

const initialState = {
  /*voltageValue: '',
  currentValue: '',
  resistanceValue: '',

  calcWhat: 'Resistance',*/

	variables: [
		{
			name: 'Voltage',
			units: 'V',
		},
		{
			name: 'Current',
			units: 'I',
		},
		{
			name: 'Resistance',
			units: 'R',
		},
	]
}

export default function defaultReducer(state = initialState, action) {
	console.log('defaultReducer() called.');

	switch (action.type) {
		case ohmsLawActions.SET_VAR_VAL:
			console.log('ohmsLawActions.SET_VAR_VAL action received.');

			var voltageValue;
			switch(action.variableName) {
				case 'Voltage':
					console.log('Setting voltage.');
					voltageValue = state.currentValue*state.resistanceValue;
					break;
				default:
					console.log('ERROR: action.variableName not recognised.');
			}

			return Object.assign({}, state, {
				calcWhat: action.variableName,	
			});	
		case ohmsLawActions.SET_CALC_WHAT:
			console.log('ohmsLawActions.SET_CALC_WHAT action received.');

			var voltageValue;
			switch(action.variableName) {
				case 'Voltage':
					console.log('Setting voltage.');
					voltageValue = state.currentValue*state.resistanceValue;
					break;
				default:
					console.log('ERROR: action.variableName not recognised.');
			}

			return Object.assign({}, state, {
				calcWhat: action.variableName,	
			});	
		default:
			return state;
	}
}