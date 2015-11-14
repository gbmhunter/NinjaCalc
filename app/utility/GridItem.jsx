'use strict';

import React from 'react';
import BaseDisplayObject from './BaseDisplayObject.js';
import { Button } from 'react-bootstrap';

export default class GridItem extends BaseDisplayObject{

  render() {
    //IMPORTANT: Without the style, nothing happens :(
    var itemStyle = super.getStyle.call(this);

    return <div
            style={itemStyle}
            className="gridItem">
            	<a>{this.props.item.name}</a>
            	<br />
            	<Button>Load</Button>

            </div>;
  }
}