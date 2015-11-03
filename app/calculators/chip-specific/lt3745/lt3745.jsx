//!
//! @file               lt3745.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-03
//! @last-modified      2015-11-03
//! @brief              Contains the data for the LT3745 calculator.
//! @details
//!     See README.rst in repo root dir for more info.


var lt3745Calc = {

	name: 'LT3745',

	vars: [
		{
			id: 'vSupp',
			name: 'Supply Voltage',
			val: '2',
			units: 'V',		
			direction: 'input',
		},
		{
			id: 'vLoad',
			name: 'Load Voltage',
			val: '2',
			units: 'V',		
			direction: 'input',
		},
		{
			id: 'vOutMax',
			name: 'Maximum Output Voltage',
			val: '2',
			units: 'V',		
			direction: 'input',
		},
		{
			id: 'vInMin',
			name: 'Minimum Output Voltage',
			val: '2',
			units: 'V',		
			direction: 'output',
		},
	]
}

export default lt3745Calc;
