//!
//! @file               psb-track-width.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2014-11-19
//! @last-modified      2015-12-08
//! @brief              Contains the PCB track width calculator data for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

'use strict';

// npm modules
import React from 'react';
var PureRenderMixin = require('react-addons-pure-render-mixin');
import { Panel } from 'react-bootstrap';

// User modules
import { getVal } from '../../../utility/utility.js';
import * as calcActions from '../../../actions/calc-actions.js';
import { CalcTable } from '../../../components/CalcTable.js';
import { CalcTableRow } from '../../../components/CalcTableRow.js';

var Latex = require('react-latex');

var NumberRow = React.createClass({

	mixins: [PureRenderMixin],


	render: function() {

		return <tr>
			<td>{this.props.calcVar.name}</td>
			<td><Latex>{this.props.calcVar.symbol}</Latex></td>
			<td>
				<CalcInput
					value={this.props.varData.get('dispVal')}
					overlay={this.props.varData.get('tooltipText')}
					disabled={isInputDisabled}
					bsStyle={bsStyle}
					onChange={this.onValueChange} />
				
			</td>
		</tr>;
	},

});

var CustomCalcTable = React.createClass({

	mixins: [PureRenderMixin],


	render: function() {

		console.log('CustomCalcTable.render() called. this.props = ');
		console.log(this.props);
		//console.log('and this.props.data.toJS() = ');
		//console.log(this.props.data.toJS());
		//console.log('CalcTableRow = ');
		//console.log(CalcTableRow);

		//var className = "calculatorTable " + this.props.size;

		return (
			<div>				
				<table>
					<tbody>
						{/* This generates the rows of the table which contain the calculator variables */}			
						{this.props.children}
					</tbody>
				</table>			
			</div>
		);
	},

});

//==================================================================================//
//==================================== CURRENT (input) =============================//
//==================================================================================//
var calcVarCurrent = {
		id: 'i',
		name: 'Current',
		symbol: '$I$',
		dispVal: '',
		sf: 3,
		units: [
			{ label: 'uA', eq: 1e-6 },
			{ label: 'mA', eq: 1e-3 },
			{ label: 'A', eq: 1 },
		],
		selUnitValue: 'A',		
		direction: 'input',
		validators: [
			{
				msg: 'The current cannot be negative or 0.',
				fn: (val) => {
					return (val > 0.0);
				},
				severity: 'error',
			},
			{
				msg: 'The current is above the recommended maximum (35A). Equation will not be as accurate (extrapolation will occur).',
				fn: (val) => {
					return (val > 35.0);
				},
				severity: 'warning',
			},
		],
		showRadio: false,			
};

export var data = {

	id: 'pcbTrackWidth',
	name: 'PCB Track Width',
	description: 'Calculate the required track width for a given current.',
	categoryPath: [ 'Electronics', 'PCB' ],
	tags: 'pcb, track, width, current',
	imageSrc: __dirname + '/icon.png',



	// This is the React view for this calculator
	view: React.createClass({

		mixins: [PureRenderMixin],

		componentDidMount: function() {
			//console.log('ResistorDivider.componentDidMount() called.');
		},


		render: function() {
			//console.log('ResistorDivider.render() called.');
			//console.log('__dirname = ' + __dirname);
			return (
				<div>
					<Panel collapsible header="Info">						
						<div className="intro">
							<img src={ __dirname + '/variable-diagram.png'} style={{float: 'right', height:400}} />
							<Latex>{'The following calculator works out either $V_{in}$, $R_1$, $R_2$, or $V_{out}$, given the other three parameters, using the resistive voltage divider equation:'}</Latex>
							<p className="centered"><Latex>{'$V_{out}=\\frac{R_2}{R_1+R_2}V_{in}$'}</Latex></p>
							<p className="centered">where:<br />
								<Latex>{'$V_{in}$ = input voltage'}</Latex><br />
								<Latex>{'$R_1$ = resistance of resistor 1 (see diagram)'}</Latex><br />
								<Latex>{'$R_2$ = resistance of resistor 2 (see diagram)'}</Latex><br />
								<Latex>{'$V_{out}$ = output voltage'}</Latex>
							</p>
							<p><Latex>{'It is assumed that the output impedance on $V_{out}$ is significantly higher than $R_2$ so that it doesnt matter (for example, $V_{out}$ is connected to an op-amp input, analogue microcontroller input or similar).'}</Latex></p>
							<p><Latex>{'The quiescent current through the divider, $I_q$, is also calculated, which can be useful to know when designing power-saving circuits. The equation to find $I_q$ is:'}</Latex></p>
							<p className="centered"><Latex>{'$I_q = \\frac{V_{in}}{R_1+R_2}$'}</Latex></p>													
						</div>	
					</Panel>
					<br />
					{/*<img src={ __dirname + '/resistor-divider-diagram.png'} style={{float: 'right', height:400}} />*/}
					<br />	

					{/*<CalcTable
						data={this.props.data}
						dispatch={this.props.dispatch}
						size="large"/>*/}	

					<CustomCalcTable>
						<NumberRow calcVar={calcVarCurrent}/>

					</CustomCalcTable>

				</div>		
	    	);
		},
	}),


	vars: [

		//==================================================================================//
		//==================================== CURRENT (input) =============================//
		//==================================================================================//
		{
			id: 'i',
			name: 'Current',
			symbol: '$I$',
			dispVal: '',
			sf: 3,
			units: [
				{ label: 'uA', eq: 1e-6 },
				{ label: 'mA', eq: 1e-3 },
				{ label: 'A', eq: 1 },
			],
			selUnitValue: 'A',		
			direction: 'input',
			validators: [
				{
					msg: 'The current cannot be negative or 0.',
					fn: (val) => {
						return (val > 0.0);
					},
					severity: 'error',
				},
				{
					msg: 'The current is above the recommended maximum (35A). Equation will not be as accurate (extrapolation will occur).',
					fn: (val) => {
						return (val > 35.0);
					},
					severity: 'warning',
				},
			],
			showRadio: false,			
		},

		//==================================================================================//
		//==================================== TEMP RISE (input) ===========================//
		//==================================================================================//
		{
			id: 'tempRise',
			name: 'Temp. Rise',
			symbol: '$\\Delta T$',
			dispVal: '',
			sf: 3,
			units: [
				{ label: '°C', eq: 1 },
			],
			selUnitValue: '°C',		
			direction: 'input',
			validators: [
				{
					msg: 'The temp. rise cannot be negative or 0.',
					fn: (val) => {
						return (val > 0.0);
					},
					severity: 'error',
				},
				{
					msg: 'Temp. rise is below the recommended minimum (10°C). Equation will not be as accurate (extrapolation will occur).',
					fn: (val) => {
						return (val > 10.0);
					},
					severity: 'warning',
				},
				{
					msg: 'Temp. rise is above the recommended minimum (100°C). Equation will not be as accurate (extrapolation will occur).',
					fn: (val) => {
						return (val < 100.0);
					},
					severity: 'warning',
				},
			],
			showRadio: false,			
		},

		//==================================================================================//
		//============================= COPPER THICKNESS (input) ===========================//
		//==================================================================================//
		{
			id: 'copperThickness',
			name: 'Copper Thickness',
			symbol: '$h$',
			dispVal: '',
			sf: 3,
			units: [
				{ label: 'um', eq: 1e-6 },
				{ label: 'oz', eq: 35.0012e-6 },
			],
			selUnitValue: 'um',		
			direction: 'input',
			validators: [
				{
					msg: 'The copper thickness cannot be negative or 0.',
					fn: (val) => {
						return (val > 0.0);
					},
					severity: 'error',
				},
				{
					msg: 'Copper thickness is below recommended minimum (17.5um or 0.5oz). Equation will not be as accurate (extrapolation will occur).',
					fn: (val) => {
						return (val > 17.5e-6);
					},
					severity: 'warning',
				},
				{
					msg: 'Copper thickness is above recommended maximum (105um, or 3oz). Equation will not be as accurate (extrapolation will occur).',
					fn: (val) => {
						return (val < 105.0036e-6);
					},
					severity: 'warning',
				},
			],
			showRadio: false,			
		},

		//==================================================================================//
		//================================= TRACK WIDTH (output) ===========================//
		//==================================================================================//
		{
			id: 'minTrackWidth',
			name: 'Minimum Track Width',
			symbol: '$w_{min}$',
			dispVal: '',
			sf: 3,
			units: [
				{ label: 'um', eq: 1e-6 },
				{ label: 'mm', eq: 1e-3 },
			],
			selUnitValue: 'um',		
			direction: 'output',
			outputFn: function(vars) {		
				//return getVal(vars, 'current') * getVal(vars, 'resistance');	
				//return ((getVal(vars, 'vOut')*(getVal(vars, 'r1') + getVal(vars, 'r2')))/getVal(vars, 'r2'));		
				return 99.9;

				//if(getVal(vars, 'traceLocation') == 'externalTrace')     
				//{
					//Log('External trace selected.');
					crossSectionalArea = (Math.pow((current/(0.048*Math.pow(this.tempRise.val(), 0.44))), 1/0.725));
					//Log('Cross-sectional area = ' + crossSectionalArea);
					width = (crossSectionalArea/(this.copperThickness.val()*1000000.0/25.4))*(25.4/1000000.0);
					return width;
				//}
				//else if(getVal(vars, 'traceLocation') == 'internalTrace')
				//{
					//Log('Internal trace selected.');
					crossSectionalArea = (Math.pow((current/(0.024*Math.pow(this.tempRise.val(), 0.44))), 1/0.725));
					//Log('Cross-sectional area = ' + crossSectionalArea);
					width = (crossSectionalArea/(this.copperThickness.val()*1000000.0/25.4))*(25.4/1000000.0);
					return width;
				//}


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
			showRadio: false,			
		},

		

	],
}

