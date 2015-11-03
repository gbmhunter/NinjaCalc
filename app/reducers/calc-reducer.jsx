//!
//! @file               calc-reducer.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-03
//! @brief              Contains the "redux" reducer for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

import * as utility from '../utility/utility.js';
import * as calcActions from '../actions/calc-actions.js';

//! @brief		Default/initial state for application.
const initialState = {

	//! @brief		Stores the data for every calculator.
	//! @details	Calculators are loaded in the onMount() function of the React 'App' component.
	calculators: [], 
}

//! @brief		The default reducer for the app.
export default function defaultReducer(state = initialState, action) {
	console.log('defaultReducer() called.');

	switch (action.type) {

		case calcActions.ADD_CALC:
			console.log('calcActions.ADD_CALC action received.');

			var calculators = [
				...state.calculators,
				action.calcData,
			];

			return Object.assign({}, state, {
				calculators: calculators,
			});


		case calcActions.SET_VAR_VAL:
			console.log('calcActions.SET_VAR_VAL action received with action.calcId = "' + action.calcId + 
				'" action.varId = "' + action.varId + 
				'" action.val = "' + action.val + '".');

			// First find the index of the calculator the variable/value belongs to			
			var calcIndex = utility.findCalcIndexById(state.calculators, action.calcId);
			console.log('calcIndex = ' + calcIndex);

			// Now find the index of the variable
			var varIndex = utility.findVarIndexById(state.calculators[calcIndex].vars, action.varId);
			console.log('varIndex = ' +  varIndex);			


			// Update the variable which was just changed by user			
			// To modify array contents, we need to split it before and after the
			// index we are interested in modifying, and then modify the element with another
			// .assign() call.
			var vars = [...state.calculators[calcIndex].vars];

			vars = [
					...vars.slice(0, varIndex),
					Object.assign({}, vars[varIndex], {
						val: action.val
					}),
					...vars.slice(varIndex + 1)
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

			// Finally, return with our modified vars array
			return Object.assign({}, state, {
				calculators: [
					...state.calculators.slice(0, calcIndex),
					Object.assign({}, state.calculators[calcIndex], {
						vars: vars
					}),
					...state.calculators.slice(calcIndex + 1)
				]
			});
			
		case calcActions.SET_OUTPUT_VAR:
			console.log('calcActions.SET_CALC_WHAT action received.');

			// First find the index of the calculator the variable/value belongs to			
			var calcIndex = utility.findCalcIndexById(state.calculators, action.calcId);
			console.log('calcIndex = ' + calcIndex);

			// Now find the index of the variable
			var varIndex = utility.findVarIndexById(state.calculators[calcIndex].vars, action.varId);
			console.log('varIndex = ' +  varIndex);		

			var vars = [...state.calculators[calcIndex].vars];

			vars.map(function(el, index){
				if(index == varIndex) {
					console.log('Setting ' + el.name + ' as a output.');
					el.direction = 'output';
				} else {
					el.direction = 'input';
					console.log('Setting ' + el.name + ' as a input.');
				}
			});

			// Finally, return with our modified vars array
			return Object.assign({}, state, {
				calculators: [
					...state.calculators.slice(0, calcIndex),
					Object.assign({}, state.calculators[calcIndex], {
						vars: vars
					}),
					...state.calculators.slice(calcIndex + 1)
				]
			});
			
		default:
			return state;
	}
}

