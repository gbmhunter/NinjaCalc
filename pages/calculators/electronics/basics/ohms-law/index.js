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
  id: 'ohms-law', // Make sure this has the same name as the directory this file is in
  name: 'Ohm\'s Law (V=IR)',
  description:
    'The hammer in any electrical engineers toolbox. Calculate voltage, resistance and current using Ohm\'s law.',
  categories: ['Electronics', 'Basics'], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: ['electronics', 'ohms', 'law', 'resistor', 'voltage', 'resistance', 'current'],
  image: TileImage,
}

class CalcUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calc: new Calc({
        calcVars: {
          voltage_V: new CalcVar({
            name: 'Voltage',
            type: 'numeric',
            direction: 'input',
            dispVal: '12',
            units: [
              new UnitsMultiplicative('V', 1),
            ],
            selUnit: 'V',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The voltage across the resistor.',
          }), // voltage_V
          current_A: new CalcVar({
            name: 'Current',
            type: 'numeric',
            direction: 'input',
            dispVal: '1',
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
            helpText: 'The current through the resistor.',
          }), // current_A
          resistance_Ohms: new CalcVar({
            name: 'Resistance',
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
            helpText: 'The resistance of the resistor.',
          }), // resistance_Ohms
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars
          if (calcVars.voltage_V.direction == 'output') {
            calcVars.voltage_V.rawVal =
              calcVars.current_A.rawVal * calcVars.resistance_Ohms.rawVal
          } else if (calcVars.current_A.direction == 'output') {
            calcVars.current_A.rawVal =
              calcVars.voltage_V.rawVal / calcVars.resistance_Ohms.rawVal
          } else if (calcVars.resistance_Ohms.direction == 'output') {
            calcVars.resistance_Ohms.rawVal =
              calcVars.voltage_V.rawVal / calcVars.current_A.rawVal
          } else {
            throw Error('No variable was an output.')
          }
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
  } // valueChanged

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
  } // rbChanged

  render = () => {
    const varWidth = 100

    return (
      <LayoutCalc title={metadata.name + ' Calculator'}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          <div className="calc-notes">
            <p>
              The following calculator works out either voltage, current or
              resistance, given the other two parameters, using the equation:
            </p>

            <p style={{ textAlign: 'center' }}>$$ V = IR $$</p>

            <p style={{ textAlign: 'center' }}>
              where:
              <br />
              \( V \) = voltage across the resistor, in \(V\)
              <br />
              \( I \) = current through the resistor, in \(A\)
              <br />
              \( R \) = resistance of the resistor, in \(\Omega\)
              <br />
            </p>
          </div>
          <table className="calc-vars" style={{ maxWidth: '700px' }}>
          <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Units&nbsp;</th>
                <th>Output&nbsp;</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <CalcVarRow
                id="voltage_V"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="current_A"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="resistance_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                rbGroup="calc-what"
                rbChanged={this.rbChanged}
                width={varWidth}
              />
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>
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
