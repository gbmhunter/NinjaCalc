//!
//! @file               calc-reducer.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-12-05
//! @brief              Contains the "redux" reducer for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

'use strict';

//===============================================================================================//
//========================================= npm MODULES =========================================//
//===============================================================================================//
var immutable = require('immutable');
var TreeModel = require('tree-model');

//===============================================================================================//
//========================================== USER MODULES =======================================//
//===============================================================================================//

import * as utility from '../utility/utility.js';
import * as immutableTree from '../utility/immutable-tree/immutable-tree.js';
import * as calcActions from '../actions/calc-actions.js';

// Helps with manipulation of the calculator grid that the user can select from.
import * as gridHelper from '../utility/grid-helper/grid-helper.js';

//===============================================================================================//
//============================================ CODE =============================================//
//===============================================================================================//

//! @brief		Default/initial state for application.
const initialState = immutable.fromJS({

	//! @brief		Stores the data for every registered calculator type. Calculator instances are created from
	//!				these types when the user clicks the "Open" button.
	//! @details	Calculators are loaded in the onMount() function of the React 'App' component.
	//calculators: [], 
	calculators: immutable.List(),

	//categoryTree: new TreeModel(), 
	categoryTree: immutableTree.createRootNode(),

	//! @brief		This holds a "massaged" categoryTree which is formatted to work with the UI object which
	//!				created the category menus.
	nameChildrenCategoryTree: immutable.Map(),

	//! @brief		A calculator objects exists in here for every open calculator.
	openCalculators: immutable.List(),

	gridElements: immutable.List(),

	activeTabKey: 0,

	//! @brief		Stores the text to display within the "search" input.
	searchTerm: '',
});

//! @brief		The default reducer for the app.
export default function defaultReducer(state = initialState, action) {

	// Allow state to be mutated, just remember to return immutable version
	// This saves memory, and prevents bugs if developer forgets to write
	// state = state.set()..., as we can now just write state.set()
	// Make sure to return an immutable! e.g. return state.asImmutable().
	state = state.asMutable();
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

			// Check to see if any validators where provided, and if not, add empty array
			// (otherwise error will be thrown on forEach() later in code)
			action.calcData.vars.forEach((calcVar) => {
				if(typeof calcVar.validators === 'undefined') {
					calcVar.validators = [];
				} 
			});

			// We need to run through all the calculations to bring all variables into their correct
			// state
			//utility.reCalcAll(action.calcData.vars);
			

			var newCalc = immutable.fromJS(action.calcData);
			console.log('newCalc = ');
			console.log(newCalc);

			// Calculate all the output variables (for the first time ever), to get the 
			// calculator into a default state
			var calcVars = utility.reCalcAll(newCalc.get('vars'));			
			newCalc = newCalc.set('vars', calcVars);

			// Set the default visibility for a calculator to false (i.e. not shown in a tab)
			newCalc = newCalc.set('visible', false);


			// Add this new calculator to the end of the calculators array
			var calculators = state.get('calculators').push(newCalc);
			state.set('calculators', calculators);

			var gridElement = {
				key: state.get('gridElements').size,
				name: action.calcData.name,
				description: newCalc.get('description'),
				calcId: newCalc.get('id'),
				imageSrc: newCalc.get('imageSrc'),
				categoryPath: newCalc.get('categoryPath'),
				sort: 0,
				filtered: false,				
			};

			// Add calculator to grid
			state.setIn(['gridElements', state.get('gridElements').size], immutable.fromJS(gridElement));

			//console.log('state.gridElements = ');
			//console.log(state.get('gridElements').toJS());

			//state = state.setIn(['gridElements', 0, 'filtered'], false);

			//===================== ADJUST CATEGORY TREE AS NEEDED =====================//

			var categoryPath = newCalc.get('categoryPath');
			if(typeof(categoryPath) === 'undefined') {
				console.log('WARNING: No categoryPath found for calculator ' + newCalc.get('name'));
			}
			console.log('categoryPath = ' + categoryPath);


			// Extract first element
			//var category1 = categoryPath.get(0);
			//console.log('category1 = ' + category1);

			// Get existing category tree
			var categoryTree = state.get('categoryTree');
			console.log('Existing categoryTree = ');
			console.log(categoryTree.toJS());

			//categoryTree = immutableTree.addChildNode(categoryTree, category1);
			categoryTree = immutableTree.addNodePath(categoryTree, categoryPath);

			console.log('New categoryTree.toJS() = ');
			console.log(categoryTree.toJS());

			state.set('categoryTree', categoryTree);


			return state.asImmutable();

		//==============================================================================//
		//================================= TOGGLE_CATEGORY ============================//
		//==============================================================================//

		case calcActions.TOGGLE_CATEGORY:
			console.log('calcActions.TOGGLE_CATEGORY action received with action =');
			console.log(action);

			// Now we want to change the toggled state of the node in state.categoryTree with the same
			// id as provided in action.node.key, to the boolean state provided by action.node.toggled
			var categoryTree = state.get('categoryTree').toJS();
			console.log('categoryTree (before mod) =');
			console.log(categoryTree);
			immutableTree.setParam(categoryTree, action.node.key, 'toggled', action.toggled);
			console.log('categoryTree (after mod) =');
			console.log(categoryTree);

			// Currently, this also counts as if the user 'clicked' on the category, so
			// we want to filter the displayed calculators to only those in this category.
			var gridElements = state.get('gridElements').toJS();

			// Filter the grid elements. This function sets the visible property of all grid elements that do not belong to the 
			// given key to false
			gridHelper.filter(gridElements, action.node.key);

			// Save the modified grid elements back into the immutable state variable
			state.set('gridElements', immutable.fromJS(gridElements));


			return state.asImmutable();

		//==============================================================================//
		//================================= SET_SEARCH_TERM ============================//
		//==============================================================================//

		case calcActions.SET_SEARCH_TERM:
			console.log('calcActions.SET_SEARCH_TERM action received with action.searchTerm =' + action.searchTerm);

			state = state.set('searchTerm', action.searchTerm);

			// We also need to update the "gridElements" array, to filter the results based on the current search term
			// We can set the "filtered" variable on each gridElement to true to hide it
			state.get('gridElements').forEach((gridElement, index) => {
				//console.log('gridElements.forEach() called for gridElement =');
				//console.log(gridElement.toJS());
				//console.log('and index = ' + index);

				// Build a regex with the search term
				const regex = new RegExp(state.get('searchTerm'), 'i');

				// Check if there is a match in the name, and set the filtered variable
				// accordingly
				if(gridElement.get('name').search(regex) > -1) {
					//console.log('Match found!');		
					//gridElement = gridElement.set('filtered', false);			
					state = state.setIn(['gridElements', index, 'filtered'], false);
				} else {
					//console.log('Match not found.');
					state = state.setIn(['gridElements', index, 'filtered'], true);
				}

			});

			return state.asImmutable();

		//==============================================================================//
		//===================================== OPEN_CALC ===============================//
		//==============================================================================//
		case calcActions.OPEN_CALC:
			console.log('calcActions.OPEN_CALC action received with action.calcId = ' + action.calcId);

			// We want to set the relevant calculator visible variable to true, which will cause it
			// to open in a new tab
			var calcIndex = state.get('calculators').findIndex((calculator) => {
				return calculator.get('id') === action.calcId; 
			});

			console.log('calcIndex = ' + calcIndex);

			var calcTemplate = state.getIn(['calculators', calcIndex]);

			// Get current number of open calculators
			var numOpenCalculators = state.get('openCalculators').size;

			// Set the calculator instance. This number is unique to each calculator, and is passed in
			// with each action so the reducer knows which open calculator to act upon when things like
			// variables change
			calcTemplate = calcTemplate.set('calcInstance', numOpenCalculators);

			// Let's grab the calculator template and add it to the open calculators variable
			// (at the end of the array)
			state = state.setIn(['openCalculators', numOpenCalculators], calcTemplate);

			// We also want to switch to it's tab (set it as the active tab).
			// We know that the just added calculator will be the last one in the openCalculators array.
			state = state.set('activeTabKey', numOpenCalculators + 1);


			return state.asImmutable();

		//==============================================================================//
		//================================= SET_ACTIVE_TAB =============================//
		//==============================================================================//

		case calcActions.SET_ACTIVE_TAB:
			console.log('calcActions.SET_ACTIVE_TAB action received with action.tabKey =' + action.tabKey);

			state.set('activeTabKey', action.tabKey);

			return state.asImmutable();
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
			//var calcIndex = utility.findCalcIndexById(state.get('openCalculators'), action.calcId);
			//console.log('calcIndex = ' + calcIndex);

			// Now find the index of the variable
			var varIndex = utility.findVarIndexById(state.getIn(['openCalculators', action.calcInstance, 'vars']), action.varId);
			//console.log('varIndex = ' +  varIndex);	


			//var newVar = state.get('calculators').get(calcIndex).get('vars').get()

			//console.log('Setting variable value...');
			state.setIn(['openCalculators', action.calcInstance, 'vars', varIndex, 'dispVal'], dispVal);	

			// Copy vars array for the relevant calculator
			/*var vars = [...state.get('calculators')[calcIndex].vars];

			// Save in the new displayed value
			vars = [
				...vars.slice(0, varIndex),
				Object.assign({}, vars[varIndex], {
					dispVal: dispVal,					
				}),
				...vars.slice(varIndex + 1)
			];*/
			

			// Calculate the new raw value
			var rawVal = utility.calcRawValFromDispVal(state.getIn(['openCalculators', action.calcInstance, 'vars', varIndex]));
			state.setIn(['openCalculators', action.calcInstance, 'vars', varIndex, 'rawVal'], rawVal);

			//console.log('Raw value = ' + rawVal);

/*
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
			vars = utility.reCalcOutputs(vars);*/

			var calcVars = utility.reCalcAll(state.getIn(['openCalculators', action.calcInstance, 'vars']));
			//console.log('rfb2 = ' + calcVars.getIn([6, 'dispVal']));

			state.setIn(['openCalculators', action.calcInstance, 'vars'], calcVars);

			//console.log('state.rfb2 = ' + calcVars.getIn([6, 'dispVal']));

			// Finally, return with our modified vars array
			/*return Object.assign({}, state, {
				calculators: [
					...state.calculators.slice(0, calcIndex),
					Object.assign({}, state.calculators[calcIndex], {
						vars: vars
					}),
					...state.calculators.slice(calcIndex + 1)
				]
			});*/

			console.log('SET_VAR_VAL finished. state = ');
			console.log(state.toJS());

			return state.asImmutable();

		//==============================================================================//
		//================================ SET_VAR_UNITS ===============================//
		//==============================================================================//
			
		case calcActions.SET_VAR_UNITS:
			console.log('calcActions.SET_VAR_UNITS action received with action =');
			console.log(action);

			// First find the index of the calculator the variable/value belongs to			
			//var calcIndex = utility.findCalcIndexById(state.get('openCalculators'), action.calcId);
			//console.log('calcIndex = ' + calcIndex);

			// Now find the index of the variable
			var varIndex = utility.findVarIndexById(state.getIn(['openCalculators', action.calcInstance, 'vars']), action.varId);
			console.log('varIndex = ' +  varIndex);	

			state.setIn(['openCalculators', action.calcInstance, 'vars', varIndex, 'selUnitValue'], action.unitValue);

			// Since the units have been changed for this variable, the raw value will change
			// Calculate new raw value for this variable
			var rawVal = utility.calcRawValFromDispVal(state.getIn(['openCalculators', action.calcInstance, 'vars', varIndex]));

			//var rawVal = vars[varIndex].dispVal*action.unitValue;
			console.log('New rawVal = ' + rawVal);

			state.setIn(['openCalculators', action.calcInstance, 'vars', varIndex, 'rawVal'], rawVal);

			// We also need to re-calculate outputs
			var calcVars = utility.reCalcAll(state.getIn(['openCalculators', action.calcInstance, 'vars']));			

			state.setIn(['openCalculators', action.calcInstance, 'vars'], calcVars);

			return state.asImmutable();


		//==============================================================================//
		//=============================== SET_OUTPUT_VAR ===============================//
		//==============================================================================//
		case calcActions.SET_OUTPUT_VAR:
			console.log('calcActions.SET_CALC_WHAT action received.');

			// First find the index of the calculator the variable/value belongs to			
			//var calcIndex = utility.findCalcIndexById(state.get('openCalculators'), action.calcId);
			//console.log('calcIndex = ' + calcIndex);

			// Now find the index of the variable
			var varIndex = utility.findVarIndexById(state.getIn(['openCalculators', action.calcInstance, 'vars']), action.varId);
			console.log('varIndex = ' +  varIndex);		

			var vars = state.getIn(['openCalculators', action.calcInstance, 'vars'])

			vars = vars.map(function(calcVar, index){
				if(index == varIndex) {
					console.log('Setting ' + calcVar.get('name') + ' as a output.');
					calcVar = calcVar.set('direction', 'output');
				} else {					
					console.log('Setting ' + calcVar.get('name') + ' as a input.');
					calcVar = calcVar.set('direction', 'input');
				}

				return calcVar;
			});

			// Now that they have been changed, when need to re-calculate outputs
			vars = utility.reCalcAll(vars);

			state.setIn(['openCalculators', action.calcInstance, 'vars'], vars);

			return state.asImmutable();
			
		default:
			return state.asImmutable();
	}
}

