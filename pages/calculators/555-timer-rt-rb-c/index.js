import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'
import VarRow from '~/components/VarRow'
import VarRowOutput from '~/components/VarRowOutput'

import CalcHelper from '~/utils/calc-helper'

export var metadata = {
  id: '555-timer-rt-rb-c',
  name: '555 Timer (Freq/Duty Cycle In, Rt/Rb/C Out)',
  categories: ['Electronics', 'PCB Design'],
  tags: ['555', 'timer']
}

class UI extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      vars: {
        freq: {
          name: 'Frequency',
          type: 'input',
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
            state: 'ok',
            msg: '',
          },
        }, // freq
        dutyCycle: {
          name: 'Duty Cycle',
          type: 'input',
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
            state: 'ok',
            msg: '',
          },
        }, // dutyCycle
        capacitance: {
          name: 'Capacitance',
          type: 'input',
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
            state: 'ok',
            msg: '',
          },
        }, // capacitance
        period: {
          name: 'Period',
          type: 'output',
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
          type: 'output',
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
          type: 'output',
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
          type: 'output',
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
          type: 'output',
          dispVal: '0',
          rawVal: null,
          units: [
            ['Ω', 1e0],
            ['kΩ', 1e3],
          ],
          selUnit: 'kΩ',
          sigFig: 3,
        }, // r2
      }, // vars
    } // this.state
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])

    this.initCalcVars(this.state.vars)
    this.setState({
      vars: this.state.vars
    })

    console.log('Calculator555TimerRtRbC mounted.')
  } // componentDidMount()

  eqFn = (calcVars) => {
    console.log('eqFn() called with calcVars=')
    console.log(calcVars)
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
  }

  initCalcVars = (calcVars) => {
    // Sync all input disp vals to raw vals
    for (let calcVarName in calcVars) {
      let calcVar = calcVars[calcVarName]
      if (calcVar.type === 'input') {
        CalcHelper.setRawValFromDispVal(calcVar)
        CalcHelper.runValidation(calcVar)
      }
    }

    this.eqFn(calcVars)
    CalcHelper.updateDispVals(calcVars)
    this.setState({
      vars: calcVars
    })
  }



  valueChanged = (e) => {
    let calcVars = this.state.vars
    const value = e.target.valueAsNumber || e.target.value
    let calcVar = calcVars[e.target.name]
    calcVar.dispVal = value
    // Recalculate raw value from displayed value
    CalcHelper.setRawValFromDispVal(calcVar)
    CalcHelper.runValidation(calcVar)
    this.eqFn(calcVars)
    CalcHelper.updateDispVals(calcVars)
    this.setState({
      vars: calcVars
    })
  }

  unitsChanged = (e) => {
    let calcVars = this.state.vars
    let calcVar = calcVars[e.target.name]
    calcVar.selUnit = e.target.value
    if (calcVar.type === 'input')
      CalcHelper.setRawValFromDispVal(calcVar)
    CalcHelper.runValidation(calcVar)
    this.eqFn(calcVars)
    CalcHelper.updateDispVals(calcVars)
    this.setState({
      vars: calcVars
    })
  }

  render = () => {

    // Area of ring = pi * inner diameter * thickness
    const vars = this.state.vars
    const varWidth = 100

    // Calculate outputs from inputs
    const period_s = 1/vars.freq.rawVal

    return (
      <Layout>
        <Head>
          <title>555 Timer Calculator</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <table>
            <tbody>

              <VarRow id="freq" calcVar={vars.freq} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="dutyCycle" calcVar={vars.dutyCycle} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="capacitance" calcVar={vars.capacitance} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="period" calcVar={vars.period} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeHigh" calcVar={vars.timeHigh} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeLow" calcVar={vars.timeLow} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r1" calcVar={vars.r1} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r2" calcVar={vars.r2} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
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