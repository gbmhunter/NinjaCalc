//!
//! @file               ohms-law.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-03
//! @brief              Contains the "redux" reducer for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

import { getVal } from '../../../utility/utility.js';

var ohmsLawCalc = {

	id: 'ohmsLaw',
	name: 'Ohm\'s Law Calculator',
	tags: 'ohm, law, resistance, voltage, current',

	//calcType: 'simpleSwitchable',

	vars: [
		{
			id: 'voltage',
			name: 'Voltage',
			val: '2',
			units: [
				{ label: 'mV', value: 1e-3 },
				{ label: 'V', value: 1 },
			],
			selUnitValue: 1,		
			direction: 'input',
			outputFn: function(vars) {		
				return getVal(vars, 'current') * getVal(vars, 'resistance');								
			},
			showRadio: true,
		},
		{
			id: 'current',
			name: 'Current',
			val: '',
			units: [
				{ label: 'I', value: 1 },
			],
			selUnitValue: 1,	
			direction: 'input',
			outputFn: function(vars) {		
				return getVal(vars, 'voltage') / getVal(vars, 'resistance');								
			},
			showRadio: true,
		},
		{
			id: 'resistance',
			name: 'Resistance',
			val: '',
			units: [
				{ label: 'R', value: 1 },
			],
			selUnitValue: 1,	
			direction: 'output',
			outputFn: function(vars) {						

				//console.log('getVal(\'Voltage\') =' + getVal(vars, 'Voltage'));
				//console.log(initialState.vars);

				var result = getVal(vars, 'voltage') / getVal(vars, 'current');
				console.log('result = ' + result);
				return result;
			},
			showRadio: true,
		},
	],
}

export default ohmsLawCalc;

