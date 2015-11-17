//!
//! @file               ohms-law.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-17
//! @brief              Contains the Ohm's Law calculator data for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

// npm modules
import React from 'react';

// User modules
import { getVal } from '../../../utility/utility.js';
import { CalcTable } from '../../../components/CalcTable.js';
import { CalcTableRow } from '../../../components/CalcTableRow.js';

var ohmsLawCalc = {

	id: 'ohmsLaw',
	name: 'Ohm\'s Law',
	description: 'The hammer in any electrical engineers toolbox. Calculate voltage, resistance and current using Ohm\'s law.',
	tags: 'ohm, law, resistance, voltage, current',
	imageSrc: './calculators/basic/ohms-law/icon.png',

	// This is the React view for this calculator
	view: React.createClass({

		mixins: [PureRenderMixin],

		render: function() {
			return (			
				<CalcTable data={this.props.data} dispatch={this.props.dispatch}>
				</CalcTable>			
	    	);
		},

	}),

	vars: [
		{
			id: 'voltage',
			name: 'Voltage',
			dispVal: '',
			units: [
				{ label: 'mV', eq: 1e-3 },
				{ label: 'V', eq: 1 },
			],
			selUnitValue: 'V',		
			direction: 'input',
			outputFn: function(vars) {		
				return getVal(vars, 'current') * getVal(vars, 'resistance');								
			},
			validators: [
				{
					msg: 'Voltage shouldn\'t really be negative.',
					fn: (val) => {
						return (val >= 0.0);
					},
					severity: 'warning',
				}
			],
			showRadio: true,
		},
		{
			id: 'current',
			name: 'Current',
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
			validators: [
				{
					msg: 'Current shouldn\'t really be negative.',
					fn: (val) => {
						return (val >= 0.0);
					},
					severity: 'warning',
				}
			],
			showRadio: true,
		},
		{
			id: 'resistance',
			name: 'Resistance',
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
			validators: [
				{
					msg: 'Resistance shouldn\'t really be negative.',
					fn: (val) => {
						return (val >= 0.0);
					},
					severity: 'warning',
				}
			],
			showRadio: true,
		},
	],
}

export default ohmsLawCalc;

