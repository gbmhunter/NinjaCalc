//!
//! @file               app.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-02
//! @brief              Contains the "redux" actions for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

//import React, { Component } from 'react';

import React from 'react';
// Redux utility functions
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';

var ReactRadioGroup = require('react-radio-group');

const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk) // any Redux middleware, e.g. redux-thunk
  
  // Provides support for DevTools:
  //! @warning  This will cause the entire state/action history to be re-run everytime a
  //!     new action is dispatched, which could cause performance issues!
  //devTools()
)(createStore);

//=========== REDUCER ===========//
import defaultReducer from './calculators/ohms-law/ohms-law-reducer.js';
import * as ohmsLawActions from './calculators/ohms-law/ohms-law-actions.js';
//console.log(defaultReducer);

// Create store. Note that there is only one of these for the entire app.
const store = finalCreateStore(defaultReducer);

//import Tabs from 'react-draggable-tab';
import ReactDraggableTab from 'react-draggable-tab';
var Tab = ReactDraggableTab.Tab;
var Tabs = ReactDraggableTab.Tabs;

//var ReactGridLayout = require('react-grid-layout');


//! @brief    A single row in the calculator table.
// Have had serious issues with using the "class" ES6 syntax!!!
// e.g. "this" no longer exists as I know it!
//class CalcRow extends React.Component {
var CalcRow = React.createClass({

	onValueChange: function(event) {
		console.log('onValueChange() called with event = ');
		console.log(event);

		// Let's call a thunk to set the variable value inside redux state
		this.props.dispatch(ohmsLawActions.setVarVal(this.props.varData.name, event.target.value));
	},

	onCalcWhatChange: function(event) {
		console.log('CalcRow.onCalcWhatChange() called.');
		console.log('this =');
		console.log(this);
		//this.props.onCalcWhatChange(event, this.props.name);

		this.props.dispatch(ohmsLawActions.setOutputVar(this.props.varData.name));
	},

	render: function() {
		return (
			<tr>
				<td>{this.props.varData.name}</td>
				<td><input value={this.props.varData.val} onChange={this.onValueChange}></input></td>
				<td>{this.props.varData.units}</td>
				<td><input type="radio" checked={this.props.varData.direction == 'output'} onChange={this.onCalcWhatChange} /></td>
			</tr>
		);
	}
});

//class App extends React.Component {
var App = React.createClass({

	render: function() {

		var that = this;

		return (
			<div>
				<table>
					<tbody>
						{/* This generates the rows of the table which contain the calculator variables */
							this.props.state.vars.map(function(el){
								return <CalcRow varData={el} dispatch={that.props.dispatch} />
							})
						}
					</tbody>
				</table>

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
var appRender = React.render(
  <div id='redux-wrapper-div' style={{height: '100%'}}>
    <Provider store={store}>
        <App />
    </Provider>
  </div>,
  document.getElementById('content')
);

/*
const tabsClassNames = {
  tabBar: 'myTabBar',
  tabBarAfter: 'myTabBarAfter',
  tab:      'myTab',
  tabTitle: 'myTabTitle',
  tabCloseIcon: 'tabCloseIcon',
  tabBefore: 'myTabBefore',
  tabAfter: 'myTabAfter'
};

const tabsStyles = {
  tabBar: {},
  tab:{},
  tabTitle: {},
  tabCloseIcon: {},
  tabBefore: {},
  tabAfter: {}
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs:[
        <Tab key={'tab0'} title={'unclosable tab'} >
          <div>
            <h1>This tab cannot close</h1>
          </div>
        </Tab>,
        <Tab key={'tab1'} title={'1stTab'} >
          <div>
            <h1>This is tab1</h1>
          </div>
        </Tab>,
        <Tab key={'tab2'} title={'2ndTab Too long Toooooooooooooooooo long'} >
          <div>
            <pre>Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            </pre>
          </div>
        </Tab>,
        <Tab key={'tab3'} title={'Dynamic tab'} >

        </Tab>
      ],
      badgeCount: 0
    };
  }

  handleTabSelect(e, key, currentTabs) {
    console.log('handleTabSelect key:', key);
    this.setState({selectedTab: key, tabs: currentTabs});
  }

  handleTabClose(e, key, currentTabs) {
    console.log('tabClosed key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabPositionChange(e, key, currentTabs) {
    console.log('tabPositionChanged key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick(e, currentTabs) {
    // key must be unique
    const key = 'newTab_' + Date.now();
    let newTab = (<Tab key={key} title='untitled'>
                    <div>
                      <h1>New Empty Tab</h1>
                    </div>
                  </Tab>);
    let newTabs = currentTabs.concat([newTab]);

    this.setState({
      tabs: newTabs,
      selectedTab: key
    });
  }

  render() {

    return (
      <Tabs

        tabs={this.state.tabs}

      />
    )
  }
};*/

/*
React.render(
  <Calculator />,
  document.getElementById('content')
);*/

/*

class SortableCancelOnDropOutside extends Component {
  render() {
    return (
       <ReactGridLayout className="layout" cols={12} rowHeight={30}>
      <div key={1} _grid={{x: 0, y: 0, w: 1, h: 2}}>1</div>
      <div key={2} _grid={{x: 1, y: 0, w: 1, h: 2}}>2</div>
      <div key={3} _grid={{x: 2, y: 0, w: 1, h: 2}}>3</div>
    	</ReactGridLayout>
    );
  }
}

React.render(
	<SortableCancelOnDropOutside />,
	document.getElementById('content')
);*/

