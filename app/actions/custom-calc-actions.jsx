//!
//! @file               custom-calc-actions.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-12-26
//! @last-modified      2015-12-26
//! @brief              Contains the "redux" actions for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

import * as calcActions from './calc-actions.js';

//======================================================================//
//============================== addCalc() =============================//
//======================================================================//

export var REGISTER_CALC = 'REGISTER_CALC';

export function registerCalc(data) {
	return (dispatch, getState) => {
		console.log('registerCalc() thunk called with data = "' + data + '".');

		dispatch({
			type: REGISTER_CALC,
			data,			
		});
	}
}

//======================================================================//
//============================== openCalc() =============================//
//======================================================================//

export var OPEN_CALC = 'OPEN_CALC';

export function openCalc(calcId) {
	return (dispatch, getState) => {
		console.log('openCalc() thunk called with calcId = "' + calcId + '".');

		dispatch({
			type: OPEN_CALC,
			calcId,			
		});

		// Let's also hide the calculator grid, so that the user can work
		// with the new calculator straight away
		dispatch(calcActions.setCalcGridVisibility(false));
	}
}

//======================================================================//
//=========================== addNumberRow() ===========================//
//======================================================================//

export var ADD_NUMBER_ROW = 'ADD_NUMBER_ROW';

export function addNumberRow(calcId, numberRowData) {
	return (dispatch, getState) => {
		console.log('addNumberRow() thunk called with calcId = "' + calcId + '".');

		dispatch({
			type: ADD_NUMBER_ROW,
			calcId,
			numberRowData,
		});
	}
}
