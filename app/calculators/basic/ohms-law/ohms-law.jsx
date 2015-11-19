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
import { Panel } from 'react-bootstrap';

// User modules
import { getVal } from '../../../utility/utility.js';
import { CalcTable } from '../../../components/CalcTable.js';
import { CalcTableRow } from '../../../components/CalcTableRow.js';

var ohmsLawCalc = {

	id: 'ohmsLaw',
	name: 'Ohm\'s Law',
	description: 'The hammer in any electrical engineers toolbox. Calculate voltage, resistance and current using Ohm\'s law.',
	tags: 'ohm, law, resistance, voltage, current',
	imageSrc: __dirname + '/icon.png',

	// This is the React view for this calculator
	view: React.createClass({

		mixins: [PureRenderMixin],

		render: function() {
			return (
				<div>		
					<Panel collapsible header="Info">	
						<div className="intro">
							<p>The following calculator works out either voltage, current or resistance, given the other two parameters, using the equation:</p>
							<p className="centered">
								<Latex>$V = IR$</Latex><br />
								where: <br />
								<Latex>$V$</Latex> = voltage across the resistor<br />
								<Latex>$I$</Latex> = current through the resistor <br />
								<Latex>$R$</Latex> = resistance of the resistor
							</p>
						</div>
					</Panel>
					<CalcTable data={this.props.data} dispatch={this.props.dispatch} />			
				</div>	
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
			comments: 'The voltage across the resistive element.',
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
			comments: 'The current through the resistive element.',
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
			comments: 'The resistance of the resistive element.',
		},
	],
}

export default ohmsLawCalc;

