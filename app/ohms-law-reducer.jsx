import * as ohmsLawActions from './ohms-law-actions.js';

const initialState = {
  /*voltageValue: '',
  currentValue: '',
  resistanceValue: '',

  calcWhat: 'Resistance',*/

	vars: [
		{
			name: 'Voltage',
			val: '2',
			units: 'V',		
			outputFn: function() {
				return 10;
			}	
		},
		{
			name: 'Current',
			val: '',
			units: 'I',
		},
		{
			name: 'Resistance',
			val: '',
			units: 'R',
		},
	]
}

export default function defaultReducer(state = initialState, action) {
	console.log('defaultReducer() called.');

	switch (action.type) {
		case ohmsLawActions.SET_VAR_VAL:
			console.log('ohmsLawActions.SET_VAR_VAL action received with action.val = ' + action.val);
			

			var varIndex = findIndexByName(state.vars, action.varName);
			console.log('varIndex = ');
			console.log(varIndex);

			return Object.assign({}, state, {
				vars: [
					...state.vars.slice(0, varIndex),
					Object.assign({}, state.vars[varIndex], {
						val: action.val
					}),
					...state.vars.slice(varIndex + 1)
				]
			})
			
		case ohmsLawActions.SET_CALC_WHAT:
			console.log('ohmsLawActions.SET_CALC_WHAT action received.');

			/*
			var voltageValue;
			switch(action.varName) {
				case 'Voltage':
					console.log('Setting voltage.');
					voltageValue = state.currentValue*state.resistanceValue;
					break;
				default:
					console.log('ERROR: action.variableName not recognised.');
			}*/

			return Object.assign({}, state, {
				calcWhat: action.varName,	
			});	
		default:
			return state;
	}
}

function findByName(source, name) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].name === name) {
      return source[i];
    }
  }
  throw "Couldn't find object with name: " + name;
}

function findIndexByName(source, name) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].name === name) {
      return i;
    }
  }
  throw "Couldn't find object with name: " + name;
}