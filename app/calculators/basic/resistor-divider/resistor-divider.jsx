//!
//! @file               resistor-divider.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2012-11-26
//! @last-modified      2015-11-17
//! @brief              Contains the Resistor Divider calculator data for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

// npm modules
import React from 'react';


// User modules
import { getVal } from '../../../utility/utility.js';
import * as calcActions from '../../../actions/calc-actions.js';
import { CalcTable } from '../../../components/CalcTable.js';
import { CalcTableRow } from '../../../components/CalcTableRow.js';


export var data = {

	id: 'resistorDivider',
	name: 'Resistor Divider',
	description: 'One of the most versatile commonly used electronic designs. Useful for reducing a voltage.',
	tags: 'resistor, divider, leg, r1, r2, resistance, voltage',
	imageSrc: './calculators/basic/resistor-divider/icon.png',

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
			symbol: '$V$',
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
			symbol: '$I$',
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
			symbol: '$R$',
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

