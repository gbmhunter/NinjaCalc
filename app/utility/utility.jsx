

export function findCalcIndexById(calcArray, id) {
	for (var i = 0; i < calcArray.length; i++) {
		if (calcArray[i].id === id) {
			return i;
		}
	}
	throw 'Couldn\'t find calculator with id = "' + id + '".';
}

export function findVarIndexById(varArray, id) {
	for (var i = 0; i < varArray.length; i++) {
		if (varArray[i].id === id) {
			return i;
		}
	}
	throw 'Couldn\'t find variable with id = "' + id + '".';
}

//! @brief		Utility function that gets a calculator variable value when provided with the
//!				array of variables and then variable name.
//! @details	Returns the variable taking into account the unit multiplier (e.g. should be returned
//!				in SI units, if your using an SI unit for a multiplier of 1).
export function getVal(vars, varId) {
	return vars[findVarIndexById(vars, varId)].val;
}

