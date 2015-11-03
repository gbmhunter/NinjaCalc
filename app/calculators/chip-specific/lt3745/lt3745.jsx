//!
//! @file               lt3745.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-03
//! @last-modified      2015-11-03
//! @brief              Contains the data for the LT3745 calculator.
//! @details
//!     See README.rst in repo root dir for more info.

import { getVal } from '../../../utility/utility.js';

var lt3745Calc = {

	id: 'lt3745',
	name: 'LT3745 Calculator',
	tags: 'ic, linear tech, led',

	vars: [
		{
			id: 'vSupp',
			name: 'Supply Voltage',
			val: '2',
			units: [
				{ label: 'V', value: 1 },
			],		
			selUnit: 'V',
			direction: 'input',
		},
		{
			id: 'vLoad',
			name: 'Load Voltage',
			val: '2',
			units: [
				{ label: 'V', value: 1 },
			],	
			selUnit: 'V',	
			direction: 'input',
		},
		{
			id: 'vOutMax',
			name: 'Maximum Output Voltage',
			val: '2',
			units: [
				{ label: 'V', value: 1 },
			],	
			selUnit: 'V',	
			direction: 'input',
		},
		{
			id: 'vInMin',
			name: 'Minimum Output Voltage',
			val: '2',
			units: [
				{ label: 'V', value: 1 },
			],
			selUnit: 'V',		
			direction: 'output',
			outputFn: (vars) => {
				var tempVal = getVal(vars, 'vOutMax') + 2.1;
			
				// Vin(min) cannot be less than 6.0V
				if(tempVal < 6.0)
					return 6.0;
					
				return tempVal;
			},
		},
	]
}

export default lt3745Calc;
