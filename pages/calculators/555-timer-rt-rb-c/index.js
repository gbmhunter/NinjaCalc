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
        }, // dutyCycle
      } // vars
    }
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])

    this.initCalcVar(this.state.vars.freq)

    console.log('Calculator555TimerRtRbC mounted.')
  } // componentDidMount()

  initCalcVar = (calcVar) => {
    let vars = this.state.vars
    this.setRawValFromDispVal(calcVar)
    this.runValidation(calcVar)
    this.setState({
      vars: vars
    })
  }

  valueChanged = (e) => {
    let vars = this.state.vars
    const value = e.target.valueAsNumber || e.target.value
    let calcVar = vars[e.target.name]
    calcVar.dispVal = value
    // Recalculate raw value from displayed value
    this.setRawValFromDispVal(calcVar)
    this.runValidation(calcVar)
    this.setState({
      vars: vars
    })
  }

  unitsChanged = (e) => {
    let vars = this.state.vars
    let calcVar = vars[e.target.name]
    calcVar.selUnit = e.target.value
    this.setRawValFromDispVal(calcVar)
    this.runValidation(calcVar)
    this.setState({
      vars: vars
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

              <VarRow id="freq" name="Frequency" calcVar={vars.freq} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="dutyCycle" name="Duty Cycle" calcVar={vars.dutyCycle} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="capacitance" name="Capacitance" calcVar={vars.capacitance} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
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