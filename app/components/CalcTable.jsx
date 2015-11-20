//!
//! @file               CalcTable.js
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-17
//! @last-modified      2015-11-19
//! @brief              Contains the CalcTable for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

// npm modules
import React from 'react';
var PureRenderMixin = require('react-addons-pure-render-mixin');
import { Table } from 'react-bootstrap';

// User modules
import { CalcTableRow } from './CalcTableRow.js';

//! @brief		The important piece of each calculator which allows the user to enter in values for inputs and see the results of outputs.
//! @details	This is used by each calculator and included within it's view variable.
export var CalcTable = React.createClass({

	mixins: [PureRenderMixin],


	render: function() {

		console.log('CalcTable.render() called. this.props = ');
		console.log(this.props);
		console.log('and this.props.data.toJS() = ');
		console.log(this.props.data.toJS());
		//console.log('CalcTableRow = ');
		//console.log(CalcTableRow);

		var className = "calculatorTable " + this.props.size;

		return (
			<div className={className}>				
				<table>
					<tbody>
						{/* This generates the rows of the table which contain the calculator variables */							
							this.props.data.get('vars').map((el) => {
								//console.log('el.id = ' + el.get('id'));
								return <CalcTableRow key={el.get('id')} calcInstance={this.props.data.get('calcInstance')} varData={el} dispatch={this.props.dispatch} />
							})
						}
					</tbody>
				</table>			
			</div>
		);
	},

});

