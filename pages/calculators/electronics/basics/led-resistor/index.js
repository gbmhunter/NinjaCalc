import Head from 'next/head'
import React from 'react'

import LayoutCalc from 'components/layout-calc'
import CalcVarRow from 'components/calc-var-row'
import { CalcHelper } from 'utils/calc-helper'
import { Validators } from 'utils/validators'
import TileImage from './tile-image.png'
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'

export var metadata = {
  id: 'led-resistor', // Make sure this has the same name as the directory this file is in
  name: 'LED Current-Limiting Resistor Calculator',
  description:
    'Calculate the value of a resistor needed to current-limit an LED.',
  categories: ['Electronics', 'Basics'], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: ['electronics', 'current', 'led', 'resistor', 'resistance', 'limit'],
  image: TileImage,
}

class CalcUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calc: new Calc({
        calcVars: {
          supplyVoltage_V: new CalcVar({
            name: 'Supply Voltage',
            type: 'numeric',
            direction: 'input',
            dispVal: '3.3',
            units: [
              new UnitsMultiplicative('V', 1e0),
            ],
            selUnit: 'V',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The supply voltage.',
          }), // supplyVoltage_V
          ledForwardVoltage_V: new CalcVar({
            name: 'LED Forward Voltage',
            type: 'numeric',
            direction: 'input',
            dispVal: '2.0',
            units: [
              new UnitsMultiplicative('V', 1e0),
            ],
            selUnit: 'V',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The forward voltage drop across the LED, at the desired curret you want to drive the LED at.',
          }), // ledForwardVoltage_V
          ledCurrent_A: new CalcVar({
            name: 'LED Current',
            type: 'numeric',
            direction: 'input',
            dispVal: '20m',
            units: [
              new UnitsMultiplicative('A', 1),
            ],
            selUnit: 'A',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The desired LED drive current.',
          }), // current_A
          seriesResistance_Ohms: new CalcVar({
            name: 'Series Resistance',
            type: 'numeric',
            direction: 'output',
            units: [              
              new UnitsMultiplicative('Ω', 1),
            ],
            selUnit: 'Ω',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The series resistance required to get the desired current.',
          }), // seriesResistance_Ohms
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars          
          const voltageDropResistor = calcVars.supplyVoltage_V.rawVal - calcVars.ledForwardVoltage_V.rawVal
          const seriesResistance_Ohms = voltageDropResistor / calcVars.ledCurrent_A.rawVal
          calcVars.seriesResistance_Ohms.rawVal = seriesResistance_Ohms                        
        },
      }), // calc
    } // this.state
    CalcHelper.initCalc(this.state.calc)
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
  } // componentDidMount()

  valueChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleValueChanged(calc, e)
    this.setState({
      calc: calc,
    })
  }

  unitsChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleUnitsChanged(calc, e)
    this.setState({
      calc: calc,
    })
  } // unitsChanged

  rbChanged = (e) => {      
    let calc = this.state.calc
    CalcHelper.handleRbChanged(calc, e)
    this.setState({
      calc: calc,
    })
  };

  render = () => {    
    const varWidth = 100

    return (
      <LayoutCalc title={metadata.name}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          <div className="calc-notes">
            <p>
              This calculator works out the series resistance needed to current-limit an LED (to string of LEDs connected in series) to a desired drive current.
            </p>
          </div>
          <table>
            <tbody>
              <CalcVarRow
                id="supplyVoltage_V"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="ledForwardVoltage_V"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="ledCurrent_A"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="seriesResistance_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>

          <div className="calc-notes">
            <p>
              The voltage drop across the resisor is found with:
            </p>

            <p style={{ textAlign: 'center' }}>{String.raw`$$ V_R = V_S - V_{led} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:
              <br />
              \( V_R \) is the voltage drop across the resistor, in \(V\)
              <br />
              \( V_S \) is the supply voltage, in \(V\)
              <br />
              {String.raw`\( V_{led} \) is the voltage drop across the LED, at the desired drive current, in \(A\)`}
              <br />
            </p>
          </div>
        </div>
        <style jsx>{`
          .calc-notes {
            max-width: 700px;
          }
        `}</style>
      </LayoutCalc>
    )
  };
}

export default CalcUI
