import Head from 'next/head'
import React from 'react'

import Nav from '~/components/nav'
import Layout from '~/components/layout-calc'
import VarRow from '~/components/calc-var-row'
import { Calc } from '~/utils/calc'
import { CalcVar } from '~/utils/calc-var'
import CalcHelper from '~/utils/calc-helper'
import TileImage from './tile-image.png'

export var metadata = {
  id: '555-timer-astable-rt-rb-c', // Make sure this has the same name as the directory this file is in
  name: '555 Timer, Astable (Freq/Duty Cycle In, Rt/Rb/C Out)',  
  description: 'Calculate the resistor and capacitors values for a 555 timer in astable configuration.',
  categories: ['Electronics', 'ICs'],
  tags: ['555', 'timer'],
  image: TileImage,
}

class UI extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      calc: new Calc({
        calcVars: {
          freq_Hz: new CalcVar({
            name: 'Frequency',
            type: 'numeric',
            direction: 'input',
            dispVal: '10k',
            metricPrefixes: true,          
            units: [
              ['Hz', 1e0],
            ],
            selUnit: 'Hz',            
            validation: {
              fns: [
                (value) => {
                  console.log('validator() called with value=' + value)
                  if (value <= 0) { return ['error', 'Frequency must be greater than 0,'] }
                  return ['ok', '']
                },
              ]
            },
            helpText: 'The desired frequency of the 555 output waveform.',
          }), // freq_Hz
          dutyCycle_ratio: new CalcVar({
            name: 'Duty Cycle',
            type: 'numeric',
            direction: 'input',
            dispVal: '60',
            metricPrefixes: false,
            units: [
              ['%', 1e-2],              
            ],
            selUnit: '%',
            validations: {
              fns: [
                (value) => {
                  if (value < 50e-2) return ['error', 'Duty cycle must be greater or equal to 50%.']
                  if (value > 100e-2) return ['error', 'Duty cycle must be less or equal to 100%.']
                  return ['ok', '']
                },
              ]
            },
            helpText: 'The desired duty cycle. Because of the design of the 555, the duty cycle must be greater than 50%.'
          }), // dutyCycle_ratio
          capacitance_F: new CalcVar({
            name: 'Capacitance',
            type: 'numeric',
            direction: 'input',
            dispVal: '10n',
            metricPrefixes: true,        
            units: [
              ['F', 1e0],              
            ],
            selUnit: 'F',
            validation: {
              fns: [
                  (value) => {
                  if (value <= 0) return ['error', 'Capacitance must be greater than zero.']
                  if (value < 1e-12) return ['warning', 'This is an extremely small capacitance.']
                  if (value > 1e-3) return ['warning', 'This is an extremely large capacitance.']
                  return ['ok', '']
                },
              ]
            },
            helpText: 'The capacitance of the capacitor connected to the 555.',
          }), // capacitance_F
          period_s: new CalcVar({
            name: 'Period',
            type: 'numeric',
            direction: 'output',
            metricPrefixes: true,
            units: [
              ['s', 1e0],              
            ],
            selUnit: 's',
            sigFig: 3,
          }), // period_s
          timeHigh_s: new CalcVar({
            name: 'Time High',
            type: 'numeric',
            direction: 'output',
            metricPrefixes: true,
            units: [
              ['s', 1e0],              
            ],
            selUnit: 's',
            sigFig: 3,
          }), // timeHigh_s
          timeLow_s: new CalcVar({
            name: 'Time Low',
            type: 'numeric',
            direction: 'output',
            metricPrefixes: true,
            units: [
              ['s', 1e0],              
            ],
            selUnit: 's',
            sigFig: 3,
          }), // timeLow_s
          r1_Ohms: new CalcVar({
            name: 'R1',
            type: 'numeric',
            direction: 'output',
            metricPrefixes: true,
            units: [
              ['Ω', 1e0],
            ],
            selUnit: 'Ω',
            sigFig: 3,
          }), // r1_Ohms
          r2_Ohms: new CalcVar({
            name: 'R2',
            type: 'numeric',
            direction: 'output',
            metricPrefixes: true,            
            units: [
              ['Ω', 1e0],
            ],
            selUnit: 'Ω',
            sigFig: 3,
          }), // r2_Ohms
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars
          const period_s = 1/calcVars.freq_Hz.rawVal
          calcVars.period_s.rawVal = period_s
      
          const timeHigh_s = calcVars.dutyCycle_ratio.rawVal * period_s
          calcVars.timeHigh_s.rawVal = timeHigh_s
      
          const timeLow_s = period_s - timeHigh_s
          calcVars.timeLow_s.rawVal = timeLow_s
      
          const r1_Ohms = timeLow_s / (0.693*calcVars.capacitance_F.rawVal)
          calcVars.r1_Ohms.rawVal = r1_Ohms
      
          const r2_Ohms = timeHigh_s/(0.693*calcVars.capacitance_F.rawVal) - r1_Ohms
          calcVars.r2_Ohms.rawVal = r2_Ohms
        },
      }), // calc
    } // this.state
    CalcHelper.initCalc(this.state.calc)
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    console.log('Calculator555TimerRtRbC mounted.')
  } // componentDidMount()

  valueChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleValueChanged(calc, e)
    this.setState({
      calc: calc
    })
  }

  unitsChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleUnitsChanged(calc, e)
    this.setState({
      calc: calc
    })
  }

  render = () => {

    // Area of ring = pi * inner diameter * thickness
    const calcVars = this.state.calc.calcVars
    const varWidth = 100

    return (
      <Layout title={metadata.name}>
        <Head>
          <title>{metadata.name}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <p style={{ maxWidth: '500px' }}>This calculator calculates the resistances and capacitances needed to operate a 555 timer in astable mode. The duty cycle cannot be set lower than 50%, if you want to do this you will have to attach an inverter to the output.</p>
          <table>
            <tbody>
              <VarRow id="freq_Hz" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="dutyCycle_ratio" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="capacitance_F" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="period_s" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeHigh_s" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeLow_s" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r1_Ohms" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r2_Ohms" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>

          <div className="calc-notes">
          </div>


        </div>
        <style jsx>{`
          .calc-notes {
            max-width: 700px;
          }

        `}</style>
      </Layout>
    )
  }
}

export default UI