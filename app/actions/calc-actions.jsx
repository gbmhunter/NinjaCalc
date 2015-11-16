//!
//! @file               calc-actions.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-15
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
export function setVarVal(calcId, varId, val) {

	return (dispatch, getState) => {
		console.log('setVarVal() thunk called with calcId = "' + calcId + '", varId = "' + varId + '", val = "' + val + '".');

		dispatch({
			type: SET_VAR_VAL,
			calcId: calcId,
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
export function setVarUnits(calcId, varId, unitValue) {

	return (dispatch, getState) => {
		console.log('setVarUnits() thunk called with calcId = "' + calcId + '", varId = "' + varId + '", unitValue = "' + unitValue + '".');

		dispatch({
			type: SET_VAR_UNITS,
			calcId,
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
export function setOutputVar(calcId, varId) {

	return (dispatch, getState) => {
		console.log('setOutputVar() thunk called with varId = "' + varId + '".');

		dispatch({
			type: SET_OUTPUT_VAR,
			calcId,
			varId,
		});
	}
}