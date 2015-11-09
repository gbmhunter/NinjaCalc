//!
//! @file               lt3745.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-03
//! @last-modified      2015-11-09
//! @brief              Contains the data for the LT3745 calculator.
//! @details
//!     See README.rst in repo root dir for more info.

import { getVal } from '../../../utility/utility.js';
import * as calcActions from '../../../actions/calc-actions.js';

export var data = {

	id: 'lt3745',
	name: 'LT3745 Calculator',
	tags: 'ic, linear tech, led',

	vars: [

		//==============================================================================//
		//================================== vSupp =====================================//
		//==============================================================================//
		{
			id: 'vSupp',
			name: 'Supply Voltage',
			val: '2',
			units: [
				{ label: 'V', eq: 1 },
			],		
			selUnitValue: 'V',
			direction: 'input',
			validators: [
				{
					msg: 'Supply voltage must be between 3.0 and 5.0V.',
					fn: (val) => {						
						return (val >= 3.0 && val <= 5.5);
					},
					severity: 'error',
				}
			],
		},

		//==============================================================================//
		//================================ Vload (input) ===============================//
		//==============================================================================//
		{
			id: 'vLoad',
			name: 'Load Voltage',
			val: '2',
			units: [
				{ label: 'V', eq: 1 },
			],	
			selUnitValue: 'V',	
			direction: 'input',
			validators: [
				{
					msg: 'The load voltage must be positive.',
					fn: (val) => {				
						return (val >= 0);
					},
					severity: 'error',
				}
			],
		},

		//==============================================================================//
		//================================= vOutMax (input) ============================//
		//==============================================================================//
		{
			id: 'vOutMax',
			name: 'Maximum Output Voltage',
			val: '2',
			units: [
				{ label: 'V', eq: 1 },
			],	
			selUnitValue: 'V',	
			direction: 'input',
			validators: [
				{
					msg: 'vOutMax is recommended to be between 0.8-3.0V higher than Vload for the best current regulation.',
					fn: (val, vars) => {
						return ((val >= getVal(vars, 'vLoad') + 0.8) && (val <= getVal(vars, 'vLoad') + 3.0));
					},
					severity: 'error',
				},
			],
		},

		//==============================================================================//
		//============================ Vin(min) (output) ===============================//
		//==============================================================================//
		{
			id: 'vInMin',
			name: 'Minimum Input Voltage',
			val: '2',
			units: [
				{ label: 'V', eq: 1 },
			],
			selUnitValue: 'V',	
			direction: 'output',
			outputFn: (vars) => {
				var tempVal = getVal(vars, 'vOutMax') + 2.1;
			
				// Vin(min) cannot be less than 6.0V
				if(tempVal < 6.0)
					return 6.0;
					
				return tempVal;
			},
		},

		//==============================================================================//
		//============================ Vin(max) (input) ================================//
		//==============================================================================//
		{
			id: 'vInMax',
			name: 'Maximum Input Voltage',
			units: [
				{ label: 'V', eq: 1 },
			],
			selUnitValue: 'V',	
			direction: 'input',
			validators: [
				{
					msg: 'vInMax must be greater or equal to 0 and less or equal to 55V.',
					fn: (val) => {
						return (val >= 0) && (val <= 55);
					},
					severity: 'error',
				},
				{
					msg: 'vInMax must be greater or equal to vInMin.',
					fn: (val, vars) => {
						return (val >= getVal(vars, 'vInMin'));
					},
					severity: 'error',
				},
			],
		},

		//==============================================================================//
		//================================ Rfb1 (input) ================================//
		//==============================================================================//
		{
			id: 'rfb1',
			name: 'Rfb1',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },
			],
			selUnitValue: 'Ω',	
			direction: 'input',
			validators: [
				{
					msg: 'Rfb1 is recommended to be 10k.',
					fn: (val) => {
						return (val == 10000.0);
					},
					severity: 'warning',
				},
			],
		},

		//==============================================================================//
		//============================== Rfb2 (output) =================================//
		//==============================================================================//
		{
			id: 'rfb2',
			name: 'Rfb2',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },
			],
			selUnitValue: 'Ω',	
			direction: 'output',
			outputFn: (vars) => {
				return (getVal(vars, 'rfb1')*(getVal(vars, 'vOutMax')/1.205 - 1));	
			},
		},

		//==============================================================================//	
		//============================= Iout(max) (input) ==============================//
		//==============================================================================//
		{
			id: 'iOutMax',
			name: 'Iout(max)',
			units: [
				{ label: 'mA', eq: 1e-3 },
				{ label: 'A', eq: 1 },
			],
			selUnitValue: 'A',	
			direction: 'input',
		},

		//==============================================================================//
		//============================ Rsense (output) =================================//
		//==============================================================================//
		{
			id: 'rSense',
			name: 'Rsense',
			units: [
				{ label: 'mΩ', eq: 1e-3 },
				{ label: 'Ω', eq: 1 },
			],
			selUnitValue: 'mΩ',	
			direction: 'output',
			outputFn: (vars) => {
				return 0.035/getVal(vars, 'iOutMax');	
			},
		},

		//==============================================================================//
		//============================== Prsense (output) ==============================//
		//==============================================================================//
		{
			id: 'prSense',
			name: 'Prsense',
			units: [
				{ label: 'mW', eq: 1e-3 },
				{ label: 'W', eq: 1 },
			],
			selUnitValue: 'mW',	
			direction: 'output',
			outputFn: (vars) => {
				return Math.pow(getVal(vars, 'iOutMax'), 2)*getVal(vars, 'rSense');	
			},
		},

		//==============================================================================//
		//============================== iLedPinNom (input) ============================//
		//==============================================================================//
		{
			id: 'iLedPinNom',
			name: 'Iled,pin(nom)',
			units: [
				{ label: 'mA', eq: 1e-3 },				
			],
			selUnitValue: 'mA',	
			direction: 'input',
			validators: [
				{
					msg: 'iLedPin(nom) must be between 10-50mA.',
					fn: (val) => {
						return (val >= 0.01 && val <= 0.05)
					},
					severity: 'error',
				},
			],
		},

		//==============================================================================//
		//================================ Riset (output) ==============================//
		//==============================================================================//
		{
			id: 'riSet',
			name: 'Riset',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },
			],
			selUnitValue: 'kΩ',	
			direction: 'output',
			outputFn: (vars) => {
				return 2500*(1.205/getVal(vars, 'iLedPinNom'));	
			},
		},

		//==============================================================================//
		//================================== Vd,f (input) ==============================//
		//==============================================================================//
		{
			id: 'vdf',
			name: 'Vdf',
			units: [
				{ label: 'V', eq: 1 },				
			],
			selUnitValue: 'V',	
			direction: 'input',		
		},

		//==============================================================================//
		//================================= Dmin (output) ==============================//
		//==============================================================================//
		{
			id: 'dMin',
			name: 'Dmin',
			units: [
				{ label: '%', eq: 1e-2 },				
			],
			selUnitValue: '%',	
			direction: 'output',
			outputFn: (vars) => {
				return (getVal(vars, 'vOutMax') + getVal(vars, 'vdf'))/(getVal(vars, 'vInMax') + getVal(vars, 'vdf'));	
			},
		},

		//==============================================================================//
		//================================= Dmax (output) ==============================//
		//==============================================================================//
		{
			id: 'dMax',
			name: 'Dmax',
			units: [
				{ label: '%', eq: 1e-2 },				
			],
			selUnitValue: '%',	
			direction: 'output',
			outputFn: (vars) => {
				return (getVal(vars, 'vOutMax') + getVal(vars, 'vdf'))/(getVal(vars, 'vInMin') + getVal(vars, 'vdf'));	
			},
		},

		//==============================================================================//
		//================================ ton(min) (input) ============================//
		//==============================================================================//
		{
			id: 'tOnMin',
			name: 'ton(min)',
			units: [
				{ label: 'ns', eq: 1e-9 },				
			],
			selUnitValue: 'ns',	
			direction: 'input',
			validators: [
				{
					msg: 'ton(min) should be between 1-500ns.',
					fn: (val) => {
						return (val >= 1e-9 && val <= 500e-9)
					},
					severity: 'warning',
				},
			],
		},

		//==============================================================================//
		//================================ ton(min) (input) ============================//
		//==============================================================================//
		{
			id: 'tOffMin',
			name: 'toff(min)',
			units: [
				{ label: 'ns', eq: 1e-9 },				
			],
			selUnitValue: 'ns',	
			direction: 'input',
			validators: [
				{
					msg: 'toff(min) should be between 1-500ns.',
					fn: (val) => {
						return (val >= 1e-9 && val <= 500e-9)
					},
					severity: 'warning',
				},
			],
		},

		//==============================================================================//
		//=============================== fsw(max) (output) ============================//
		//==============================================================================//
		{
			id: 'fSwMax',
			name: 'fSwMax',
			units: [
				{ label: 'kHz', eq: 1e3 },				
			],
			selUnitValue: 'kHz',	
			direction: 'output',
			outputFn: (vars) => {
				// fsw(max) = min( Dmin/ton(min) , (1 - Dmax)/toff(min) )
				return Math.min(getVal(vars, 'dMin')/getVal(vars, 'tOnMin'), (1.0 - getVal(vars, 'dMax'))/getVal(vars, 'tOffMin'));	
			},
		},

	]
}

