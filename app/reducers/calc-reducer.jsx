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

		//==============================================================================//
		//===================================== ADD_CALC ===============================//
		//==============================================================================//
		case calcActions.ADD_CALC:
			console.log('calcActions.ADD_CALC action received with action.calcData =');
			console.log(action.calcData);

			// Before adding the calculator to the array, we have to massage the input date into something
			// that is compatible with what the rest of the app wants.

			//================== UNITS ================//

			// Units can be provided in two forms:
			// units: [
			// 		{ label: 'mV', eq: 1e-3 },
			//		{ label: 'V', eq: 1 }
			// ]
			//
			// OR
			//
			// units: [
			// 		{ label: 'mV', eq: {
			//			to: val => { return val*1000; }
			//			from: val => { return val/1000; } 
			//		},
			//		{ label: 'V', eq: val => { return val; } }
			// ]

			// Work out whether eq is a number or function
			action.calcData.vars.forEach((calcVar) => {
				calcVar.units.forEach((el) => {
					
					// Add a value variable to the unit object. The value variable
					// is required by the react-select UI element to work correctly
					el.value = el.label;
				});
			});
			
			

			// Append the calculator to the end of the calculator array
			var calculators = [
				...state.calculators,
				action.calcData,
			];

			return Object.assign({}, state, {
				calculators: calculators,
			});

		//==============================================================================//
		//================================== SET_VAR_VAL ===============================//
		//==============================================================================//
		case calcActions.SET_VAR_VAL:
			console.log('calcActions.SET_VAR_VAL action received with action.calcId = "' + action.calcId + 
				'" action.varId = "' + action.varId + 
				'" action.val = "' + action.val + '".');

			// Note that the value coming will be as displayed, i.e. non-scaled

			// Convert value to float
			//var dispVal = parseFloat(action.val);
			var dispVal = action.val;

			// Check if value cannot be converted, and if so, change 'NaN' to nothing!
			// If state was with NaN, 'NaN' would be displayed for inputs if the user, say, 
			// deleted all the numbers in input
			/*if(isNaN(dispVal)) {
				dispVal = ''
			}*/

			// First find the index of the calculator the variable/value belongs to			
			var calcIndex = utility.findCalcIndexById(state.calculators, action.calcId);
			console.log('calcIndex = ' + calcIndex);

			// Now find the index of the variable
			var varIndex = utility.findVarIndexById(state.calculators[calcIndex].vars, action.varId);
			console.log('varIndex = ' +  varIndex);		

			// Copy vars array for the relevant calculator
			var vars = [...state.calculators[calcIndex].vars];

			// Save in the new displayed value
			vars = [
				...vars.slice(0, varIndex),
				Object.assign({}, vars[varIndex], {
					dispVal: dispVal,					
				}),
				...vars.slice(varIndex + 1)
			];

			// Calculate the new raw value
			var rawVal = utility.calcRawValFromDispVal(vars[varIndex]);

			console.log('Raw value = ' + rawVal);

			// To modify array contents, we need to split it before and after the
			// index we are interested in modifying, and then modify the element with another
			// .assign() call.
			//var vars = [...state.calculators[calcIndex].vars];
			vars = [
					...vars.slice(0, varIndex),
					Object.assign({}, vars[varIndex], {
						rawVal: rawVal,
					}),
					...vars.slice(varIndex + 1)
			]

			// Need to also re-calculate any output variables
			// THIS WILL HAVE TO BE SORTED (using directed acyclic graph algorithm)
			console.log('Re-calculating outputs.');
			vars = utility.reCalcOutputs(vars);

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

		//==============================================================================//
		//================================ SET_VAR_UNITS ===============================//
		//==============================================================================//
			
		case calcActions.SET_VAR_UNITS:
			console.log('calcActions.SET_VAR_UNITS action received.');

			// First find the index of the calculator the variable/value belongs to			
			var calcIndex = utility.findCalcIndexById(state.calculators, action.calcId);
			console.log('calcIndex = ' + calcIndex);

			// Now find the index of the variable
			var varIndex = utility.findVarIndexById(state.calculators[calcIndex].vars, action.varId);
			console.log('varIndex = ' +  varIndex);	

			// Copy vars array for the relevant calculator
			var vars = [...state.calculators[calcIndex].vars];

			// Save in the new selected unit value
			vars = [
				...vars.slice(0, varIndex),
				Object.assign({}, vars[varIndex], {
					selUnitValue: action.unitValue,					
				}),
				...vars.slice(varIndex + 1)
			];

			// Since the units have been changed for this variable, the raw value will change
			// Calculate new raw value for this variable
			var rawVal = utility.calcRawValFromDispVal(vars[varIndex]);

			//var rawVal = vars[varIndex].dispVal*action.unitValue;
			console.log('New rawVal = ' + rawVal);

			// Save in the new raw value
			vars = [
				...vars.slice(0, varIndex),
				Object.assign({}, vars[varIndex], {
					rawVal: rawVal,
				}),
				...vars.slice(varIndex + 1)
			];

			// This has essentially changed the value of the input associated with the units,
			// so we need to recalculate outputs again
			console.log('Re-calculating outputs.');
			vars = utility.reCalcOutputs(vars);
			

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



		//==============================================================================//
		//=============================== SET_OUTPUT_VAR ===============================//
		//==============================================================================//
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

			// Now that they have been changed, when need to re-calculate outputs
			vars = utility.reCalcAll(vars);

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

