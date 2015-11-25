//!
//! @file               app.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-20
//! @brief              Contains the "redux" actions for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

//import React, { Component } from 'react';

//============================ npm MODULES =============================//
import React from 'react';
import ReactDOM from 'react-dom';
// Redux utility functions
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
var Select = require('react-select');
import Dropdown from 'react-dropdown';
import { Input, Tooltip, OverlayTrigger, Popover, Tabs, Tab, Panel } from 'react-bootstrap';
var PureRenderMixin = require('react-addons-pure-render-mixin');
var _ = require('lodash');
var Latex = require('react-latex');
var ReactRadioGroup = require('react-radio-group');
//import TreeView from 'react-treeview';
import { TreeView } from './utility/react-bootstrap-treeview/react-bootstrap-treeview.js';


// This next one is required for Material UI click events to work properly,
// until React v1.0 is released.
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

// Material UI modules
const MenuItem = require('material-ui/lib/menu/menu-item'); 
const LeftNav = require('material-ui/lib/left-nav');
const List = require('material-ui/lib/lists/list');
const ListDivider = require('material-ui/lib/lists/list-divider');
const ListItem = require('material-ui/lib/lists/list-item');

//=========================== USER MODULES =========================//
import AbsoluteGrid from './utility/react-absolute-grid/AbsoluteGrid.js';
import {CategoryTree} from './components/CategoryTree.js';


const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk) // any Redux middleware, e.g. redux-thunk
  
  // Provides support for DevTools:
  //! @warning  This will cause the entire state/action history to be re-run everytime a
  //!     new action is dispatched, which could cause performance issues!
  //devTools()
)(createStore);

//=========== REDUCER ===========//
import defaultReducer from './reducers/calc-reducer.js';
import * as calcActions from './actions/calc-actions.js';
//console.log(defaultReducer);

// Create store. Note that there is only one of these for the entire app.
const store = finalCreateStore(defaultReducer);


//============== LOAD CALCULATORS ============//

import * as lt3745Calc from './calculators/chip-specific/lt3745/lt3745.js';
import ohmsLawCalc from './calculators/basic/ohms-law/ohms-law.js';
import * as resistorDividerCalc from './calculators/basic/resistor-divider/resistor-divider.js';




// Calculators are loaded into Redux state in the onMount function of the react App


//class App extends React.Component {

	/*var data = [
		{
		text: "Electronics",
		nodes: [
		  {
		    text: "PCB Design",
		    nodes: [
		      {
		        text: "Grandchild 1"
		      },
		      {
		        text: "Grandchild 2"
		      }
		    ]
		  },
		  {
		    text: "Basic"
		  }
		]
		},
		{
		text: "Mechanical"
		},
		{
		text: "Software"
		},
		];*/





var App = React.createClass({

	//mixins: [PureRenderMixin],

	componentDidMount: function() {

		// Load in the calculators so the app knows about them
		this.props.dispatch(calcActions.addCalc(ohmsLawCalc));
		this.props.dispatch(calcActions.addCalc(lt3745Calc.data));		
		//this.props.dispatch(calcActions.addCalc(resistorDividerCalc.data));
	},

	handleSelect(key) {
		//alert('selected ' + key);
		this.props.dispatch(calcActions.setActiveTab(key));		
	},

	//! @brief		Called when the text within the "search" input changes.
	//! @details	Dispatches a setSearchTerm event, which then updates the input and filters the calculator grid results.
	onSearchInputChange(event) {
	    console.log('onSearchInputChange() called with event.target.value = ');
	    console.log(event.target.value);

	    this.props.dispatch(calcActions.setSearchTerm(event.target.value));
 	},

 	//! @brief		This function determines what calculator element to render inside the tab.
 	//! @details	We need this because the UI structure of each calculator may be different.
 	renderCalc: function(calculator, key) {

		// Create the view for the specific calculator.
		// Note that since this isn't created in JSX (i.e. <CalcView>...</CalcView>),
		// we have to use React.createFactory
		return React.createElement(calculator.get('view'), { key: key, data: calculator, dispatch: this.props.dispatch });
 	},

 	listItemClicked: function(event) {
 		console.log('listItemClicked() called with event.target.textContent = ');
 		console.log(event.target.textContent);
 	},

	render: function() {

		var that = this;

		// We have to inject the dispatch function as a prop to all of the grid elements so we
		// can do something when the 'Load' button is clicked. The function pointer can't be added
		// in the reducer because the reducer has no knowledge of it.
		var items = this.props.state.get('gridElements').toJS().map((gridElement) => {
			gridElement.dispatch = this.props.dispatch;
			return gridElement;
		});

		var menuItems = [
		  { route: 'get-started', text: 'Get Started' },
		  { route: 'customization', text: 'Customization' },
		  { route: 'components', text: 'Components' },
		  { type: MenuItem.Types.SUBHEADER, text: 'Resources' },
		  {
		     type: MenuItem.Types.LINK,
		     payload: 'https://github.com/callemall/material-ui',
		     text: 'GitHub'
		  },
		  {
		     text: 'Disabled',
		     disabled: true
		  },
		  {
		     type: MenuItem.Types.LINK,
		     payload: 'https://www.google.com',
		     text: 'Disabled Link',
		     disabled: true
		  },
		];

		
		//data = this.props.state.get('textNodesCategoryTree').toJS();

		//console.log('Comparison of data =');
		//console.log(data);
		//console.log('and this.props.state.get(\'nameChildrenCategoryTree\').toJS() =');
		//console.log(this.props.state.get('nameChildrenCategoryTree').toJS());

		return (
			<div className="app">	
				{/* Docked Left Nav */}
				<LeftNav ref="leftNav" menuItems={menuItems} docked={false} />

				{/* Tabs are the main view element on the UI */}
				<Tabs activeKey={this.props.state.get('activeTabKey')} onSelect={this.handleSelect}>
					{/* First tab is static and non-removable */}
					<Tab eventKey={0} title="Calculators">
						<div id='calculatorSelectionTab' >
							<div className="calcCategories" >
								{/*<TreeView data={data} />*/}
								<CategoryTree data={this.props.state.get('nameChildrenCategoryTree')}/>
								{/*
								<List subheader="Category">
									<ListItem 
										primaryText="Electronics" />
									<ListItem primaryText="Mechanical" />
									<ListItem
										primaryText="Software"								
										initiallyOpen={false}
										nestedItems={[
											<ListItem primaryText="Test1" />,
											<ListItem
											primaryText="Test2"								
											nestedItems={[
												<ListItem primaryText="Test3" />,
											]}
											/>,
										]}
									/>
								</List>
								*/}
							</div>

							<div className='rightCol'>
								{/* This is used to narrow down on the desired calculator */}
								<Input
							        type="text"
							        value={this.props.state.get('searchTerm')}
							        placeholder="Enter text"
							        label="Search for calculator"
							        hasFeedback
							        ref="input"
							        groupClassName="group-class"
							        labelClassName="label-class"
							        onChange={this.onSearchInputChange} />					        
								<br />
								<div>
									{/* Item width and height determine the size of the card. Note that if the card is too big it can make the
									height larger, but not the width */}
									<AbsoluteGrid
										items={items}
										itemWidth={240}
										itemHeight={360}
										responsive={true}
										zoom={1}
										animation="transform 300ms ease"/>							
								</div>
							</div>
						</div>{/* id='calculatorSelectionTab' */}
					</Tab>
					{
						/* Let's create a visual tab for every calculator in the openCalculators array */
						this.props.state.get('openCalculators').map(function(calculator, index) {
							return (
								<Tab key={index+1} eventKey={index+1} title={calculator.get('name')}>
									{
										/* This next line of code inserts the entire calculator into the tab element.
										We also need to pass in a key to prevent it from getting re-rendered when it doesn't have to */
										that.renderCalc(calculator, index)
									}										
								</Tab>
							);
						})
					}
				</Tabs>											
			</div>
		);
	}
});



//! @brief    Selects what props to inject into app.
//! @details  Currently injecting everything.
function mapStateToProps(state) {
  return {
    /*serialPort: state.serialPort,
    loggingState: state.logging,
    stats: state.stats,
    util: state.util,*/
    // Map everything at the moment, might change in future
    state: state,    
  };
}


// Inject dispatch and state into app
App = connect(mapStateToProps)(App);

// Wrapping the app in Provider allows us to use Redux
console.log(document);
//console.log('document.getElementById(\'content\') = ');
console.log(document.getElementById('content'));

var appRender = ReactDOM.render(
  <div id='redux-wrapper-div' style={{height: '100%'}}>
    <Provider store={store}>
        <App />
    </Provider>
  </div>,
  document.getElementById('content')
);




