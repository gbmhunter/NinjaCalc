//!
//! @file               utility.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-09
//! @brief              Contains helper functions for the calc reducer in the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

export function findCalcIndexById(calcArray, id) {

	console.log('calcArray.size = ' + calcArray.size);
	for (var i = 0; i < calcArray.size; i++) {
		if (calcArray.getIn([i, 'id']) === id) {
			return i;
		}
	}
	throw 'Couldn\'t find calculator with id = "' + id + '".';
}

export function findVarIndexById(varArray, id) {

	/*if(!(varArray instanceof Array)) {
		throw 'varArray passed to findVarIndexById() was not an array.';
	}*/

	//console.log('findVarIndexById() called with varArray = ');
	//console.log(varArray);
	//console.log(' and id = ' + id);


	for (var i = 0; i < varArray.size; i++) {
		if (varArray.getIn([i, 'id']) === id) {
			return i;
		}
	}
	throw 'Couldn\'t find variable with id = "' + id + '" in varArray = "' + varArray + '".';
}

export function calcRawValFromDispVal(calcVar) {
	//console.log('utility.calcRawValFromDispVal() called with calcVar =.');
	//console.log(calcVar);


	var selUnitLabel = calcVar.get('selUnitValue');
	//console.log('Selected unit label = ' + selUnitLabel);

	var selUnitIndex = findUnitIndexByLabel(
		calcVar.get('units'),
		selUnitLabel);
	//console.log('Selected unit index = ' + selUnitIndex);

	// Now we need to work out whether the 'eq' variable for the selected unit is just a number (a multiplier)
	// or an object with two functions
	var rawVal;

	// Somehow doing this assignment automatically converts the dispVal variable in the calc var from
	// a string into a number, so it plays nicely when multiplied below?
	// Should toFloat() or similar be used here instead???
	var dispVal = calcVar.get('dispVal');

	if(typeof calcVar.getIn(['units', selUnitIndex, 'eq']) === 'function') {
		//console.log('eq for "' + calcVar.units[selUnitIndex].label + '" units is a function.');

		// Since we know 'eq' is a function, lets call it to work out what the rawVal is...
		rawVal = calcVar.getIn(['units', selUnitIndex, 'eq'])(dispVal, 'input');

	} else {
		//console.log('eq for "' + calcVar.units[selUnitIndex].label + '" units is a number.');
		rawVal = dispVal*calcVar.getIn(['units', selUnitIndex, 'eq']);
	}
	//console.log('Calculated rawVal = ' + rawVal);

	return rawVal;
}

export function findUnitIndexByLabel(unitArray, label) {
	//console.log('findUnitIndexByLabel() called with unitArrary =');
	//console.log(unitArray);
	//console.log('and label = "' + label + '".');
	
	for (var i = 0; i < unitArray.size; i++) {
		if (unitArray.getIn([i, 'label']) === label) {
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
			//console.log('rawVal = ' + rawVal);
			calcVar.rawVal = rawVal;

			// Find the index of the selected unit for this variable

			var selUnitIndex = findUnitIndexByLabel(
				calcVar.units,
				calcVar.selUnitValue);
			//console.log('Selected unit index = ' + selUnitIndex);						

			// Now we need to work out whether the 'eq' variable for the selected unit is just a number (a multiplier)
			// or an object with two functions
			var dispVal;
			if(typeof calcVar.units[selUnitIndex].eq === 'function') {
				//console.log('eq for "' + calcVar.units[selUnitIndex].label + '" unit is a function.');

				// Since we know 'eq' is a function, lets call it to work out what the rawVal is...
				dispVal = calcVar.units[selUnitIndex].eq(rawVal, 'output');

			} else {
				//console.log('eq for "' + calcVar.units[selUnitIndex].label + '" units is a number.');
				dispVal = rawVal/calcVar.units[selUnitIndex].eq;
			}


			// Now calculate displayed value using raw value
			// and selected units
			//var dispVal = rawVal/calcVar.selUnitValue;
			//console.log('Re-calculated "' + calcVar.id + '", rawVal = "' + rawVal + '", dispVal = "' + dispVal + '.');
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

	// Profiling test
	//return(vars);

	// First loop through all inputs
	// The order of input variable calculation
	// does not matter
	vars.forEach((calcVar, index) => {

			
		// Filter for inputs only	
		if(calcVar.get('direction') == 'input') {
			
			// Calculate the new raw value
			var rawVal = calcRawValFromDispVal(calcVar);
			calcVar = calcVar.set('rawVal', rawVal);

			// Validate
			vars = validateVar(vars, index);
		}
	});	



	// Now loop through all outputs
	// The order of these DOES matter, we have
	// to do a topological sort
	vars.forEach((calcVar, index) => {
		//console.log('vars.forEach() called with calcVar = ');
		//console.log(calcVar.toJS());
		//console.log(' and index = ' + index);
			
		// Filter for outputs only	
		if(calcVar.get('direction') == 'output') {
			
			// Recalculate the rawVal for the variable by calling it's
			// 'outputFn'.
			var rawVal = calcVar.get('outputFn')(vars);
			//console.log('rawVal = ' + rawVal);
						
			vars = vars.setIn([index, 'rawVal'], rawVal);

			// Find the index of the selected unit for this variable

			var selUnitIndex = findUnitIndexByLabel(
				calcVar.get('units'),
				calcVar.get('selUnitValue'));
			//console.log('Selected unit index = ' + selUnitIndex);						

			// Now we need to work out whether the 'eq' variable for the selected unit is just a number (a multiplier)
			// or an object with two functions
			var dispVal;
			if(typeof calcVar.getIn(['units', selUnitIndex, 'eq']) === 'function') {
				//console.log('eq for "' + calcVar.units[selUnitIndex].label + '" unit is a function.');

				// Since we know 'eq' is a function, lets call it to work out what the rawVal is...
				dispVal = calcVar.getIn(['units', selUnitIndex, 'eq'])(rawVal, 'output');

			} else {
				//console.log('eq for "' + calcVar.units[selUnitIndex].label + '" units is a number.');
				dispVal = rawVal/calcVar.getIn(['units', selUnitIndex, 'eq']);
			}


			// Now calculate displayed value using raw value
			// and selected units
			//var dispVal = rawVal/calcVar.selUnitValue;
			//console.log('Re-calculated "' + calcVar.get('id') + '", rawVal = "' + rawVal + '", dispVal = "' + dispVal + '.');
			vars = vars.setIn([index, 'dispVal'], dispVal);

			//console.log('dispVal = ' + vars.getIn([index, 'dispVal']));

			// Validate
			vars = validateVar(vars, index);
		}
	});	

	return vars;

}

//! @brief			Validates a calculator variable.
//! @param			calcVars 		An array of all the calculator variables.
//! @param			calcVarIndex 	The index of the calculator variable you wish to validate.
//! @side-effects 	Saves the worst validation state returned from any of the validator functions 
//!					into the calculator variable. This could be 'ok', 'warning' or 'error'.
//!					Saves tooltipText into the calculator variable.
export function validateVar(calcVars, calcVarIndex) {
	//console.log('utility.validateVar() called for "' + calcVars.getIn([calcVarIndex, 'id']) + '".');
	//console.log('validators = ');
	//console.log(calcVars.getIn([calcVarIndex, 'validators']).toJS());

	// Validators are optional, so check to see if they exist
	/*if(typeof calcVar.validators === 'undefined') {
		calcVar.worstValidationResult = 'ok';
		return; 
	}*/



	var worstResult = 'ok';

	// This variable is for building up the text to display in the tooltip.
	// It will be populated with violation info.
	var tooltipText = '';

	// Iterate over every validator for the specified variable we wish to validate
	calcVars.getIn([calcVarIndex, 'validators']).forEach((validator) => {
		// ALWAYS pass rawVal as first parameter to validator function
		// More complicated validators may need access to the other calculator variables,
		// and that is why it is passed in second.
		var validationResult = validator.get('fn')(calcVars.getIn([calcVarIndex, 'rawVal']), calcVars);
		//console.log('validationResult = ' + validationResult);			

		if(!validationResult) {
			// Something did not validate, lets find out it's severity and take appropriate
			// action
			switch(validator.get('severity')) {
				case 'warning':
					if(worstResult == 'ok') {
						worstResult = 'warning';
					}
					tooltipText += validator.get('msg');
					break;
				case 'error':
					worstResult = 'error';
					tooltipText += validator.get('msg');
					break;
				default:
					throw 'ERROR: Validator severity "' + validator.severity + '" for variable "' + calcVars.getIn([calcVarIndex, 'id']) + 
						'" is not valid! (must be "warning" or "error")';
			}

		}

	});

	if(worstResult == 'ok') {
		// If we are here, and the worst result is 'ok', then we can add the text 
		tooltipText = 'Value is o.k.';
	}


	// Save the worst result into the calculator variable
	calcVars = calcVars.setIn([calcVarIndex, 'worstValidationResult'], worstResult);
	calcVars = calcVars.setIn([calcVarIndex, 'tooltipText'], tooltipText);

	//console.log('worstResult = ' + calcVars.getIn([calcVarIndex, 'worstValidationResult']));

	return calcVars;
}

//! @brief		Utility function that gets a calculator variable value when provided with the
//!				array of variables and then variable name.
//! @details	Returns the variable taking into account the unit multiplier (e.g. should be returned
//!				in SI units, if your using an SI unit for a multiplier of 1).
export function getVal(vars, varId) {
	// Profiling test
	//return 2;
	return vars.getIn([findVarIndexById(vars, varId), 'rawVal']);
}

