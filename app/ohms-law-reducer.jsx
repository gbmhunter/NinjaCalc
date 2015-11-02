//!
//! @file               ohms-law-reducer.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-02
//! @brief              Contains the "redux" reducer for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

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
			outputFn: function(vars) {		
				return getVal(vars, 'Current') * getVal(vars, 'Resistance');								
			}
		},
		{
			name: 'Current',
			val: '',
			units: 'I',
			outputFn: function(vars) {		
				return getVal(vars, 'Voltage') / getVal(vars, 'Resistance');								
			}
		},
		{
			name: 'Resistance',
			val: '',
			units: 'R',
			outputFn: function(vars) {						

				//console.log('getVal(\'Voltage\') =' + getVal(vars, 'Voltage'));
				//console.log(initialState.vars);

				var result = getVal(vars, 'Voltage') / getVal(vars, 'Current');
				console.log('result = ' + result);
				return result;
			}
		},
	]
}

function getVal(vars, varName) {
	return vars[findIndexByName(vars, varName)].val;
}

export default function defaultReducer(state = initialState, action) {
	console.log('defaultReducer() called.');

	switch (action.type) {
		case ohmsLawActions.SET_VAR_VAL:
			console.log('ohmsLawActions.SET_VAR_VAL action received with action.val = ' + action.val);
			

			var varIndex = findIndexByName(state.vars, action.varName);
			console.log('varIndex = ');
			console.log(varIndex);


			// Update the variable which was just changed by user			
			// To modify array contents, we need to split it before and after the
			// index we are interested in modifying, and then modify the element with another
			// .assign() call.
			var vars = [
					...state.vars.slice(0, varIndex),
					Object.assign({}, state.vars[varIndex], {
						val: action.val
					}),
					...state.vars.slice(varIndex + 1)
			]

			// Need to find the calculated variable also
			var calcVarIndex = findIndexByName(state.vars, state.calcWhat);
			console.log('calcVarIndex = ' + calcVarIndex);

			// Call the calculated variables output function
			var calcVarVal = state.vars[calcVarIndex].outputFn(vars);
			console.log('calcVarVal = ' + calcVarVal);

			// Update the calculated variable value
			vars = [
					...vars.slice(0, calcVarIndex),
					Object.assign({}, vars[calcVarIndex], {
						val: calcVarVal
					}),
					...vars.slice(calcVarIndex + 1)
			]

			// Finally, return with our modified vars array
			return Object.assign({}, state, {
				vars: vars
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