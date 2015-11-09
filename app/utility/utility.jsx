//!
//! @file               utility.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-08
//! @brief              Contains helper functions for the calc reducer in the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

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
	console.log('Calculated rawVal = ' + rawVal);

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
				dispVal = rawVal/calcVar.units[selUnitIndex].eq;
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

//! @brief		Re-calculates all variables in the calculator (i.e. rawVal's from dispVal's for inputs,
//!				dispVal's from rawVal's for outputs).
//! @param		vars 	The array of variables from a specific calculator.
//! @returns 	The modified vars array.
export function reCalcAll(vars) {
	console.log('utility.reCalcAll() called.');

	// First loop through all inputs
	// The order of input variable calculation
	// does not matter
	vars.forEach((calcVar, index) => {
			
		// Filter for inputs only	
		if(calcVar.direction == 'input') {
			
			// Calculate the new raw value
			var rawVal = calcRawValFromDispVal(calcVar);
			calcVar.rawVal = rawVal;

			// Validate
			validateVar(calcVar);
		}
	});	

	// Now loop through all outputs
	// The order of these DOES matter, we have
	// to do a topological sort
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
				dispVal = rawVal/calcVar.units[selUnitIndex].eq;
			}


			// Now calculate displayed value using raw value
			// and selected units
			//var dispVal = rawVal/calcVar.selUnitValue;
			console.log('Re-calculated "' + calcVar.id + '", rawVal = "' + rawVal + '", dispVal = "' + dispVal + '.');
			calcVar.dispVal = dispVal;

			// Validate
			validateVar(calcVar);
		}
	});	

	return vars;

}

//! @brief			Validates a calculator variable.
//! @side-effects 	Saves the worst validation state returned from any of the validator functions 
//!					into the calculator variable. This could be 'ok', 'warning' or 'error'.
//!					Saves tooltipText into the calculator variable.
export function validateVar(calcVar) {
	console.log('utility.validateVar() called for "' + calcVar.id + '".');

	// Validators are optional, so check to see if they exist
	/*if(typeof calcVar.validators === 'undefined') {
		calcVar.worstValidationResult = 'ok';
		return; 
	}*/

	var worstResult = 'ok';

	// This variable is for building up the text to display in the tooltip.
	// It will be populated with violation info.
	var tooltipText = '';
	calcVar.validators.forEach((validator) => {
		// ALWAYS pass rawVal to validator function
		var validationResult = validator.fn(calcVar.rawVal);
		console.log('validationResult = ' + validationResult);

		switch(validationResult) {
			case 'ok':
				break;
			// Do nothing, don't want to add tooltip text for every validator that
			// returns o.k.!
			case 'warning':
				if(worstResult == 'ok') {
					worstResult = 'warning';
				}
				tooltipText += validator.msg;
				break;
			case 'error':
				worstResult = 'error';
				tooltipText += validator.msg;
				break;
			default:
				throw 'ERROR: Result returned from validation function not recognised!';
		}
	});

	if(worstResult == 'ok') {
		// If we are here, and the worst result is 'ok', then we can add the text 
		tooltipText = 'Value is o.k.';
	}


	// Save the worst result into the calculator variable
	calcVar.worstValidationResult = worstResult;
	calcVar.tooltipText = tooltipText;
}

//! @brief		Utility function that gets a calculator variable value when provided with the
//!				array of variables and then variable name.
//! @details	Returns the variable taking into account the unit multiplier (e.g. should be returned
//!				in SI units, if your using an SI unit for a multiplier of 1).
export function getVal(vars, varId) {
	return vars[findVarIndexById(vars, varId)].rawVal;
}

