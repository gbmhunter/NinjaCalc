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

// User modules
import { CalcTableRow } from './CalcTableRow.js';


export var CalcTable = React.createClass({

	mixins: [PureRenderMixin],


	render: function() {

		console.log('CalcTable.render() called. this.props = ');
		console.log(this.props);
		//console.log('CalcTableRow = ');
		//console.log(CalcTableRow);

		return (
			<div className="calculatorTable">				
				<table>
					<tbody>
						{/* This generates the rows of the table which contain the calculator variables */							
							this.props.data.get('vars').map((el) => {
								//console.log('el.id = ' + el.get('id'));
								return <CalcTableRow key={el.get('id')} calcId={this.props.data.get('id')} varData={el} dispatch={this.props.dispatch} />
							})
						}
					</tbody>
				</table>			
			</div>
		);
	},

});

