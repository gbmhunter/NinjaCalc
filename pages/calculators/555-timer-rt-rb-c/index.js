import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'
import VarRow from '~/components/VarRow'
import VarRowOutput from '~/components/VarRowOutput'

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
          dispVal: '10',
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
          dispVal: null,
          rawVal: null,
          units: [
            ['s', 1e0],              
          ],
          selUnit: 's'
        }, // period
        timeHigh: {
          name: 'Time High',
          type: 'output',
          dispVal: null,
          rawVal: null,
          units: [
            ['s', 1e0],              
          ],
          selUnit: 's',
        }, // period
      }, // vars
      eqFn: (calcVars) => {
        console.log('eqFn() called with calcVars=')
        console.log(calcVars)
        const period_s = 1/calcVars.freq.rawVal
        calcVars.period.rawVal = period_s

        const timeHigh_s = calcVars.dutyCycle.rawVal * period_s
        console.log('timeHigh_s=' + timeHigh_s)
        calcVars.timeHigh.rawVal = timeHigh_s
      }
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

  initCalcVars = (calcVars) => {
    // Sync all input disp vals to raw vals
    for (let calcVarName in calcVars) {
      let calcVar = calcVars[calcVarName]
      if (calcVar.type === 'input') {
        this.setRawValFromDispVal(calcVar)
        this.runValidation(calcVar)
      }
    }

    this.calcOutputsAndUpdateDispVals(calcVars)
  }

  calcOutputsAndUpdateDispVals = (calcVars) => {
    // Calculate outputs
    this.state.eqFn(calcVars)

    // Sync all output raw vals to disp vals
    for (let calcVarName in calcVars) {
      let calcVar = calcVars[calcVarName]
      if (calcVar.type === 'output') {        
        this.setDispValFromRawVal(calcVar)
      }
    }
  }

  valueChanged = (e) => {
    let vars = this.state.vars
    const value = e.target.valueAsNumber || e.target.value
    let calcVar = vars[e.target.name]
    calcVar.dispVal = value
    // Recalculate raw value from displayed value
    this.setRawValFromDispVal(calcVar)
    this.runValidation(calcVar)
    this.calcOutputsAndUpdateDispVals(calcVars)
    this.setState({
      vars: vars
    })
  }

  unitsChanged = (e) => {
    let calcVars = this.state.vars
    let calcVar = calcVars[e.target.name]
    calcVar.selUnit = e.target.value
    this.setRawValFromDispVal(calcVar)
    this.runValidation(calcVar)
    this.calcOutputsAndUpdateDispVals(calcVars)
    this.setState({
      vars: calcVars
    })
  }

  /**
   * Scales a raw value by the selected unit for this value, typically
   * resulting in a value in SI units. 
   * 
   * @param calcVar The calculator variable to get units of.
   * @returns The scaled value.
   */
  setRawValFromDispVal(calcVar) {
    console.log('setRawValFromDispVal() called with calcVar=')
    console.log(calcVar)
    const unit = calcVar.units.filter(unit => {
      return unit[0] == calcVar.selUnit
    })[0]
    const rawVal = calcVar.dispVal * unit[1]
    console.log('rawVal=' + rawVal)
    calcVar.rawVal = rawVal
  }

  setDispValFromRawVal(calcVar) {
    console.log('setDispValFromRawVal() called with calcVar=')
    console.log(calcVar)
    const unit = calcVar.units.filter(unit => {
      return unit[0] == calcVar.selUnit
    })[0]
    const dispVal = calcVar.rawVal / unit[1]
    console.log('dispVal=' + dispVal)
    calcVar.dispVal = dispVal
  }

  runValidation(calcVar) {
    console.log('runValidation() called with calcVar=')
    console.log(calcVar)
    const validationResult = calcVar.validation.fn(calcVar.rawVal)
    const validationState = validationResult[0]
    const validationMsg = validationResult[1]
    calcVar.validation.state = validationState
    calcVar.validation.msg = validationMsg
    console.log('Set validationState=' + validationState + ', validationMsg=' + validationMsg)
  }

  render = () => {

    // Area of ring = pi * inner diameter * thickness
    const vars = this.state.vars
    const varWidth = 100

    // Calculate outputs from inputs
    const period_s = 1/vars.freq.rawVal


    console.log('render() called with vars=')
    console.log(vars)

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