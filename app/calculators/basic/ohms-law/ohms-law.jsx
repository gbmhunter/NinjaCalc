//!
//! @file               ohms-law.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2016-01-04
//! @brief              Contains the Ohm's Law calculator data for the NinjaCalc app.
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
import * as customCalcActions from '../../../actions/custom-calc-actions.js';

//! @todo Remove
import { Input, Tooltip, OverlayTrigger, Popover, Tabs, Tab } from 'react-bootstrap';
var Latex = require('react-latex');


var CalcInput = React.createClass({

	mixins: [PureRenderMixin],

	render: function() {

		console.log('CalcInput.render() called. this.props = ');
		console.log(this.props);

		var placeholder;
		if(!this.props.disabled) {
			placeholder = 'Enter value';
		} else {
			placeholder = '';
		}

		return (
			<OverlayTrigger placement="right" overlay={<Tooltip>{this.props.overlay}</Tooltip>}>
				<Input
			        type="text"
			        value={this.props.value}
			        disabled={this.props.disabled}
			        placeholder={placeholder}
			        hasFeedback
			        bsStyle={this.props.bsStyle}
			        ref="input"
			        groupClassName="group-class"
			        labelClassName="label-class"
			        onChange={this.props.onChange} />
			</OverlayTrigger>
    	);
	},

});

//! @brief			A basic number-based calculator variable, which is displayed as a row in a table.
//! @details		This needs is be passed a calcVar and dispatch prop.
//! @note           "Dumb" object.
var NumberRow = React.createClass({

	mixins: [PureRenderMixin],

    // Prop checks
    // Note this doesn't work, because the props are inserted dynamically, and these
    // checks happen before the componentWillMNount function is called!
    //propTypes: {
    //    calcInstance: React.PropTypes.number.isRequired,
    //    dispatch: React.PropTypes.func.isRequired,
    //},

	componentWillMount: function() {
		console.log('NumberRow.componentWillMount() called.');

        if(typeof(this.props.calcInstance) === 'undefined') {
            throw "calcInstance prop was not provided to NumberRow element.";
        }

        if(typeof(this.props.calcVar) === 'undefined') {
            throw "calcVar prop was not provided to NumberRow element.";
        }

		// A new number row has been added!
		// We need to register this calculator variable with the main redux state machine
		this.props.dispatch(customCalcActions.addCalcVar(this.props.calcInstance, this.props.calcVar));

	},

	onValueChange: function(event) {
		console.log('onValueChange() called with event = ');
		console.log(event);

		// Let's call a thunk to set the variable value inside redux state
		this.props.dispatch(calcActions.setVarVal(this.props.calcInstance, this.props.calcVar.id, event.target.value));
	},


	render: function() {

		console.log('NumberRow.render() called with this.props =');
		console.log(this.props)

		var isInputDisabled;
		if(this.props.calcVar.direction == 'input') {
			isInputDisabled = false;
		} else {
			// direction must == 'output'
			isInputDisabled = true;
		}

		// Build up the required classes for styling
		var bsStyle = '';
		// worstValidationResult should either be 'ok', 'warning' or 'error'
		bsStyle += this.props.calcVar.worstValidationResult;

		return <tr>
			<td>{this.props.calcVar.name}</td>
			<td><Latex>{this.props.calcVar.symbol}</Latex></td>
			<td>
				<CalcInput
					value={this.props.calcVar.dispVal}
					overlay={this.props.calcVar.tooltipText}
					disabled={isInputDisabled}
					bsStyle={bsStyle}
					onChange={this.onValueChange} />

			</td>
		</tr>;
	},

});

//! @details    This needs to be passed a calcInstance prop.
var CustomCalcTable = React.createClass({

	mixins: [PureRenderMixin],

    // Prop checks
    propTypes: {
        calcInstance: React.PropTypes.number.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    },

	componentWillMount: function() {
		console.log('CustomCalcTable.componentWillMount() called.');

		// We need to create a new "open" calculator to the redux state machine
		customCalcActions.openCalc();
	},


	render: function() {

		console.log('CustomCalcTable.render() called. this.props = ');
		console.log(this.props);
		//console.log('and this.props.data.toJS() = ');
		//console.log(this.props.data.toJS());
		//console.log('CalcTableRow = ');
		//console.log(CalcTableRow);

		// Following code generates all the children, while inserting the calcInstance and dispatch
        // as a prop to each automatically
		var self = this;
		var childrenWithProps = React.Children.map(this.props.children, function(child) {
            return React.cloneElement(
                child,
                {
                    calcInstance: self.props.calcInstance,
                    dispatch: self.props.dispatch,
                });
        });

		return (
			<div>
				<table>
					<tbody>
						{/* This generates the rows of the table which contain the calculator variables */}
						{childrenWithProps}
					</tbody>
				</table>
			</div>
		);
	},

});

export var data = {

	id: 'ohmsLaw',
	name: 'Ohm\'s Law',
	description: 'The hammer in any electrical engineers toolbox. Calculate voltage, resistance and current using Ohm\'s law.',
	categoryPath: [ 'Electronics', 'Basic' ],
	tags: 'ohm, law, resistance, voltage, current',
	imageSrc: __dirname + '/icon.png',


	// This is the React view for this calculator
	// This gets passed the following props:
	// 'key': Unique ID for this particular calculator instance.
	// 'data': The calculator data associated with the instance (immutableObject)
	// 'dispatch': Function to dispatch actions with.
	view: React.createClass({

		mixins: [PureRenderMixin],

		componentDidMount: function() {
			console.log('OhmsLaw.componentDidMount() called.');
		},


		render: function() {
			console.log('OhmsLaw.render() called. this.props = ');
			console.log(this.props);
			console.log('and this.props.data.toJS() =');
			console.log(this.props.data.toJS());
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


                    {/* calcInstance gets passed to all children of CustomCalcTable automatically */}
					<CustomCalcTable calcInstance={this.props.data.get('calcInstance')} dispatch={this.props.dispatch}>

						{/*==================================================================================//
						//================================== VOLTAGE (input/output) =========================//
						//==================================================================================*/}
						<NumberRow calcVar={{
							id: 'voltage',
							name: 'Voltage',
							symbol: '$V$',
							dispVal: '',
							sf: 3,
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
						}}/>

						{/*==================================================================================//
						//================================== CURRENT (input/output) =========================//
						//==================================================================================*/}
						<NumberRow calcVar={{
							id: 'current',
							name: 'Current',
							symbol: '$I$',
							dispVal: '',
							sf: 3,
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
						}}/>

						{/*==================================================================================//
						//================================ RESISTANCE (input/output) ========================//
						//==================================================================================*/}
						<NumberRow calcVar={{
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
						}}/>

					</CustomCalcTable>


				</div>
	    	);
		},

	}),

}
