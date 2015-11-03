

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
export function getVal(vars, varId) {
	return vars[findVarIndexById(vars, varId)].val;
}

