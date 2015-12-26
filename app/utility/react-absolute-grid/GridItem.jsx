'use strict';

import React from 'react';
import BaseDisplayObject from './BaseDisplayObject.js';
import { Button, Thumbnail } from 'react-bootstrap';

import * as calcActions from '../../actions/calc-actions.js';
import * as customCalcActions from '../../actions/custom-calc-actions.js';


export default class GridItem extends BaseDisplayObject{


    onClick() {
        console.log('GridItem.onClick() called.');
        // Let's dispatch an action to open the calculator
        this.props.item.dispatch(customCalcActions.openCalc(this.props.item.calcId));
    }

    render() {
        //IMPORTANT: Without the style, nothing happens :(
        var itemStyle = super.getStyle.call(this);

        return (
            <div
                style={itemStyle}
                className="gridItem">
                {/* Problem with Thumbnail is we can't set image size? */}
                <Thumbnail src={this.props.item.imageSrc} alt="242x200">
                    <h3>{this.props.item.name}</h3>
                    <p>{this.props.item.description}</p>
                    <p>
                      <Button bsStyle="primary" onClick={this.onClick.bind(this)}>Open</Button>&nbsp;
                      {/*<Button bsStyle="default">Button</Button>*/}
                    </p>
                </Thumbnail>
            </div>
        );
    }
}