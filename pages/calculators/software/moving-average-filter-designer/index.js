import Head from 'next/head'
import React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import MuiInput from '@mui/material/Input'
import Grid from '@mui/material/Grid'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Line } from 'react-chartjs-2'

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'


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
  width: 60px;
`

const RenderNoShape = (props) => {
  return null
}

function movingAvg(array, countBefore, countAfter) {
  if (countAfter == undefined) countAfter = 0
  const result = []
  for (let i = 0; i < array.length; i++) {
    if ((i - countBefore < 0) || (i + countAfter >= array.length)) {
      result.push(NaN)
      continue
    }
    const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length))
    const avg = subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length
    result.push(avg)
  }
  return result
}

const numOfDataPoints = 200
const inputFrequency_Hz = 100
const timePeriod_s = 20e-3
const samplingInterval_s = timePeriod_s / numOfDataPoints
const initialWindowSize = 10
class CalcUI extends React.Component {
  constructor(props) {
    super(props)


    let inputWaveData = []
    var seedrandom = require('seedrandom')
    var rng = seedrandom('hello.')
    const noise_amplitude = 0.2
    for (let i = 0; i < numOfDataPoints; i++) {
      let currTime_s = 0 + samplingInterval_s * i
      let y_val = Math.sin(2 * Math.PI * inputFrequency_Hz * currTime_s) + noise_amplitude * rng()
      inputWaveData[i] = { x: currTime_s, y: y_val }
    }

    this.state = {
      samplingFrequency_Hz: 1000,
      windowSize: initialWindowSize,
      inputWave: inputWaveData,
      outputSignalData: this.recalculateOutputSignal(inputWaveData, initialWindowSize)
    } // this.state
  }

  recalculateOutputSignal(inputSignalData, windowSize) {
    let inputMagnitude = []
    // console.log('inputSignalData=')
    // console.log(inputSignalData)
    for (let i = 0; i < numOfDataPoints; i++) {
      inputMagnitude[i] = inputSignalData[i].y
    }
    let outputMagnitude = movingAvg(inputMagnitude, windowSize)
    let outputSignalData = []
    for (let i = 0; i < numOfDataPoints; i++) {
      outputSignalData[i] = { x: inputSignalData[i].x, y: outputMagnitude[i] }
    }
    // console.log(outputSignalData)

    return outputSignalData
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
  } // componentDidMount()

  render = () => {

    const handleWindowSizeSliderChange = (event, newValue) => {

      let outputSignalData = this.recalculateOutputSignal(this.state.inputWave, newValue)
      this.setState({
        windowSize: newValue,
        outputSignalData: outputSignalData,
      })

    }

    const handleWindowSizeInputChange = (event) => {
      this.setState({
        windowSize: event.target.value === '' ? '' : Number(event.target.value)
      })
    }

    const handleSamplingFrequencySliderChange = (event, newValue) => {
      this.setState({
        samplingFrequency_Hz: newValue
      })
    }

    const handleSamplingFrequencyInputChange = (event) => {
      this.setState({
        samplingFrequency_Hz: event.target.value === '' ? '' : Number(event.target.value)
      })
    }

    return (
      <LayoutCalc title={metadata.name}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">

          {/* WINDOW SIZE */}
          <Box sx={{ width: 350 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                Window size
              </Grid>
              <Grid item xs={4}>
                <Slider aria-label="Volume"
                  step={1}
                  marks
                  min={1}
                  max={100}
                  value={this.state.windowSize} onChange={handleWindowSizeSliderChange} />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={this.state.windowSize}
                  size="small"
                  onChange={handleWindowSizeInputChange}
                  inputProps={{
                    step: 1,
                    min: 1,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>

              {/* SAMPLING_FREQUENCY */}
              <Grid item xs={4}>
                Sampling frequency
              </Grid>
              <Grid item xs={4}>
                <Slider aria-label="Volume"
                  step={10}
                  marks
                  min={100}
                  max={10000}
                  value={this.state.samplingFrequency_Hz} onChange={handleSamplingFrequencySliderChange} />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={this.state.samplingFrequency_Hz}
                  size="small"
                  onChange={handleSamplingFrequencyInputChange}
                  inputProps={{
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </Grid>
          </Box>


          <ScatterChart
            width={800}
            height={800}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Time" label={{ value: "Time", position: "insideBottomCenter", dy: 10}} unit="s" />
            <YAxis type="number" dataKey="y" name="Magnitude" label={{ value: "Magnitude", position: "insideLeft", angle: -90, dy: -10}} unit="" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Input Signal" data={this.state.inputWave} fill="#8884d8" line shape={<RenderNoShape />} strokeWidth={4} />
            <Scatter name="Output Signal" data={this.state.outputSignalData} fill="#82ca9d" line shape={<RenderNoShape />} strokeWidth={4} />
            {/* <Scatter name="B school" data={data02} fill="#82ca9d" line shape="diamond" /> */}
          </ScatterChart>

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
