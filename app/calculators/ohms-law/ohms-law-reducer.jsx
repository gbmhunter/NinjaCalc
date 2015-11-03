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

	//! @brief		Stores the data for every calculator.
	calculators: [], 

	vars: [
		{
			name: 'Voltage',
			val: '2',
			units: 'V',		
			direction: 'input',
			outputFn: function(vars) {		
				return getVal(vars, 'Current') * getVal(vars, 'Resistance');								
			}
		},
		{
			name: 'Current',
			val: '',
			units: 'I',
			direction: 'input',
			outputFn: function(vars) {		
				return getVal(vars, 'Voltage') / getVal(vars, 'Resistance');								
			}
		},
		{
			name: 'Resistance',
			val: '',
			units: 'R',
			direction: 'output',
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

//! @brief		Utility function that gets a calculator variable value when provided with the
//!				array of variables and then variable name.
function getVal(vars, varName) {
	return vars[findIndexByName(vars, varName)].val;
}

export default function defaultReducer(state = initialState, action) {
	console.log('defaultReducer() called.');

	switch (action.type) {

		case ohmsLawActions.ADD_CALC:
			console.log('ohmsLawActions.ADD_CALC action received.');

			var calculators = [
				...state.calculators,
				action.calcData,
			];

			return Object.assign({}, state, {
				calculators: calculators,
			});


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

			// Need to also re-calculate any output variables
			console.log('Re-calculating outputs.');
			vars.forEach((el, index) => {
				console.log(el);
				if(el.direction == 'output') {
					var calcVal = el.outputFn(vars);
					console.log('calcVal = ' + calcVal);
					el.val = calcVal;
				}
			});

			/*var calcVarIndex = findIndexByName(state.vars, state.calcWhat);
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
			]*/

			// Finally, return with our modified vars array
			return Object.assign({}, state, {
				vars: vars
			})
			
		case ohmsLawActions.SET_OUTPUT_VAR:
			console.log('ohmsLawActions.SET_CALC_WHAT action received.');

			var varIndex = findIndexByName(state.vars, action.varName);
			//console.log('varIndex = ');

			var vars = [...state.vars];

			vars.map(function(el, index){
				if(index == varIndex) {
					console.log('Setting ' + el.name + ' as a output.');
					el.direction = 'output';
				} else {
					el.direction = 'input';
					console.log('Setting ' + el.name + ' as a input.');
				}
			});
			

			return Object.assign({}, state, {
				vars: vars,	
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