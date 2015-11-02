//!
//! @file               ohms-law-actions.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-02
//! @brief              Contains the "redux" actions for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.


//======================================================================//
//=========================== setVarVal() ============================//
//======================================================================//

export var SET_VAR_VAL = 'SET_VAR_VAL';

//! @brief    Changes the current variable being calculated.
export function setVarVal(varName, val) {

	return (dispatch, getState) => {
		console.log('setVarVal() thunk called.');

		dispatch({
			type: SET_VAR_VAL,
			varName: varName,
			val: val,
		});
	}
}

//======================================================================//
//=========================== setCalcWhat() ============================//
//======================================================================//

export var SET_OUTPUT_VAR = 'SET_OUTPUT_VAR';

//! @brief    Changes the current variable being calculated.
export function setOutputVar(varName) {

	return (dispatch, getState) => {
		console.log('setOutputVar() thunk called with varName =');
		console.log(varName);

		dispatch({
			type: SET_OUTPUT_VAR,
			varName: varName,
		});
	}
}