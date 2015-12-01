//!
//! @file               calc-actions.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-12-01
//! @brief              Contains the "redux" actions for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

//======================================================================//
//========================= addCalculator() ============================//
//======================================================================//

export var ADD_CALC = 'ADD_CALC';

//! @brief    Changes the current variable being calculated.
export function addCalc(calcData) {

	return (dispatch, getState) => {
		console.log('addCalc() thunk called.');

		dispatch({
			type: ADD_CALC,
			calcData: calcData,			
		});
	}
}

//======================================================================//
//=========================== addCalcType() ============================//
//======================================================================//

export var ADD_CALC_TYPE = 'ADD_CALC_TYPE';

//! @brief    Changes the current variable being calculated.
export function addCalcType(model) {

	return (dispatch, getState) => {
		console.log('addCalcType() thunk called.');

		dispatch({
			type: ADD_CALC_TYPE,
			model,			
		});
	}
}

//======================================================================//
//========================= toggleCategory() ===========================//
//======================================================================//

export var TOGGLE_CATEGORY = 'TOGGLE_CATEGORY';

//! @brief    Toggles the visibility of a node in the calculator category tree view.
export function toggleCategory(node, toggled) {

	console.log('toggleCategory() action called.');
	return (dispatch, getState) => {
		console.log('toggleCategory() thunk called.');
		dispatch({
			type: TOGGLE_CATEGORY,
			node: node,
			toggled: toggled,		
		});
	}
}

//======================================================================//
//========================= setSearchTerm() ============================//
//======================================================================//

export var SET_SEARCH_TERM = 'SET_SEARCH_TERM';

//! @brief    Changes the current variable being calculated.
export function setSearchTerm(searchTerm) {

	return (dispatch, getState) => {
		console.log('setSearchTerm() thunk called.');

		dispatch({
			type: SET_SEARCH_TERM,
			searchTerm,		
		});
	}
}



//======================================================================//
//============================ addCalcTab() ============================//
//======================================================================//

export var OPEN_CALC = 'OPEN_CALC';

//! @brief    Changes the current variable being calculated.
export function openCalc(calcId) {

	return (dispatch, getState) => {
		console.log('openCalc() thunk called.');

		dispatch({
			type: OPEN_CALC,
			calcId,
		});
	}
}

//======================================================================//
//======================== setSelectedTab() ============================//
//======================================================================//

export var SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

//! @brief    Changes the current variable being calculated.
export function setActiveTab(tabKey) {

	return (dispatch, getState) => {
		console.log('setActiveTab() thunk called.');

		dispatch({
			type: SET_ACTIVE_TAB,
			tabKey,					
		});
	}
}




//======================================================================//
//=========================== setVarVal() ============================//
//======================================================================//

export var SET_VAR_VAL = 'SET_VAR_VAL';

//! @brief    Changes the current variable being calculated.
export function setVarVal(calcInstance, varId, val) {

	return (dispatch, getState) => {
		console.log('setVarVal() thunk called with calcInstance = "' + calcInstance + '", varId = "' + varId + '", val = "' + val + '".');

		dispatch({
			type: SET_VAR_VAL,
			calcInstance,
			varId: varId,
			val: val,
		});
	}
}

//======================================================================//
//=========================== setVarUnits() ============================//
//======================================================================//

export var SET_VAR_UNITS = 'SET_VAR_UNITS';

//! @brief    Changes the current variable being calculated.
export function setVarUnits(calcInstance, varId, unitValue) {

	return (dispatch, getState) => {
		console.log('setVarUnits() thunk called with calcInstance = "' + calcInstance + '", varId = "' + varId + '", unitValue = "' + unitValue + '".');

		dispatch({
			type: SET_VAR_UNITS,
			calcInstance,
			varId,
			unitValue,
		});
	}
}

//======================================================================//
//=========================== setCalcWhat() ============================//
//======================================================================//

export var SET_OUTPUT_VAR = 'SET_OUTPUT_VAR';

//! @brief    Changes the current variable being calculated.
export function setOutputVar(calcInstance, varId) {

	return (dispatch, getState) => {
		console.log('setOutputVar() thunk called with varId = "' + varId + '".');

		dispatch({
			type: SET_OUTPUT_VAR,
			calcInstance,
			varId,
		});
	}
}