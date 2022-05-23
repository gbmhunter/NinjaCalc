import Head from 'next/head'
import React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import MuiInput from '@mui/material/Input'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

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
import * as tf from '@tensorflow/tfjs'

import LayoutCalc from 'components/layout-calc'
import CalcVarRow from 'components/calc-var-row'
import { CalcHelper } from 'utils/calc-helper'
import { Validators } from 'utils/validators'
import TileImage from './tile-image.png'
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'
import { convoluteWindow } from 'utils/convolution-window'

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

const numOfDataPoints = 200
const inputFrequency_Hz = 100
const timePeriod_s = 20e-3
const samplingInterval_s = timePeriod_s / numOfDataPoints
const samplingFrequency_Hz = 1 / samplingInterval_s
const initialWindowSize = 10
const defaultWindowShape = 'sma'
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

    const window = this.createWindow(initialWindowSize)
    const outputSignalData = this.recalculateOutputSignal(inputWaveData, window)
    const { freqResponseFreqs, freqResponseMags } = this.calcFreqResponse(defaultWindowShape, initialWindowSize, samplingFrequency_Hz)

    this.state = {
      samplingFrequency_Hz: 1000,
      windowShape: defaultWindowShape,
      windowSize: initialWindowSize,
      window: window,
      inputWave: inputWaveData,
      outputSignalData: outputSignalData,
      freqResponseFreqs: freqResponseFreqs,
      freqResponseMags: freqResponseMags,
    } // this.state
  }

  recalculateOutputSignal(inputSignalData, window) {
    let inputMagnitude = []
    for (let i = 0; i < numOfDataPoints; i++) {
      inputMagnitude[i] = inputSignalData[i].y
    }
    let outputMagnitude = convoluteWindow(inputMagnitude, window)
    let outputSignalData = []
    for (let i = 0; i < numOfDataPoints; i++) {
      outputSignalData[i] = { x: inputSignalData[i].x, y: outputMagnitude[i] }
    }

    return outputSignalData
  }

  createWindow(windowSize) {
    let window = []
    for (let i = 0; i < windowSize; i++) {
      window.push(1.0 / windowSize)
    }
    return window
  }

  calcFreqResponse = (windowShape, windowSize, samplingFrequency_Hz) => {
    const nyquist_Hz = samplingFrequency_Hz / 2
    if (windowShape == 'sma') {
      let frequencies_Hz = tf.linspace(0, nyquist_Hz, 100)
      let normFreq_cyclesPerSample = tf.div(frequencies_Hz, samplingFrequency_Hz)
      let topFrac = tf.sin(normFreq_cyclesPerSample.mul(windowSize).mul(Math.PI))
      let botFrac = tf.sin(normFreq_cyclesPerSample.mul(Math.PI))
      let hofF = tf.abs(topFrac.div(botFrac)).mul(1/windowSize)
      // H(0) will of been divide by 0, fix to equal 1/N
      hofF = hofF.arraySync()
      hofF[0] = 1
      hofF = tf.tensor1d(hofF)
      hofF.print()
      return {  freqResponseFreqs: frequencies_Hz, freqResponseMags: hofF }

    } else {
      return []
    }
  } 

  handleWindowShapeChange = (event) => {
    this.setState({
      windowShape: event.target.value,
    })
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
  } // componentDidMount()

  render = () => {

    const handleWindowSizeSliderChange = (event, newValue) => {
      let window = this.createWindow(newValue)
      let outputSignalData = this.recalculateOutputSignal(this.state.inputWave, window)
      this.setState({
        windowSize: newValue,
        window: window,
        outputSignalData: outputSignalData,
      })

    }

    const handleWindowSizeInputChange = (event) => {
      const windowSize = event.target.value === '' ? '' : Number(event.target.value)
      let window = this.createWindow(windowSize)
      let outputSignalData = this.recalculateOutputSignal(this.state.inputWave, window)
      this.setState({
        windowSize: windowSize,
        window: window,
        outputSignalData: outputSignalData,
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


    // Convert frequency response data to what plotting lib understands
    const freqResponseFreqs = this.state.freqResponseFreqs.arraySync()
    const freqResponseMags = this.state.freqResponseMags.arraySync()
    let freqResponseChartData = []
    for (let i = 0; i < freqResponseFreqs.length; i++) {
      freqResponseChartData.push({ x: freqResponseFreqs[i], y: freqResponseMags[i] })
    }    

    return (
      <LayoutCalc title={metadata.name}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">

          <Box sx={{ width: 350 }}>            
            <Grid container spacing={2} alignItems="center">

              {/* WINDOW SHAPE */}
              <Grid item xs={4}>
                Window Shape:
              </Grid>
              <Grid item xs={8}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.windowShape}
                  label="Window Shape"
                  onChange={this.handleWindowShapeChange}
                >
                  <MenuItem value="sma">SMA</MenuItem>
                  <MenuItem value="ema">EMA</MenuItem>
                  <MenuItem value="gaussian">Gaussian</MenuItem>
                </Select>
              </Grid>

              {/* WINDOW SIZE */}
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
            width={400}
            height={400}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Time" label={{ value: "Time", position: "insideBottomCenter", dy: 10 }} unit="s" />
            <YAxis type="number" dataKey="y" name="Magnitude" label={{ value: "Magnitude", position: "insideLeft", angle: -90, dy: -10 }} unit="" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Input Signal" data={this.state.inputWave} fill="#8884d8" line shape={<RenderNoShape />} strokeWidth={4} />
            <Scatter name="Output Signal" data={this.state.outputSignalData} fill="#82ca9d" line shape={<RenderNoShape />} strokeWidth={4} />
            {/* <Scatter name="B school" data={data02} fill="#82ca9d" line shape="diamond" /> */}
          </ScatterChart>

          <ScatterChart
            width={400}
            height={400}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Time" label={{ value: "Frequency [Hz]", position: "insideBottomCenter", dy: 10 }} unit="" />
            <YAxis type="number" dataKey="y" name="Magnitude" label={{ value: "Magnitude", position: "insideLeft", angle: -90, dy: -10 }} unit="" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Frequency Response" data={freqResponseChartData} fill="#8884d8" line shape={<RenderNoShape />} strokeWidth={4} />
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
