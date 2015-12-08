//!
//! @file               app.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-12-07
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
import { Input, Tooltip, OverlayTrigger, Popover, Tabs, Tab, Panel, Modal, Button, Glyphicon } from 'react-bootstrap';
var PureRenderMixin = require('react-addons-pure-render-mixin');
var _ = require('lodash');
var Latex = require('react-latex');
var ReactRadioGroup = require('react-radio-group');
//import TreeView from 'react-treeview';
import { TreeView } from './utility/react-bootstrap-treeview/react-bootstrap-treeview.js';
//import Drawer from 'react-motion-drawer';


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

// Calculators are loaded into Redux state in the onMount function of the react App
import * as lt3745Calc from './calculators/chip-specific/lt3745/lt3745.js';
import ohmsLawCalc from './calculators/basic/ohms-law/ohms-law.js';
import * as resistorDividerCalc from './calculators/basic/resistor-divider/resistor-divider.js';
import * as rcTimeConstantCalc from './calculators/basic/rc-time-constant/rc-time-constant.js';
import * as pcbTrackWidthCalc from './calculators/pcb/pcb-track-width/pcb-track-width.js';


class NoOpenCalculatorsWindow extends React.Component {
    constructor(props){
        super(props);
        //this.state = {};
        this.onOpenCalculatorClicked = this.onOpenCalculatorClicked.bind(this);
    }

    onOpenCalculatorClicked(event) {
 		console.log('onOpenCalculatorClicked() called.');
 		this.props.dispatch(calcActions.setCalcGridVisibility(true));
 	}

    render(){

        // The data variable has to be in a specific format for the tree structure to render correctly.
        // Doesn't seem like an array of siblings as the highest level object is supported
        return (
            <div id="no-open-calc-window-parent" className="full-width full-height">
            	<div id="text-and-button">
					No calculators are open yet. Want to create a new one?

					<br />
					<br />

					<Button 
						onClick={this.onOpenCalculatorClicked}
						bsSize="large"
						bsStyle="primary">
							New Calculator
					</Button>	
				</div>
            </div>
        );
    }

}

var App = React.createClass({

	//mixins: [PureRenderMixin],

	componentDidMount: function() {

		// Load in the calculators so the app knows about them
		this.props.dispatch(calcActions.addCalc(ohmsLawCalc));
		this.props.dispatch(calcActions.addCalc(lt3745Calc.data));		
		this.props.dispatch(calcActions.addCalc(resistorDividerCalc.data));
		this.props.dispatch(calcActions.addCalc(rcTimeConstantCalc.data));
		//this.props.dispatch(calcActions.addCalc(pcbTrackWidthCalc.data));
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

 	hideCalcGrid: function(event) {
 		this.props.dispatch(calcActions.setCalcGridVisibility(false));
 	},

 	onDrawerChange: function(event) {
 		console.log('onDrawerChange() called.');
 	},

 	openMenu: function(event) {
 		this.refs.leftNav.toggle();
 	},

 	//! @brief		Event handler for when a different menu item is clicked in the left drawer menu.
 	drawerMenuItemChanged: function(event) {
 		console.log('drawerMenuItemChanged() called with event =');
 		console.log(event);

 		if(event.target.textContent == 'New Calculator') {
 			this.props.dispatch(calcActions.setCalcGridVisibility(true));
 		}
 	},

 	//! @brief		Event handler for when someone clicks on the left navigation drawer teaser
 	//!				(the little visible bar on the left-hand side of the app).
 	onLeftNavDrawerTeaserClick: function(event) {
 		// Let's display the left nav drawer.
 		// Since it should be always hidden when this event is fired, this toggle() command
 		// should always make it visible
 		this.refs.leftNav.toggle();
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

		var noCalcsOpenWindow;
		if(this.props.state.get('openCalculators').size == 0) {
			noCalcsOpenWindow = <NoOpenCalculatorsWindow dispatch={this.props.dispatch}/>;
		} else {
			// Do nothing
		}

		var openCalculatorTabs;
		if(this.props.state.get('openCalculators').size != 0) {
			openCalculatorTabs = 
				<div id="calc-tab-container">
					<Tabs activeKey={this.props.state.get('activeTabKey')} onSelect={this.handleSelect}>
						{/* First tab is static and non-removable */}
						{/*<Tab eventKey={0} title="Calculators">
																								
						</Tab>*/}
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
		}

		return (
			<div className="app full-height">	

				{/* ================================================================================================ */}
				{/* ==================================== NON-FLOW DOM ELEMENTS ===================================== */}
				{/* ================================================================================================ */}

				{/* LEFT DRAWER NAV */}
				<LeftNav ref="leftNav" menuItems={this.props.state.get('leftNavMenuItems').toJS()} docked={false} onChange={this.drawerMenuItemChanged} />

				{/* CALC GRID MODAL VIEW */}
				<Modal
					show={this.props.state.get('calcGridVisibility')}
					onHide={this.hideCalcGrid}
					dialogClassName="calcGridModal">
		          	<Modal.Header closeButton>
		            	<Modal.Title>Open Calculator</Modal.Title>
		          	</Modal.Header>
        			<Modal.Body>
	        			<div id='calculatorSelectionTab' >
							<div className="calcCategories" >
								{/*<TreeView data={data} />*/}
								<CategoryTree
									data={this.props.state.get('categoryTree')}
									dispatch={this.props.dispatch}/>								
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
					            <div id="calcGridContainer">
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
							</div> {/*<div className='rightCol'>*/}
						</div> {/*<div id='calculatorSelectionTab' >*/}
		        	</Modal.Body>
		          <Modal.Footer>
		            <Button onClick={this.close}>Close</Button>
		          </Modal.Footer>
		        </Modal>

		        {/* ================================================================================================ */}
				{/* ======================================== FLOW DOM ELEMENTS ===================================== */}
				{/* ================================================================================================ */}
		        <div id="flowElements" className="full-height">

		        	<div 
		        		id="leftNavDrawerTeaser"		        		
		        		className="full-height">
		        		<Button onClick={this.onLeftNavDrawerTeaserClick}><Glyphicon glyph="align-justify" /></Button>
		        	</div>

		        	{noCalcsOpenWindow}

					{/* Tabs are the main view element on the UI */}
					{openCalculatorTabs}
				</div>									
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




