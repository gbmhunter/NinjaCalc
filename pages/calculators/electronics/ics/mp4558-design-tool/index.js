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
  id: 'mp4558-design-tool', // Make sure this has the same name as the directory this file is in
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
          }), // vOut_V
          iLoad_A: new CalcVar({
            name: 'Iload',
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
            helpText: 'The average load current.',
          }), // iLoad_A
          inductorRippleCurrent_perc: new CalcVar({
            name: 'Inductor Ripple Current',
            type: 'numeric',
            direction: 'input',
            dispVal: '30',
            units: [
              new UnitsMultiplicative('%', 1),
            ],
            selUnit: '%',
            metricPrefixes: false,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The allowable inductor ripple current, as a percentage of the average load current Iload. Normally this is set to around 30%.',
          }), // inductorRippleCurrent_perc
          vIn_V: new CalcVar({
            name: 'Vin',
            type: 'numeric',
            direction: 'input',
            dispVal: '36',
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
            helpText: 'The input voltage.',
          }), // vIn_V
          inductance_H: new CalcVar({
            name: 'Inductance',
            type: 'numeric',
            direction: 'output',            
            units: [
              new UnitsMultiplicative('H', 1),
            ],
            selUnit: 'H',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The required inductance of the inductor.',
          }), // inductance_H
          iLP_A: new CalcVar({
            name: 'Il,peak',
            type: 'numeric',
            direction: 'output',            
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
            helpText: 'The peak current through the inductor. Make sure that the inductor saturation current is above this value.',
          }), // iLP_A
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars      
          // As per page 11 of datasheet
          const fsw_Hz = calcVars.fsw_Hz.rawVal
          calcVars.rFreq_Ohms.rawVal = ((100000 / (fsw_Hz * 1e-3)) - 5)*1e3

          const vOut_V = calcVars.vOut_V.rawVal
          const r2_Ohms = calcVars.r2_Ohms.rawVal
          // As per page 12 of datasheet
          calcVars.r1_Ohms.rawVal = r2_Ohms*(vOut_V/0.8 - 1)

          // Calculate inductance, as per page 12 of the datasheet
          const iLoad_A = calcVars.iLoad_A.rawVal
          const inductorRippleCurrent_perc = calcVars.inductorRippleCurrent_perc.rawVal
          const vIn_V = calcVars.vIn_V.rawVal
          const inductorRippleCurrent_A = iLoad_A * (inductorRippleCurrent_perc/100.0)
          const inductance_H = (vOut_V / (fsw_Hz * inductorRippleCurrent_A)) * (1 - vOut_V / vIn_V)
          calcVars.inductance_H.rawVal = inductance_H

          // Calculate peak inductor current, as per page 12 of the datasheet
          const iLP_A = iLoad_A + (vOut_V/(2*fsw_Hz*inductance_H))*(1-(vOut_V/vIn_V))
          calcVars.iLP_A.rawVal = iLP_A
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
            <p>This calculator can help you use an MP4558 SMPS IC in your design by calculating all the design parameters (passive component values, frequencies, currents, e.t.c.) based of the equations provided in the datasheet.</p>
              
            <p>The MP4558 datasheet can be found at <a href="https://www.monolithicpower.com/en/documentview/productdocument/index/version/2/document_type/Datasheet/lang/en/sku/MP4558/">https://www.monolithicpower.com/en/documentview/productdocument/index/version/2/document_type/Datasheet/lang/en/sku/MP4558/</a>.
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
              <CalcVarRow
                id="iLoad_A"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="inductorRippleCurrent_perc"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="vIn_V"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="inductance_H"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="iLP_A"
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
            word-break: break-word; // This stops long words/URLS from going past max-width
          }
        `}</style>
      </LayoutCalc>
    )
  } // render
} // CalcUI

export default CalcUI
