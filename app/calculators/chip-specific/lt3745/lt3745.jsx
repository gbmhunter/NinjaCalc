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
			name: 'fsw(max)',
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

		//==============================================================================//
		//================================ fsw(act) (input) ============================//
		//==============================================================================//
		{
			id: 'fSwAct',
			name: 'fsw(act)',
			units: [
				{ label: 'kHz', eq: 1e3 },				
			],
			selUnitValue: 'kHz',	
			direction: 'input',
			validators: [
				{
					msg: 'fsw(act) has to be between 100kHz-1MHz.',
					fn: (val) => {
						return (val >= 100e3 && val <= 1e6);
					},
					severity: 'error',
				},
				{
					msg: 'fsw(act) cannot be higher than fsw(max).',
					fn: (val, vars) => {
						return (val <= getVal(vars, 'fSwMax'));
					},
					severity: 'error',
				},
			],
		},

		//==============================================================================//
		//================================= fugf (output) ==============================//
		//==============================================================================//
		{
			id: 'fugf',
			name: 'fugf',
			units: [
				{ label: 'kHz', eq: 1e3 },				
			],
			selUnitValue: 'kHz',	
			direction: 'output',
			outputFn: (vars) => {
				// fugf = fsw(act)/10
				return getVal(vars, 'fSwAct')/10.0;
			},
		},

		//==============================================================================//
		//================================== Rt (output) ===============================//
		//==============================================================================//
		{
			id: 'rt',
			name: 'Rt',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },				
			],
			selUnitValue: 'kΩ',	
			direction: 'output',
			outputFn: (vars) => {
				// Rt = 2.25167*10^11 / fSwAct^1.114
				return ((2.25167*Math.pow(10, 11))/(Math.pow(getVal(vars, 'fSwAct'), 1.114)));
			},
		},

		//==============================================================================//
		//================================= tj(max) (input) ============================//
		//==============================================================================//
		{
			id: 'tjMax',
			name: 'tj(max)',
			units: [
				{ label: '°C', eq: 1e3 },				
			],
			selUnitValue: '°C',	
			direction: 'input',
			validators: [
				{
					msg: 'tjMax should really be higher than standard room temperature.',
					fn: (val) => {
						return (val >= 25.0);
					},
					severity: 'warning',
				},
				{
					msg: 'tjMax cannot be higher than the internally set maximum temperature.',
					fn: (val, vars) => {
						return (val <= 165.0);
					},
					severity: 'error',
				},
			],
		},

		//==============================================================================//
		//================================ Rtset (output) ==============================//
		//==============================================================================//
		{
			id: 'rtSet',
			name: 'Rtset',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },				
			],
			selUnitValue: 'kΩ',	
			direction: 'output',
			outputFn: (vars) => {
				// 
				return (0.00172*(getVal(vars, 'tjMax') + 273.15)*getVal(vars, 'riSet')/1.205);
			},
		},

		//==============================================================================//
		//============================== Cout(min) (output) ============================//
		//==============================================================================//
		{
			id: 'cOutMin',
			name: 'cOutMin',
			units: [
				{ label: 'uF', eq: 1e-6 },				
			],
			selUnitValue: 'uF',	
			direction: 'output',
			outputFn: (vars) => {
				// Cout(min) = max( 0.25/(Rsense*fugf) , 1.5/(Rsense*Vbuck,out*fugf) )
				return (Math.max( 0.25/(getVal(vars, 'rSense')*getVal(vars, 'fugf')),
					1.5/(getVal(vars, 'vOutMax')*getVal(vars, 'rSense')*getVal(vars, 'fugf'))));
			},
		},

		//==============================================================================//
		//================================== Il(delta) =================================//
		//==============================================================================//
		{
			id: 'iLDelta',
			name: 'iLDelta',
			units: [
				{ label: '%', eq: 1e-2 },				
			],
			selUnitValue: '%',	
			direction: 'input',
			validators: [
				{
					msg: 'iLDelta should be between 10-50%.',
					fn: (val) => {
						return (val >= 10e-2 && val <= 50e-2);
					},
					severity: 'warning',
				},
			],
		},

		//==============================================================================//
		//================================= L(min) (output) ============================//
		//==============================================================================//
		{
			id: 'lMin',
			name: 'L(min)',
			units: [
				{ label: 'uH', eq: 1e-6 },				
			],
			selUnitValue: 'uH',	
			direction: 'output',
			outputFn: (vars) => {
				// Lmin = [ (Vbuck,out + Vd,f) / (Vin(max) + Vd,f) ] * [ (Vin(max) - Vbuck,out) / (fsw(act)*Il(delta)) ]
				return ( ((getVal(vars, 'vOutMax') + getVal(vars, 'vdf'))/(getVal(vars, 'vInMax') + getVal(vars, 'vdf')))*
					((getVal(vars, 'vInMax') - getVal(vars, 'vOutMax'))/(getVal(vars, 'fSwAct')*getVal(vars, 'iLDelta'))));
			},
		},

		//==============================================================================//
		//================================= Vin(ripple) ================================//
		//==============================================================================//
		{
			id: 'vInRipple',
			name: 'vInRipple',
			units: [
				{ label: 'mV', eq: 1e-3 },				
			],
			selUnitValue: 'mV',	
			direction: 'input',
			validators: [
				{
					msg: 'vInRipple should be between 20mV-2.0V.',
					fn: (val) => {
						return (val >= 20e-3 && val <= 2.0);
					},
					severity: 'warning',
				},
			],
		},

		//==============================================================================//
		//================================ Cin(min) (output) ===========================//
		//==============================================================================//
		{
			id: 'cInMin',
			name: 'Cin(min)',
			units: [
				{ label: 'uF', eq: 1e-6 },				
			],
			selUnitValue: 'uF',	
			direction: 'output',
			outputFn: (vars) => {
				// Cin(min) = (Dmax*Iout(max)) / (Vin,ripple*fsw(act))
				return ( (getVal(vars, 'dMax')*getVal(vars, 'iOutMax'))/(getVal(vars, 'vInRipple')*getVal(vars, 'fSwAct')) );
			},
		},

	]
}

