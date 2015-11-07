

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

export function calcRawValFromDispVal(calcVar) {
	console.log('utility.calcRawValFromDispVal() called with calcVar =.');
	console.log(calcVar);


	var selUnitLabel = calcVar.selUnitValue
	console.log('Selected unit label = ' + selUnitLabel);

	var selUnitIndex = findUnitIndexByLabel(
		calcVar.units,
		selUnitLabel);
	console.log('Selected unit index = ' + selUnitIndex);

	// Now we need to work out whether the 'eq' variable for the selected unit is just a number (a multiplier)
	// or an object with two functions
	var rawVal;

	// Somehow doing this assignment automatically converts the dispVal variable in the calc var from
	// a string into a number, so it plays nicely when multiplied below?
	// Should toFloat() or similar be used here instead???
	var dispVal = calcVar.dispVal;

	if(typeof calcVar.units[selUnitIndex].eq === 'function') {
		console.log('eq for "' + calcVar.units[selUnitIndex].label + '" units is a function.');

		// Since we know 'eq' is a function, lets call it to work out what the rawVal is...
		rawVal = calcVar.units[selUnitIndex].eq(dispVal, 'input');

	} else {
		console.log('eq for "' + calcVar.units[selUnitIndex].label + '" units is a number.');
		rawVal = dispVal*calcVar.units[selUnitIndex].eq;
	}

	return rawVal;
}

export function findUnitIndexByLabel(unitArray, label) {
	console.log('findUnitIndexByLabel() called with unitArrary =');
	console.log(unitArray);
	console.log('and label = "' + label + '".');
	
	for (var i = 0; i < unitArray.length; i++) {
		if (unitArray[i].label === label) {
			return i;
		}
	}
	throw 'Couldn\'t find unit with label = "' + label + '".';
}

//! @brief		Re-calculates all output variables in a calculator.
export function reCalcOutputs(vars) {
	vars.forEach((calcVar, index) => {
			
		// Filter for outputs only	
		if(calcVar.direction == 'output') {
			
			// Recalculate the rawVal for the variable by calling it's
			// 'outputFn'.
			var rawVal = calcVar.outputFn(vars);
			console.log('rawVal = ' + rawVal);
			calcVar.rawVal = rawVal;

			// Find the index of the selected unit for this variable

			var selUnitIndex = findUnitIndexByLabel(
				calcVar.units,
				calcVar.selUnitValue);
			console.log('Selected unit index = ' + selUnitIndex);						

			// Now we need to work out whether the 'eq' variable for the selected unit is just a number (a multiplier)
			// or an object with two functions
			var dispVal;
			if(typeof calcVar.units[selUnitIndex].eq === 'function') {
				console.log('eq for "' + calcVar.units[selUnitIndex].label + '" unit is a function.');

				// Since we know 'eq' is a function, lets call it to work out what the rawVal is...
				dispVal = calcVar.units[selUnitIndex].eq(rawVal, 'output');

			} else {
				console.log('eq for "' + calcVar.units[selUnitIndex].label + '" units is a number.');
				dispVal = rawVal*calcVar.units[selUnitIndex].eq;
			}


			// Now calculate displayed value using raw value
			// and selected units
			//var dispVal = rawVal/calcVar.selUnitValue;
			console.log('Re-calculated "' + calcVar.id + '", rawVal = "' + rawVal + '", dispVal = "' + dispVal + '.');
			calcVar.dispVal = dispVal;
		}
	});	

	return vars;
}

//! @brief		Utility function that gets a calculator variable value when provided with the
//!				array of variables and then variable name.
//! @details	Returns the variable taking into account the unit multiplier (e.g. should be returned
//!				in SI units, if your using an SI unit for a multiplier of 1).
export function getVal(vars, varId) {
	return vars[findVarIndexById(vars, varId)].rawVal;
}

