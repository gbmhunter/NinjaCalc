//!
//! @file               app.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-02
//! @last-modified      2015-11-15
//! @brief              Contains the "redux" actions for the NinjaCalc app.
//! @details
//!     See README.rst in repo root dir for more info.

//import React, { Component } from 'react';

import React from 'react';
import ReactDOM from 'react-dom';
// Redux utility functions
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
var Select = require('react-select');
import Dropdown from 'react-dropdown';
import { Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
var PureRenderMixin = require('react-addons-pure-render-mixin');
var _ = require('lodash');

//import Tabs from './utility/react-draggable-tab/components/Tabs';
//import Tab from './utility/react-draggable-tab/components/Tab';


var ReactRadioGroup = require('react-radio-group');

import AbsoluteGrid from './utility/react-absolute-grid/AbsoluteGrid.js';
//var ReactGridLayout = require('react-grid-layout');

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

// Calculators are loaded into Redux state in the onMount function of the react App


//var ReactGridLayout = require('react-grid-layout');

 var sampleItems = [
  {key: 1, name: 'Test', sort: 0, filtered: 0},
  {key: 2, name: 'Test 1', sort: 1, filtered: 0},
];

var CalcInput = React.createClass({

	mixins: [PureRenderMixin],

	render: function() {

		//console.log('this.props = ');
		//console.log(this.props);

		return (			
			<OverlayTrigger placement="right" overlay={<Tooltip>{this.props.overlay}</Tooltip>}>
				<input
					value={this.props.value}
					onChange={this.props.onChange}
					disabled={this.props.disabled}
					className={this.props.className} />
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
//class CalcRow extends React.Component {
var CalcRow = React.createClass({

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
		var className = '';
		// worstValidationResult should either be 'ok', 'warning' or 'error'
		className += 'varDispVal ' + this.props.varData.get('worstValidationResult');


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
						className={className}
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

var Calculator = React.createClass({

	mixins: [PureRenderMixin],

	render: function() {

		var that = this;

		//console.log('this.props.data = ');
		//console.log(this.props.data);

		return (
			<div>
				<h1>{this.props.data.name}</h1>	
				<table className="calculatorTable">
					<tbody>
						{/* This generates the rows of the table which contain the calculator variables */							
							this.props.data.get('vars').map((el) => {
								//console.log('el.id = ' + el.get('id'));
								return <CalcRow key={el.get('id')} calcId={this.props.data.get('id')} varData={el} dispatch={that.props.dispatch} />
							})
						}
					</tbody>
				</table>			
			</div>
		);
	}
})



//class App extends React.Component {

var App = React.createClass({

	//mixins: [PureRenderMixin],

	componentDidMount: function() {


		this.props.dispatch(calcActions.addCalc(ohmsLawCalc));
		this.props.dispatch(calcActions.addCalc(lt3745Calc.data));
		//lt3745Calc.loadCalc(this.props.dispatch);
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

		return (
			<div>	
				<AbsoluteGrid items={items} />
				{/*<BasicLayout />*/}
				{/* Let's create a table for every calculator in array */
					this.props.state.get('calculators').map(function(el) {
						return <Calculator key={el.get('id')} data={el} dispatch={that.props.dispatch} />
					})
				}
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

/*
//import Tabs from 'react-draggable-tab';
import ReactDraggableTab from 'react-draggable-tab';
var Tab = ReactDraggableTab.Tab;
var Tabs = ReactDraggableTab.Tabs;

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

class App1 extends React.Component {
  constructor(props) {
    super(props);

    //let icon = (<image src='icon.png' style={{height:'13px'}}/>);
    //let fonticon = (<icon className='icon-html5'/>);
    //let badge = (<DynamicTabBadge />);

    this.state = {
      tabs:[
        (<Tab key={'tab0'} title={'unclosable tab'} disableClose={true} >
          <div>
            <h1>This tab cannot close</h1>
          </div>
        </Tab>),
        (<Tab key={'tab1'} title={'1stTab'} >
          <div>
            <h1>This is tab1</h1>
          </div>
        </Tab>),
        (<Tab key={'tab2'} title={'2ndTab Too long Toooooooooooooooooo long'} >
          <div>
            <pre>Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            </pre>
          </div>
        </Tab>),

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
    let newTab = (<Tab key={key} title='untitled' >
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

  handleTabDoubleClick(e, key) {

    let tab = _.find(this.state.tabs, (t) => {
      return t.key === key;
    });
    this.setState({
      editTabKey: key
    }, () => {
      this.refs.input.setValue(tab.props.title);
      this.refs.dialog.show();
    });
  }

  _onDialogSubmit() {
    let title = this.refs.input.getValue();
    let newTabs = _.map(this.state.tabs, (tab) => {
      if(tab.key === this.state.editTabKey) {
        return React.cloneElement(tab, {title: title});
      } else {
        return tab;
      }
    });
    this.setState({tabs: newTabs}, () => {
      this.refs.dialog.dismiss();
    });
  }

  _onDialogCancel() {
    this.refs.dialog.dismiss();
  }

  _handleBadgeInc() {
    this.setState({badgeCount: this.state.badgeCount + 1});
  }

  _handleBadgeDec() {
    this.setState({badgeCount: this.state.badgeCount + 1});
  }

  render() {

    let standardActions = [
      { text: 'Cancel', onClick: this._onDialogCancel.bind(this) },
      { text: 'Submit', onClick: this._onDialogSubmit.bind(this), ref: 'submit' }
    ];

    console.log(this.state.tabs);


    return (
      <div>
        <Tabs
          tabsClassNames={tabsClassNames}
          tabsStyles={tabsStyles}
          selectedTab={this.state.selectedTab ? this.state.selectedTab : 'tab2'}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          onTabDoubleClick={this.handleTabDoubleClick.bind(this)}
          tabs={this.state.tabs}
          shortCutKeys={
            {
              'close': ['alt+command+w', 'alt+ctrl+w'],
              'create': ['alt+command+t', 'alt+ctrl+t'],
              'moveRight': ['alt+command+tab', 'alt+ctrl+tab'],
              'moveLeft': ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
            }
          }
          keepSelectedTab={true}
          />      
        <p style={{position: 'fixed', 'bottom': '10px'}}>
          Source code can be found at <a href='https://github.com/georgeOsdDev/react-draggable-tab/tree/master/example'>GitHub</a>
        </p>
      </div>
    );
  }
}


React.render(<App1/>, document.getElementById('content'));
*/





