//!
//! @file               CalcTableRow.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-17
//! @last-modified      2015-11-17
//! @brief              Contains the CalcTableRow for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

// npm modules
import React from 'react';

// User modules

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
		var radioButton;
		if(this.props.varData.get('showRadio')) {
			radioButton = <input type="radio" checked={this.props.varData.get('direction') == 'output'} onChange={this.onCalcWhatChange} />
		}

		return (
			<tr>
				<td>{this.props.varData.get('name')}</td>
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
				<td>{radioButton}</td>				
			</tr>
		);
	}
});

