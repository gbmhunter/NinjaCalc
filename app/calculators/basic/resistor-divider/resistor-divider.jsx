//!
//! @file               resistor-divider.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2012-11-26
//! @last-modified      2015-11-19
//! @brief              Contains the Resistor Divider calculator data for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

'use strict';

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

		componentDidMount: function() {
			console.log('ResistorDivider.componentDidMount() called.');
		},


		render: function() {
			console.log('ResistorDivider.render() called.');
			console.log('__dirname = ' + __dirname);
			return (
				<div>							
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
					<br />		
					<CalcTable data={this.props.data} dispatch={this.props.dispatch} />		
				</div>		
	    	);
		},
	}),


	vars: [

		//==================================================================================//
		//====================================== Vin =======================================//
		//==================================================================================//
		{
			id: 'vIn',
			name: 'Input Voltage',
			symbol: '$V_{in}$',
			dispVal: '',
			units: [
				{ label: 'mV', eq: 1e-3 },
				{ label: 'V', eq: 1 },
			],
			selUnitValue: 'V',		
			direction: 'input',
			outputFn: function(vars) {		
				//return getVal(vars, 'current') * getVal(vars, 'resistance');	
				return ((getVal(vars, 'vOut')*(getVal(vars, 'r1') + getVal(vars, 'r2')))/getVal(vars, 'r2'));							
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

		//==================================================================================//
		//======================================= R1 =======================================//
		//==================================================================================//
		{
			id: 'r1',
			name: 'Resistor 1 (top resistor)',
			symbol: '$R1$',
			dispVal: '',
			units: [
				{ label: 'm‎Ω', eq: 1e-3 },
				{ label: '‎Ω', eq: 1 },
				{ label: 'k‎Ω', eq: 1e3 },
				{ label: 'M‎Ω', eq: 1e6 },
			],
			selUnitValue: 'k‎Ω',	
			direction: 'input',
			outputFn: function(vars) {		
				//return getVal(vars, 'voltage') / getVal(vars, 'resistance');	
				return ((getVal(vars, 'r2')*(getVal(vars, 'vIn') - getVal(vars, 'vOut')))/getVal(vars, 'vOut'));							
			},
			validators: [
				{
					msg: 'Resistance can\'t be negative!',
					fn: (val) => {
						return (val >= 0.0);
					},
					severity: 'error',
				}
			],
			showRadio: true,
		},

		//==================================================================================//
		//======================================= R2 =======================================//
		//==================================================================================//
		{
			id: 'r2',
			name: 'Resistor 2 (bottom resistor)',
			symbol: '$R2$',
			dispVal: '',
			units: [
				{ label: 'm‎Ω', eq: 1e-3 },
				{ label: '‎Ω', eq: 1 },
				{ label: 'k‎Ω', eq: 1e3 },
				{ label: 'M‎Ω', eq: 1e6 },
			],
			selUnitValue: 'k‎Ω',	
			direction: 'input',
			outputFn: function(vars) {		
				return ((getVal(vars, 'r1')*getVal(vars, 'vOut'))/(getVal(vars, 'vIn') - getVal(vars, 'vOut')));						
			},
			validators: [
				{
					msg: 'Resistance can\'t be negative!',
					fn: (val) => {
						return (val >= 0.0);
					},
					severity: 'error',
				}
			],
			showRadio: true,
		},
		
		//==================================================================================//
		//====================================== Vout ======================================//
		//==================================================================================//
		{
			id: 'vOut',
			name: 'Output Voltage',
			symbol: '$V_{out}$',
			dispVal: '',
			units: [
				{ label: 'mV', eq: 1e-3 },
				{ label: 'V', eq: 1 },
			],
			selUnitValue: 'V',		
			direction: 'output',
			outputFn: function(vars) {		
				return ((getVal(vars, 'vIn')*getVal(vars, 'r2'))/(getVal(vars, 'r1') + getVal(vars, 'r2')));					
			},
			validators: [
				{
					msg: 'The output voltage must be less than the input voltage if positive (output must be greater than input if negative), and of the same sign.',
					fn: (val, vars) => {						
						var vIn = getVal(vars, 'vIn');
						if(vIn < 0) {
							// vIn negative, so vOut needs to be greater (closer to 0).
							return val > vIn;
						} else {
							// vIn > 0 (i.e positive, standard case)
							return val < vIn;
						}						
					},
					severity: 'error',
				}
			],
			showRadio: true,
		},

	],
}

