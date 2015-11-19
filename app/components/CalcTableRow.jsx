//!
//! @file               CalcTableRow.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-17
//! @last-modified      2015-11-19
//! @brief              Contains the CalcTableRow for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

// npm modules
import React from 'react';
import { Input, Tooltip, OverlayTrigger, Popover, Tabs, Tab } from 'react-bootstrap';

// User modules

var CalcInput = React.createClass({

	mixins: [PureRenderMixin],

	render: function() {

		//console.log('CalcInput.render() called. this.props = ');
		//console.log(this.props);

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

var CalcUnits = React.createClass({

	mixins: [PureRenderMixin],

	render: function() {

		//console.log('this.props = ');
		//console.log(this.props);

		return (			
			<Select
					name="form-field-name"
					value={this.props.value}
					options={this.props.options}
					onChange={this.props.onChange}
					clearValueText=""	
					clearable={false}			
					multi={false}
					searchable={false}	
					placeholder="Select"
				/>
		);
	},

});

//! @brief    A single row in the calculator table.
// Have had serious issues with using the "class" ES6 syntax!!!
// e.g. "this" no longer exists as I know it!
export var CalcTableRow = React.createClass({

	mixins: [PureRenderMixin],

	onValueChange: function(event) {
		console.log('onValueChange() called with event = ');
		console.log(event);

		// Let's call a thunk to set the variable value inside redux state
		this.props.dispatch(calcActions.setVarVal(this.props.calcId, this.props.varData.get('id'), event.target.value));
	},

	onCalcWhatChange: function(event) {
		console.log('CalcRow.onCalcWhatChange() called.');
		console.log('this =');
		console.log(this);
		//this.props.onCalcWhatChange(event, this.props.name);

		this.props.dispatch(calcActions.setOutputVar(this.props.calcId, this.props.varData.get('id')));
	},

	onUnitsChange: function(event) {
		console.log('onUnitsChange() called with event =');
		console.log(event);

		this.props.dispatch(calcActions.setVarUnits(this.props.calcId, this.props.varData.get('id'), event));
	},

	//! @brief		This is called by render() to render the radio button column.
	//! @returns	A table data element containing the radio button if the calculator requires them, otherwise returns null.
	renderRadioButton: function() {		
		if(this.props.varData.get('showRadio')) {
			return <td><input type="radio" checked={this.props.varData.get('direction') == 'output'} onChange={this.onCalcWhatChange} /></td>
		} else {
			// If the calculator doesn't want radio buttons, we don't want to show anything at all, not even an empty column!
			return null;
		}
	},

	render: function() {
		//console.log('CalcRow.render() called, with this.props.varData =');
		//console.log(this.props.varData);

		var isInputDisabled;
		if(this.props.varData.get('direction') == 'input') {
			isInputDisabled = false;
		} else {
			// direction must == 'output'
			isInputDisabled = true;
		}

		// Build up the required classes for styling
		var bsStyle = '';
		// worstValidationResult should either be 'ok', 'warning' or 'error'
		bsStyle += this.props.varData.get('worstValidationResult');


		// Work out if radio button is needed
		

		return (
			<tr>
				<td>{this.props.varData.get('name')}</td>
				<td><Latex>{this.props.varData.get('symbol')}</Latex></td>
				{/* Now display the dispVal for each calculator variable */}
				<td>
					<CalcInput
						value={this.props.varData.get('dispVal')}
						overlay={this.props.varData.get('tooltipText')}
						disabled={isInputDisabled}
						bsStyle={bsStyle}
						onChange={this.onValueChange} />
					
				</td>
				<td className="unitsCol">
					
					<CalcUnits
						name="form-field-name"
						value={this.props.varData.get('selUnitValue')}
						options={this.props.varData.get('units').toJS()}
						onChange={this.onUnitsChange}
					/>
				</td>
				{this.renderRadioButton()}
				<td><Latex>{this.props.varData.get('comments')}</Latex></td>			
			</tr>
		);
	}
});

