//import React, { Component } from 'react';
//import Container from './Container';

import React from 'react';

//import Tabs from 'react-draggable-tab';
import ReactDraggableTab from 'react-draggable-tab';
var Tab = ReactDraggableTab.Tab;
var Tabs = ReactDraggableTab.Tabs;

//var ReactGridLayout = require('react-grid-layout');

class CalcRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.units}</td>
      </tr>
    );
  }
}

class Calculator extends React.Component {
  render() {
    return (
      <div>
      <table>
        <tbody>
            <CalcRow name="Voltage" units="V" />
            <CalcRow name="Current" units="I" />
            <CalcRow name="Resistance" units="I" />
        </tbody>
      </table>

      </div>
    );
  }
}

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
};

React.render(
  <App />,
  document.getElementById('content')
);

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

