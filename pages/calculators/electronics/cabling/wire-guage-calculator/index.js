import Head from "next/head"
import React from "react"

import LayoutCalc from "components/layout-calc"
import VarRowV2 from 'components/calc-var-row'
import { CalcHelper, Validators } from "utils/calc-helper"
import TileImage from "./tile-image.jpg"
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'

export var metadata = {
  id: "wire-guage-calculator", // Make sure this has the same name as the directory this file is in
  name: "Wire Guage Calculator",
  description:
    'Find the right size wire guage for a particular current and voltage drop.',
  categories: ["Electronics", "Cabling"], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: [ "electronics", 'wire', 'cable', 'guage', 'AWG', 'current' ],
  image: TileImage,
}

class UI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calc: new Calc({
        calcVars: {
          voltageDc_V: new CalcVar({
            name: "Voltage (DC)",
            type: 'numeric',
            direction: "input",
            dispVal: "12",
            units: [
              new UnitsMultiplicative("V", 1e0),
            ],
            selUnit: "V",
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber,
                Validators.isPositive,
              ],
            },
            helpText: 'The source voltage provided to the cable.',
          }), // voltageDc_V
          voltageDrop_perc: new CalcVar({
            name: "Voltage Drop",
            type: 'numeric',
            direction: "input",
            dispVal: "2",
            units: [
              new UnitsMultiplicative("%", 1e0),
            ],
            selUnit: "%",
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber,
                Validators.isPositive,
              ],
            },
            helpText: 'The acceptable voltage drop across the length of the cable, as a percentage.',
          }), // voltageDrop_perc
          cableLength_m: new CalcVar({
            name: "Cable Length",
            type: 'numeric',
            direction: "input",
            dispVal: "5",
            units: [
              new UnitsMultiplicative("m", 1),
            ],
            selUnit: 'm',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber,
                Validators.isPositive,
              ],
            },
            helpText: 'The length of the cable.',
          }), // cableLength_m
          current_A: new CalcVar({
            name: "Current",
            type: 'numeric',
            direction: "input",
            dispVal: '10',
            units: [              
              new UnitsMultiplicative('A', 1),
            ],
            selUnit: 'A',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber,
                Validators.isPositive,
              ],
            },
            helpText: 'The current you want the wire to take.'
          }), // current_A
          resistivity_Ohmm: new CalcVar({
            name: "Conductor Resistivity",
            type: 'numeric',
            direction: "input",
            dispVal: '1.68e-8',
            units: [              
              new UnitsMultiplicative("Ωm", 1e0),
            ],
            selUnit: "Ωm",
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber,
                Validators.isPositive,
              ],
            },
            helpText: 'The resistivity of the conductor. Copper has a resistivity of 1.68e-8Ωm.',
          }), // resistivity_Ohmm
          crossSectionalArea_m2: new CalcVar({
            name: "Cross-sectional Area",
            type: 'numeric',
            direction: 'output',            
            units: [              
              new UnitsMultiplicative("mm^2", 1e-6),
            ],
            selUnit: "mm^2",
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The required cross-sectional area of the conductor in the cable.',
          }), // crossSectionalArea_m2
          guage_awg: new CalcVar({
            name: "Guage (AWG)",
            type: 'numeric',
            direction: 'output',            
            units: [              
              new UnitsMultiplicative("no unit", 1e0),
            ],
            selUnit: "no unit",                   
            format: (rawVal) => {              
              return Math.floor(rawVal)
            },
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The calculated AWG value is rounded down to the nearest integer.'
          }), // guage_awg
        }, // calcVars
        eqFn: (calcVars) => {
          // Input variables
          const voltageDc_V = calcVars.voltageDc_V.rawVal
          const voltageDrop_perc = calcVars.voltageDrop_perc.rawVal
          const cableLength_m = calcVars.cableLength_m.rawVal
          const current_A = calcVars.current_A.rawVal
          const resistivity_Ohmm = calcVars.resistivity_Ohmm.rawVal

          const voltageDrop_V = voltageDc_V*(voltageDrop_perc/100.0)
          const cableResistance_Ohms = voltageDrop_V/current_A
          const cableResistance_Ohmspm = cableResistance_Ohms/cableLength_m

          const crossSectionalArea_m2 = resistivity_Ohmm / cableResistance_Ohmspm
          calcVars.crossSectionalArea_m2.rawVal = crossSectionalArea_m2

          // Find diameter of wire from cross-sectional area
          // A = pi * r^2
          // d = 2r
          // d = sqrt(4A/pi)
          const diameter_m = Math.pow(4*crossSectionalArea_m2/Math.PI, 0.5)

          // Find guage from diameter
          // d_mm = 0.127mm * 92^((36-n)/39
          // n = 36 - 39*(log(d_mm/0.127) / log(92))
          const guage_awg = 36 - 39*(Math.log((1000*diameter_m)/0.127) / Math.log(92))
          calcVars.guage_awg.rawVal = guage_awg
        },
      }), // calc
    } // this.state
    CalcHelper.initCalc(this.state.calc)
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(["Typeset", MathJax.Hub])
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
  }

  render = () => {
    // Area of ring = pi * inner diameter * thickness
    const calcVars = this.state.calc.calcVars
    const varWidth = 100

    return (
      <LayoutCalc title={metadata.name + ' Calculator'}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          <p className="calc-notes">Use this calculator to work out what AWG guage wire you need to carry a certain a specified current with a maximum allowable voltage drop across the length of the wire.</p>
          <table>
            <tbody>
              <VarRowV2
                id="voltageDc_V"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="voltageDrop_perc"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="cableLength_m"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="current_A"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="resistivity_Ohmm"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="crossSectionalArea_m2"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="guage_awg"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
            </tbody>
          </table>

          <div style={{ height: '50px' }}></div>
          <div className="calc-notes">

            <p>To convert from an AWG guage to a cable diameter we can use the equation:</p>

            <p>{String.raw`$$ d = 0.127 \cdot 92^{\frac{36-n}{39}} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              \(d\) is the diameter of the cable, in mm.<br/>
              \(n\) is the AWG wire guage<br/>
              \(0.127mm\) is the diameter of wire guage #36.
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

export default UI
