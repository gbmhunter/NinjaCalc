//!
//! @file               lt3745.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-03
//! @last-modified      2015-11-17
//! @brief              Contains the data for the LT3745 calculator.
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

	id: 'lt3745',
	name: 'LT3745',
	description: 'Calculate the values of the surrounding passive components required to operate the LT3745 IC.',
	tags: 'ic, linear tech, led',
	imageSrc: './calculators/chip-specific/lt3745/icon.png',

	// This is the React view for this calculator
	view: React.createClass({

		mixins: [PureRenderMixin],

		render: function() {
			return (
				<div>
					<div className="intro">
						<img src={ __dirname + '/lt3745-typical-application.png'} style={{float: 'right', height:200}} />
						<p>A calculator to help you choose the values of the supporting passive components for the Linear Technology LT3745 16-channel LED driver.</p>
						<p>The datasheet can be found <a href="http://cds.linear.com/docs/en/datasheet/3745f.pdf">here</a>.</p>
						<p>For more information you can check out the Linear Technology Demonstration Circuit 1608A.</p>
					</div>
					<br />			
					<CalcTable data={this.props.data} dispatch={this.props.dispatch} />
				</div>
	    	);
		},

	}),

	vars: [

		//==============================================================================//
		//================================== vSupp =====================================//
		//==============================================================================//
		{
			id: 'vSupp',
			name: 'Supply Voltage',
			symbol: '$V_{CC}$',
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
			comments: 'The supply voltage for the logic. Must be between 3.0 and 5.5V.',
		},

		//==============================================================================//
		//================================ Vload (input) ===============================//
		//==============================================================================//
		{
			id: 'vLoad',
			name: 'Load Voltage',
			symbol: '$V_{load}$',
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
			comments: 'This is the maximum voltage that the load will ever see. If driving LEDs, this is equal to the forward voltage of the LED at the maximum current to plan to drive them at. If driving multiple LEDs series, sum the forward voltages. If driving different colours, this is equal to the LED with the highest forward voltage.',
		},

		//==============================================================================//
		//================================= vOutMax (input) ============================//
		//==============================================================================//
		{
			id: 'vOutMax',
			name: 'Maximum Output Voltage',
			symbol: '$V_{out(max)}$',
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
			comments: 'This must be equal or higher than $V_{load}$. It is recommended to be set between 0.8V and 3.0V above $V_{load}$ for the best current regulation.',
		},

		//==============================================================================//
		//============================ Vin(min) (output) ===============================//
		//==============================================================================//
		{
			id: 'vInMin',
			name: 'Minimum Input Voltage',
			symbol: '$V_{in(min)}$',
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
			comments: 'The is a minimum input voltage allowed to sustain current regulation. It cannot be less than 6V. The $2.1V$ is the minimum dropout voltage between the $V_{in}$ and ISN pins. $V_{in(min)} = V_{out(max)} + 2.1V$',
		},

		//==============================================================================//
		//============================ Vin(max) (input) ================================//
		//==============================================================================//
		{
			id: 'vInMax',
			name: 'Maximum Input Voltage',
			symbol: '$V_{in(max)}$',
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
			comments: 'This is the maximum input voltage that will ever be provided to the LT3745. Must be greater or equal to $V_{in(min)}$, and less or equal to 55V.',
		},

		//==============================================================================//
		//================================ Rfb1 (input) ================================//
		//==============================================================================//
		{
			id: 'rfb1',
			name: 'Feedback Resistor 1',
			symbol: '$R_{fb1}$',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },
			],
			selUnitValue: 'kΩ',	
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
			comments: 'This resistor along with $R_{fb2}$ determines the output voltage of the buck converter. This is recommended to be $10k\\Omega$.',
		},

		//==============================================================================//
		//============================== Rfb2 (output) =================================//
		//==============================================================================//
		{
			id: 'rfb2',
			name: 'Feedback Resistor 2',
			symbol: '$R_{fb2}$',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },
			],
			selUnitValue: 'kΩ',	
			direction: 'output',
			outputFn: (vars) => {
				return (getVal(vars, 'rfb1')*(getVal(vars, 'vOutMax')/1.205 - 1));	
			},
			comments: 'This resistor along with $R_{fb1}$ determines the output voltage of the buck converter. $R_{fb2} = R_{fb1}*\\left(\\dfrac{V_{out(max)}}{1.205V} - 1\\right)$.',
		},

		//==============================================================================//	
		//============================= Iout(max) (input) ==============================//
		//==============================================================================//
		{
			id: 'iOutMax',
			name: 'Maximum Output Current',
			symbol: '$I_{out(max)}$',
			units: [
				{ label: 'mA', eq: 1e-3 },
				{ label: 'A', eq: 1 },
			],
			selUnitValue: 'A',	
			direction: 'input',
			comments: 'This is the maximum output current for all channels, i.e. maximum current going through MOSFET and current sense resistor.',
		},

		//==============================================================================//
		//============================ Rsense (output) =================================//
		//==============================================================================//
		{
			id: 'rSense',
			name: 'Sense Resistance',
			symbol: '$R_{sense}$',
			units: [
				{ label: 'mΩ', eq: 1e-3 },
				{ label: 'Ω', eq: 1 },
			],
			selUnitValue: 'mΩ',	
			direction: 'output',
			outputFn: (vars) => {
				return 0.035/getVal(vars, 'iOutMax');	
			},
			comments: 'The value for the current-sense resistor which will give you the $I_{out(max)}$ you want. $R_{sense} = \\dfrac{35mV}{I_{out(max)}}$.',
		},

		//==============================================================================//
		//============================== Prsense (output) ==============================//
		//==============================================================================//
		{
			id: 'Sense Resistance Power Dissipation',
			name: 'Prsense',
			symbol: '$P_{Rsense}$',
			units: [
				{ label: 'mW', eq: 1e-3 },
				{ label: 'W', eq: 1 },
			],
			selUnitValue: 'mW',	
			direction: 'output',
			outputFn: (vars) => {
				return Math.pow(getVal(vars, 'iOutMax'), 2)*getVal(vars, 'rSense');	
			},
			comments: 'This is the power that will dissipated through the current-sense resistor at maximum current output. Make sure the resistor is rated to handle this power. $P_{Rsense} = I_{out(max)}^2 * R_{sense}$.',
		},

		//==============================================================================//
		//============================== iLedPinNom (input) ============================//
		//==============================================================================//
		{
			id: 'iLedPinNom',
			name: 'Nominal Led-Pin Current',
			symbol: '$I_{led-pin(nom)}$',
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
			comments: 'This is the "nominal" current each LED will see. It has to be between 10-50mA. Note that the current for each channel can be individually controlled down to 50% and up to 150% of this nominal current, and then further modulated with PWM from 0 to 100%.',
		},

		//==============================================================================//
		//================================ Riset (output) ==============================//
		//==============================================================================//
		{
			id: 'riSet',
			name: 'Current Set Resistance',
			symbol: '$R_{iset}$',
			units: [
				{ label: 'Ω', eq: 1 },
				{ label: 'kΩ', eq: 1e3 },
			],
			selUnitValue: 'kΩ',	
			direction: 'output',
			outputFn: (vars) => {
				return 2500*(1.205/getVal(vars, 'iLedPinNom'));	
			},
			comments: 'The resistor sets the nominal LED current chosen above. $R_{iset} = 2500*(\\dfrac{1.205}{I_{led-pin(nom)}})$.',
		},

		//==============================================================================//
		//================================== Vd,f (input) ==============================//
		//==============================================================================//
		{
			id: 'vdf',
			name: 'Voltage Drop Across Buck Diode',
			symbol: '$V_{d,f}$',
			units: [
				{ label: 'V', eq: 1 },				
			],
			selUnitValue: 'V',	
			direction: 'input',		
			comments: 'This is the forward voltage drop across the buck diode at the operating current. This value can be found in the diodes datasheet. Should be around 0.5V.',
		},

		//==============================================================================//
		//================================= Dmin (output) ==============================//
		//==============================================================================//
		{
			id: 'dMin',
			name: 'Minimum Duty Cycle',
			symbol: '$D_{min}$',
			units: [
				{ label: '%', eq: 1e-2 },				
			],
			selUnitValue: '%',	
			direction: 'output',
			outputFn: (vars) => {
				return (getVal(vars, 'vOutMax') + getVal(vars, 'vdf'))/(getVal(vars, 'vInMax') + getVal(vars, 'vdf'));	
			},
			comments: 'The minimum duty cycle of the buck converter. This limits the maximum switching frequency. $D_{min} = \\dfrac{V_{out(max)} + V_{d,f}}{V_{in(max)} + V_{d,f}}$.',
		},

		//==============================================================================//
		//================================= Dmax (output) ==============================//
		//==============================================================================//
		{
			id: 'dMax',
			name: 'Maximum Duty Cycle',
			symbol: '$D_{max}$',
			units: [
				{ label: '%', eq: 1e-2 },				
			],
			selUnitValue: '%',	
			direction: 'output',
			outputFn: (vars) => {
				return (getVal(vars, 'vOutMax') + getVal(vars, 'vdf'))/(getVal(vars, 'vInMin') + getVal(vars, 'vdf'));	
			},
			comments: 'The maximum duty cycle of the buck converter. This limits the maximum switching frequency. $D_{max} = \\dfrac{V_{out(max)} + V_{d,f}}{V_{in(min)} + V_{d,f}}$.',
		},

		//==============================================================================//
		//================================ ton(min) (input) ============================//
		//==============================================================================//
		{
			id: 'tOnMin',
			name: 'Minimum Switch-On Time',
			symbol: '$t_{on(min)}$',
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
			comments: 'This is the minimum switch-on time of the MOSFET. Sometimes called the turn-on delay time ($t_{d(on)}$). Check the MOSFET\'s datasheet for this value. Should be greater than 1ns and less than 500ns.',
		},

		//==============================================================================//
		//================================ ton(min) (input) ============================//
		//==============================================================================//
		{
			id: 'tOffMin',
			name: 'Minimum Switch-Off Time',
			symbol: '$t_{off(min)}$',
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
			comments: 'This is the minimum switch-off time of the MOSFET. Sometimes called the turn-off delay time ($t_{d(off)}$). Check the MOSFET\'s datasheet for this value. Should be greater than 1ns and less than 500ns.',
		},

		//==============================================================================//
		//=============================== fsw(max) (output) ============================//
		//==============================================================================//
		{
			id: 'fSwMax',
			name: 'Maximum Switching Frequency',
			symbol: '$f_{sw(max)}$',
			units: [
				{ label: 'kHz', eq: 1e3 },				
			],
			selUnitValue: 'kHz',	
			direction: 'output',
			outputFn: (vars) => {
				// fsw(max) = min( Dmin/ton(min) , (1 - Dmax)/toff(min) )
				return Math.min(getVal(vars, 'dMin')/getVal(vars, 'tOnMin'), (1.0 - getVal(vars, 'dMax'))/getVal(vars, 'tOffMin'));	
			},
			comments: 'This is the maximum switching frequency you could use. $f_{sw(max)} = min( \\dfrac{D_{min}}{t_{on,min}}, \\dfrac{1 - D_{max}}{t_{off(min)}})$.',
		},

		//==============================================================================//
		//================================ fsw(act) (input) ============================//
		//==============================================================================//
		{
			id: 'fSwAct',
			name: 'Actual Switching Frequency',
			symbol: '$f_{sw(act)}$',
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
			comments: 'This is the switching frequency you want to use, set by the resistor $R_T$. It has to be between 100kHz and 1MHz, and also less than $f_{sw(max)}$.',
		},

		//==============================================================================//
		//================================= fugf (output) ==============================//
		//==============================================================================//
		{
			id: 'fugf',
			name: 'Unity-gain Frequency',
			symbol: '$f_{ugf}$',
			units: [
				{ label: 'kHz', eq: 1e3 },				
			],
			selUnitValue: 'kHz',	
			direction: 'output',
			outputFn: (vars) => {
				// fugf = fsw(act)/10
				return getVal(vars, 'fSwAct')/10.0;
			},
			comments: 'This is the switching frequency which would give unity voltage gain between input and output. $f_{ugf} = \\dfrac{f_{sw(act)}}{10}$.',
		},

		//==============================================================================//
		//================================== Rt (output) ===============================//
		//==============================================================================//
		{
			id: 'rt',
			name: 'Frequency-setting Resistance',
			symbol: '$R_{T}$',
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
			comments: 'This is the resistance required to set the frequency at $f_{sw(act)}$ chosen above. Equation was worked out by fitting a power equation to the frequency-resistance values given in the datahseet. This equation fits the data well, with a regression coefficient of $r^2 = 0.9994$ within the valid range. $R_T = \\dfrac{2.25167e^{11}}{f_{sw(act)^{1.114}}}$.',
		},

		//==============================================================================//
		//================================= tj(max) (input) ============================//
		//==============================================================================//
		{
			id: 'tjMax',
			name: 'Maximum Junction Temperature',
			symbol: '$T_{J(max)}$',
			units: [
				{ label: '°C', eq: 1 },				
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
			comments: 'This is the desired maximum junction temperature of the LT3745 IC. The IC will begin to reduce $I_{led-pin(nom)}$ above this to prevent any further increase on temperature. The LT3745 also has an absolute maximum junction temperature of $165^{\\circ}C$, at which point it will switch off until it drops to $155^{\\circ}C$.',
		},

		//==============================================================================//
		//================================ Rtset (output) ==============================//
		//==============================================================================//
		{
			id: 'rtSet',
			name: 'Temperature Set Resistance',
			symbol: '$R_{TSET}$',
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
			comments: 'The resistance required to be connected between pin $T_{SET}$ and ground on the LT3745 to limit the junction temperature to $T_{J(max)}$. $R_{TSET} = \\frac{1.72mV*(T_J + 273.15)*R_{ISET}}{1.205V}$.',
		},

		//==============================================================================//
		//============================== Cout(min) (output) ============================//
		//==============================================================================//
		{
			id: 'cOutMin',
			name: 'Minimum Output Capacitance',
			symbol: '$C_{out(min)}$',
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
			comments: 'The output capacitance smooths the output voltage, and also stores energy to satisfy load transients. $C_{out(min)} = \\small \\max( \\dfrac{0.25}{R_{sense}*f_{ugf}}, \\dfrac{1.5}{V_{buck,out}*R_{sense}*f_{ugf}}) $.',
		},

		//==============================================================================//
		//================================== Il(delta) =================================//
		//==============================================================================//
		{
			id: 'iLDelta',
			name: 'Inductor Ripple Current',
			symbol: '$I_{L(delta)}$',
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
			comments: 'This is the maximum desired ripple current through the inductor. A value between 10-50% is recommended.',
		},

		//==============================================================================//
		//================================= L(min) (output) ============================//
		//==============================================================================//
		{
			id: 'lMin',
			name: 'Minimum Inductance',
			symbol: '$L_{min}$',
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
			comments: 'This is the minimum inductance required to satisfy the inductor ripple current specified above. If this inductance is too large, you could consider increasing the ripple current, or increasing the switching frequency. $L_{min} = \\small \\dfrac{V_{buck,out} + V_{d,f}}{ V_{in(max) + V_{d,f}}} * \\dfrac{ V_{in(max)} - V_{buck,out} }{ f_{sw(act)}*I_{L(delta)} } $.</span>',
		},

		//==============================================================================//
		//================================= Vin(ripple) ================================//
		//==============================================================================//
		{
			id: 'vInRipple',
			name: 'Input Voltage Ripple',
			symbol: '$V_{in,ripple}$',
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
			comments: 'The desired maximum input voltage ripple. A value around 100mV is normal.',
		},

		//==============================================================================//
		//================================ Cin(min) (output) ===========================//
		//==============================================================================//
		{
			id: 'cInMin',
			name: 'Minimum Input Capacitance',
			symbol: '$C_{in(min)}$',
			units: [
				{ label: 'uF', eq: 1e-6 },				
			],
			selUnitValue: 'uF',	
			direction: 'output',
			outputFn: (vars) => {
				// Cin(min) = (Dmax*Iout(max)) / (Vin,ripple*fsw(act))
				return ( (getVal(vars, 'dMax')*getVal(vars, 'iOutMax'))/(getVal(vars, 'vInRipple')*getVal(vars, 'fSwAct')) );
			},
			comments: 'This is the minimum input capacitance required to satisfy the desired input voltage ripple chosen above. $V_{in, ripple} = \\dfrac{D_{max}*I_{out(max)}}{V_{in,ripple}*f_{sw(act)}}$.',
		},

	]
}

