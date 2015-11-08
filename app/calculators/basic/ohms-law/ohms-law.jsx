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
			rawVal: '',
			dispVal: '',
			units: [
				{ label: 'mV', eq: 1e-3 },
				{ label: 'V', eq: 1 },
				{ 
					label: 'T',
					eq: (value, dir) => {
						if(dir == 'input') {
							return 2;
						} else {
							return 4;
						}
					}
				}
			],
			selUnitValue: 'V',		
			direction: 'input',
			outputFn: function(vars) {		
				return getVal(vars, 'current') * getVal(vars, 'resistance');								
			},
			validators: [
				{
					msg: 'Voltage cannot be less than 0.',
					fn: (rawVal) => {
						if(rawVal < 0) {return 'error'} else {return 'ok'} ;
					},
				}
			],
			showRadio: true,
		},
		{
			id: 'current',
			name: 'Current',
			rawVal: '',
			dispVal: '',
			units: [
				{ label: 'nA', eq: 1e-9 },
				{ label: 'uA', eq: 1e-6 },
				{ label: 'mA', eq: 1e-3 },
				{ label: 'A', eq: 1 },
			],
			selUnitValue: 'A',	
			direction: 'input',
			outputFn: function(vars) {		
				return getVal(vars, 'voltage') / getVal(vars, 'resistance');								
			},
			showRadio: true,
		},
		{
			id: 'resistance',
			name: 'Resistance',
			rawVal: '',
			dispVal: '',
			units: [
				{ label: 'm‎Ω', eq: 1e-3 },
				{ label: '‎Ω', eq: 1 },
				{ label: 'k‎Ω', eq: 1e3 },
				{ label: 'M‎Ω', eq: 1e6 },
			],
			selUnitValue: '‎Ω',	
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

