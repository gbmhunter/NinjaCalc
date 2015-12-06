//!
//! @file               rc-time-constant.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-26
//! @last-modified      2015-11-26
//! @brief              Contains the RC time constant calculator data for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

// npm modules
import React from 'react';
var PureRenderMixin = require('react-addons-pure-render-mixin');
import { Panel } from 'react-bootstrap';

// User modules
import { getVal } from '../../../utility/utility.js';
import { CalcTable } from '../../../components/CalcTable.js';
import { CalcTableRow } from '../../../components/CalcTableRow.js';

export var data = {

	id: 'rcTimeConstant',
	name: 'RC Time Constant',
	description: 'Calculate the rate of charge.',
	categoryPath: [ 'Electronics', 'Basic' ],
	tags: 'resistance, rc, voltage, current',
	imageSrc: __dirname + '/icon.png',


	// This is the React view for this calculator
	view: React.createClass({

		mixins: [PureRenderMixin],

		componentDidMount: function() {
			//console.log('OhmsLaw.componentDidMount() called.');
		},

		/*shouldComponentUpdate: function(nextProps, nextState) {
		  return nextProps.data !== this.props.data;
		},*/

		render: function() {
			//console.log('OhmsLaw.render() called. this.props = ');
			//console.log(this.props);
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
					<CalcTable
						data={this.props.data}
						dispatch={this.props.dispatch}
						size="large"/>			
				</div>	
	    	);
		},

	}),

	vars: [
		{
			id: 'resistance',
			name: 'Resistance',
			symbol: '$R$',
			dispVal: '',
			sf: 3,
			units: [
				{ label: 'm‎Ω', eq: 1e-3 },
				{ label: '‎Ω', eq: 1 },
				{ label: 'k‎Ω', eq: 1e3 },
				{ label: 'M‎Ω', eq: 1e6 },
			],
			selUnitValue: '‎kΩ',	
			direction: 'input',
			outputFn: function(vars) {						
				//console.log('getVal(\'Voltage\') =' + getVal(vars, 'Voltage'));
				//console.log(initialState.vars);
				var result = getVal(vars, 'timeConstant') / getVal(vars, 'capacitance');
				//console.log('result = ' + result);
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
		{
			id: 'capacitance',
			name: 'Capacitance',
			symbol: '$C$',
			dispVal: '',
			sf: 3,
			units: [
				{ label: 'pF', eq: 1e-12 },
				{ label: '‎nF', eq: 1e-9 },
				{ label: 'uF', eq: 1e-6 },
				{ label: 'mF', eq: 1e-3 },
				{ label: 'F', eq: 1 },
			],
			selUnitValue: '‎uF',	
			direction: 'input',
			outputFn: function(vars) {						

				var result = getVal(vars, 'timeConstant') / getVal(vars, 'voltage');
				//console.log('result = ' + result);
				return result;
			},
			validators: [
				{
					msg: 'Capacitance shouldn\'t really be negative.',
					fn: (val) => {
						return (val >= 0.0);
					},
					severity: 'warning',
				}
			],
			showRadio: true,
		},
		{
			id: 'timeConstant',
			name: 'Time Constant',
			symbol: '$T$',
			dispVal: '',
			sf: 3,
			units: [
				{ label: 'ps', eq: 1e-12 },
				{ label: '‎ns', eq: 1e-9 },
				{ label: 'us', eq: 1e-6 },
				{ label: 'ms', eq: 1e-3 },
				{ label: 's', eq: 1 },
			],
			selUnitValue: '‎ms',	
			direction: 'output',
			outputFn: function(vars) {						

				var result = getVal(vars, 'resistance') * getVal(vars, 'capacitance');
				//console.log('result = ' + result);
				return result;
			},
			validators: [
				{
					msg: 'The time constant shouldn\'t really be negative.',
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

