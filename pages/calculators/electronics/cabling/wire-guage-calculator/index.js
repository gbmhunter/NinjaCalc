import Head from "next/head"
import React from "react"

import LayoutCalc from "~/components/layout-calc"
import VarRowV2 from '~/components/calc-var-row'
import { CalcHelper, Validators } from "~/utils/calc-helper"
import TileImage from "./tile-image.png"
import { Calc } from '~/utils/calc'
import { CalcVar } from '~/utils/calc-var'
import { UnitsMultiplicative } from '~/utils/calc-units'

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
          voltageDrop_perc: new CalcVar({
            name: "Voltage Drop",
            type: 'numeric',
            direction: "input",
            dispVal: "12",
            units: [
              new UnitsMultiplicative("%", 1e0),
            ],
            selUnit: "%",
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
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
                Validators.isNumber
              ],
            },
          }), // cableLength_m
          current_A: new CalcVar({
            name: "Current",
            type: 'numeric',
            direction: "input",
            dispVal: '10',
            units: [              
              new UnitsMultiplicative('m', 1),
            ],
            selUnit: 'm',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
          }), // current_A
          cableResistance_Ohmpm: new CalcVar({
            name: "Cable Resistance",
            type: 'numeric',
            direction: "input",
            dispVal: '3.5',
            units: [              
              new UnitsMultiplicative("Ohm/km", 1e3),
            ],
            selUnit: "Ohm/km",
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
          }), // cableResistance_Ohmpm
        }, // calcVars
        eqFn: (calcVars) => {
          
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

  rbChanged = (e) => {      
    let calc = this.state.calc
    let varName = e.target.value
    for (let calcVarId in calc.calcVars) {
      console.log(calcVarId)
      if (calcVarId == e.target.value) {
        console.log("Setting " + calcVarId + " as output.")
        calc.calcVars[calcVarId].direction = "output"
      } else {
        console.log("Setting " + calcVarId + " as input.")
        calc.calcVars[calcVarId].direction = "input"
      }
    }
    this.setState({
      calc: calc,
    })
  };

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
          <div className="calc-notes">
            <p>
              The following calculator works out either voltage, current or
              resistance, given the other two parameters, using the equation:
            </p>

            <p style={{ textAlign: 'center' }}>$$ V = IR $$</p>

            <p style={{ textAlign: 'center' }}>
              where:
              <br />
              \( V \) = voltage across the resistor
              <br />
              \( I \) = current through the resistor
              <br />
              \( R \) = resistance of the resistor
              <br />
            </p>
          </div>
          <table>
            <tbody>
              <VarRowV2
                id="voltageDrop_perc"
                calcVars={calcVars}
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
  };
}

export default UI
