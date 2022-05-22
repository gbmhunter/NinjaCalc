import Head from 'next/head'
import React from 'react'
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import MuiInput from '@mui/material/Input'
import Grid from '@mui/material/Grid'

import LayoutCalc from 'components/layout-calc'
import CalcVarRow from 'components/calc-var-row'
import { CalcHelper } from 'utils/calc-helper'
import { Validators } from 'utils/validators'
import TileImage from './tile-image.png'
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'

export var metadata = {
  id: 'moving-average-filter-designer', // Make sure this has the same name as the directory this file is in
  name: 'Moving Average Filter Designer',
  description:
    'Tool to help you design a moving average filter.',
  categories: ['Software'], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: ['software'],
  image: TileImage,
}

const Input = styled(MuiInput)`
  width: 42px;
`;

class CalcUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      windowSize: 4
    } // this.state
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
  } // componentDidMount()

  render = () => {

    const handleWindowSizeChange = (event, newValue) => {
      this.setState({
        windowSize: newValue
      })
    }

    const handleInputChange = (event) => {
      this.setState({
        windowSize: event.target.value === '' ? '' : Number(event.target.value)
      });
    };

    return (
      <LayoutCalc title={metadata.name + ' Calculator'}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          
          {/* WINDOW SIZE */}
          <Box sx={{ width: 350 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                Window size
              </Grid>
              <Grid item xs>
                <Slider aria-label="Volume"
                  step={1}
                  marks
                  min={1}
                  max={100}
                  value={this.state.windowSize} onChange={handleWindowSizeChange} />
              </Grid>
              <Grid item>
                <Input
                  value={this.state.windowSize}
                  size="small"
                  onChange={handleInputChange}
                  inputProps={{
                    step: 1,
                    min: 1,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
        <style jsx>{`
          .calc-notes {
            max-width: 700px;
          }
        `}</style>
      </LayoutCalc>
    )
  } // render
} // CalcUI

export default CalcUI
