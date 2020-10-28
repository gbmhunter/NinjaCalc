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
  id: 'mp4558', // Make sure this has the same name as the directory this file is in
  name: 'MP4558 Design Tool',
  description: '',
  categories: [ 'Electronics', 'ICs' ], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: [ 'electronics', 'ICs', 'MP4558', 'SMPS' ],
  image: TileImage,
}

class CalcUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calc: new Calc({
        calcVars: {
          fsw_Hz: new CalcVar({
            name: 'Switching Frequency',
            type: 'numeric',
            direction: 'input',
            dispVal: '500k',
            units: [
              new UnitsMultiplicative('Hz', 1),
            ],
            selUnit: 'Hz',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The desired switching frequency.',
          }), // fsw_Hz
          rFreq_Ohms: new CalcVar({
            name: 'Rfreq',
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
            helpText: 'Resistance needed for the resistor which sets the switching frequency.',
          }), // rFreq_Ohms
          r1_Ohms: new CalcVar({
            name: 'R1',
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
            helpText: 'The resistance of the top resistor in the resistor divider which sets the output voltage via the feedback pin.',
          }), // r1_Ohms
          r2_Ohms: new CalcVar({
            name: 'R2',
            type: 'numeric',
            direction: 'input',
            dispVal: '10k',
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
            helpText: 'The resistance of the bottom resistor in the resistor divider which sets the output voltage via the feedback pin.',
          }), // r2_Ohms
          vOut_V: new CalcVar({
            name: 'Vout',
            type: 'numeric',
            direction: 'input',
            dispVal: '3.3',
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
            helpText: 'The desired output voltage.',
          }), // r2_Ohms
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars      
          // As per page 11 of datasheet
          calcVars.rFreq_Ohms.rawVal = ((100000 / (calcVars.fsw_Hz.rawVal * 1e-3)) - 5)*1e3
          // As per page 12 of datasheet
          calcVars.r1_Ohms.rawVal = calcVars.r2_Ohms.rawVal*(calcVars.vOut_V.rawVal/0.8 - 1)
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
          </div>
          <table className="calc-vars" style={{ maxWidth: '700px' }}>
          <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Units&nbsp;</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <CalcVarRow
                id="fsw_Hz"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="rFreq_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="r1_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="r2_Ohms"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="vOut_V"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
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
