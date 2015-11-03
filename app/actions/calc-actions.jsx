//!
//! @file               calc-actions.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-03
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
//=========================== setVarVal() ============================//
//======================================================================//

export var SET_VAR_VAL = 'SET_VAR_VAL';

//! @brief    Changes the current variable being calculated.
export function setVarVal(calcId, varId, val) {

	return (dispatch, getState) => {
		console.log('setVarVal() thunk called with calcId = "' + calcId + '" varId = "' + varId + '" val = "' + val + '".');

		dispatch({
			type: SET_VAR_VAL,
			calcId: calcId,
			varId: varId,
			val: val,
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