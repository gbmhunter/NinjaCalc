import Head from 'next/head'
import React from 'react'

import Nav from '~/components/nav'
import Layout from '~/components/layout'
import VarRow from '~/components/VarRow'
import CalcHelper from '~/utils/calc-helper'
import TileImage from './tile-image.png'

export var metadata = {
  id: '555-timer-astable-rt-rb-c', // Make sure this has the same name as the directory this file is in
  name: '555 Timer, Astable (Freq/Duty Cycle In, Rt/Rb/C Out)',
  path: 'calculators/electronics/ics/555-timer-astable-rt-rb-c',
  description: 'Calculate the resistor and capacitors values for a 555 timer in astable configuration.',
  categories: ['Electronics', 'PCB Design'],
  tags: ['555', 'timer'],
  image: TileImage,
}

class UI extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      calc: {
        calcVars: {
          freq: {
            name: 'Frequency',
            direction: 'input',
            dispVal: '100',
            rawVal: null,
            units: [
              ['Hz', 1e0],
              ['kHz', 1e3],
            ],
            selUnit: 'Hz',
            validation: {
              fn: (value) => {
                console.log('validator() called with value=' + value)
                if (value <= 0) { return ['error', 'Frequency must be greater than 0,'] }
                return ['ok', '']
              },
            },
          }, // freq
          dutyCycle: {
            name: 'Duty Cycle',
            direction: 'input',
            dispVal: '60',
            rawVal: null,
            units: [
              ['%', 1e-2],              
            ],
            selUnit: '%',
            validation: {
              fn: (value) => {
                if (value < 50e-2) return ['error', 'Duty cycle must be greater or equal to 50%.']
                if (value > 100e-2) return ['error', 'Duty cycle must be less or equal to 100%.']
                return ['ok', '']
              },
            },
          }, // dutyCycle
          capacitance: {
            name: 'Capacitance',
            direction: 'input',
            dispVal: '1',
            rawVal: null,
            units: [
              ['uF', 1e-6],              
            ],
            selUnit: 'uF',
            validation: {
              fn: (value) => {
                if (value <= 0) return ['error', 'Capacitance must be greater than zero.']
                if (value < 1e-12) return ['warning', 'This is an extremely small capacitance.']
                if (value > 1e-3) return ['warning', 'This is an extremely large capacitance.']
                return ['ok', '']
              },
            },
          }, // capacitance
          period: {
            name: 'Period',
            direction: 'output',
            dispVal: '0',
            rawVal: null,
            units: [
              ['ms', 1e-3],   
              ['s', 1e0],              
            ],
            selUnit: 'ms',
            sigFig: 3,
          }, // period
          timeHigh: {
            name: 'Time High',
            direction: 'output',
            dispVal: '0',
            rawVal: null,
            units: [
              ['ms', 1e-3],   
              ['s', 1e0],              
            ],
            selUnit: 'ms',
            sigFig: 3,
          }, // timeHigh
          timeLow: {
            name: 'Time Low',
            direction: 'output',
            dispVal: '0',
            rawVal: null,
            units: [
              ['ms', 1e-3],
              ['s', 1e0],              
            ],
            selUnit: 'ms',
            sigFig: 3,
          }, // timeLow
          r1: {
            name: 'R1',
            direction: 'output',
            dispVal: '0',
            rawVal: null,
            units: [
              ['Ω', 1e0],
              ['kΩ', 1e3],
            ],
            selUnit: 'kΩ',
            sigFig: 3,
          }, // r1
          r2: {
            name: 'R2',
            direction: 'output',
            dispVal: '0',
            rawVal: null,
            units: [
              ['Ω', 1e0],
              ['kΩ', 1e3],
            ],
            selUnit: 'kΩ',
            sigFig: 3,
          }, // r2
        }, // calcVars
        eqFn: (calcVars) => {
          const period_s = 1/calcVars.freq.rawVal
          calcVars.period.rawVal = period_s
      
          const timeHigh_s = calcVars.dutyCycle.rawVal * period_s
          calcVars.timeHigh.rawVal = timeHigh_s
      
          const timeLow_s = period_s - timeHigh_s
          calcVars.timeLow.rawVal = timeLow_s
      
          const r1_Ohms = timeLow_s / (0.693*calcVars.capacitance.rawVal)
          calcVars.r1.rawVal = r1_Ohms
      
          const r2_Ohms = timeHigh_s/(0.693*calcVars.capacitance.rawVal) - r1_Ohms
          calcVars.r2.rawVal = r2_Ohms
        },
      }, // calc
    } // this.state
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])

    CalcHelper.initCalc(this.state.calc)
    this.setState({
      calc: this.state.calc
    })

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
      <Layout>
        <Head>
          <title>{metadata.name}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <p style={{ maxWidth: '500px' }}>This calculator calculates the resistances and capacitances needed to operate a 555 timer in astable mode. The duty cycle cannot be set lower than 50%, if you want to do this you will have to attach an inverter to the output.</p>
          <table>
            <tbody>

              <VarRow id="freq" calcVar={calcVars.freq} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="dutyCycle" calcVar={calcVars.dutyCycle} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="capacitance" calcVar={calcVars.capacitance} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="period" calcVar={calcVars.period} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeHigh" calcVar={calcVars.timeHigh} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeLow" calcVar={calcVars.timeLow} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r1" calcVar={calcVars.r1} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r2" calcVar={calcVars.r2} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
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