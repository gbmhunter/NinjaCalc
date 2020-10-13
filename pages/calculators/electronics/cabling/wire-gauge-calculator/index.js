import Head from "next/head"
import React from "react"

import LayoutCalc from "components/layout-calc"
import VarRowV2 from 'components/calc-var-row'
import MetricPrefixNote from 'components/metric-prefix-note'
import { CalcHelper } from 'utils/calc-helper'
import { Validators } from 'utils/validators'
import TileImage from "./tile-image.jpg"
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'
import { MaterialResistivitiesOhmm } from 'utils/unit-conversion-constants'

export var metadata = {
  id: "wire-gauge-calculator", // Make sure this has the same name as the directory this file is in
  name: "Wire Gauge Calculator",
  description:
    'Find the right size wire gauge for a particular current and voltage drop.',
  categories: ["Electronics", "Cabling"], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: [ "electronics", 'wire', 'cable', 'gauge', 'AWG', 'current' ],
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
          conductorMaterial: new CalcVar({
            name: "Conductor Material",
            type: 'select',
            direction: "input",
            options: [
              'Aluminium',
              'Copper',
              'Silver',
              'Custom',
            ],
            selOption: 'Copper',
            validation: {
              fns: [
                Validators.isNumber,
                Validators.isPositive,
              ],
            },
            helpText: 'The material of the conductor.',
          }), // conductorMaterial
          conductorResistivity_Ohmm: new CalcVar({
            name: "Conductor Resistivity",
            type: 'numeric',
            direction: "output", // Output by default, but changes to input if conductor material set to "Custom"
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
            helpText: 'The resistivity of the conductor. If you want to enter your own value in here, set the "Conductor Material" to custom.',
          }), // resistivity_Ohmm
          crossSectionalArea_m2: new CalcVar({
            name: "Cross-sectional Area",
            type: 'numeric',
            direction: 'output',            
            units: [              
              new UnitsMultiplicative("mm²", 1e-6),
            ],
            selUnit: "mm²",
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The required cross-sectional area of the conductor in the cable.',
          }), // crossSectionalArea_m2
          gauge_awg: new CalcVar({
            name: "Gauge",
            type: 'numeric',
            direction: 'output',            
            units: [              
              new UnitsMultiplicative("AWG", 1e0),
            ],
            selUnit: "AWG",                   
            format: (rawVal) => {              
              return Math.floor(rawVal)
            },
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The calculated maximum AWG gauge of the cable. The calculated value is rounded down to the nearest integer.'
          }), // gauge_awg
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars
          // Input variables
          const voltageDc_V = calcVars.voltageDc_V.rawVal
          const voltageDrop_perc = calcVars.voltageDrop_perc.rawVal
          const cableLength_m = calcVars.cableLength_m.rawVal
          const current_A = calcVars.current_A.rawVal

          let conductorResistivity_Ohmm = null
          if (calcVars.conductorMaterial.selOption !== 'Custom') {                        
            // Look-up from table, and set the conductor resistivity variable as this is an output
            conductorResistivity_Ohmm = MaterialResistivitiesOhmm[calcVars.conductorMaterial.selOption.toUpperCase()]
            if(!conductorResistivity_Ohmm) throw Error('Resistivity not found for material "' + calcVars.conductorMaterial.selOption.toUpperCase() + '".')
            calcVars.conductorResistivity_Ohmm.rawVal = conductorResistivity_Ohmm
          } else {
            conductorResistivity_Ohmm = calcVars.conductorResistivity_Ohmm.rawVal
          }
            
          const voltageDrop_V = voltageDc_V*(voltageDrop_perc/100.0)
          const cableResistance_Ohms = voltageDrop_V/current_A
          const cableResistance_Ohmspm = cableResistance_Ohms/cableLength_m

          const crossSectionalArea_m2 = conductorResistivity_Ohmm / cableResistance_Ohmspm
          calcVars.crossSectionalArea_m2.rawVal = crossSectionalArea_m2

          // Find diameter of wire from cross-sectional area
          // A = pi * r^2
          // d = 2r
          // d = sqrt(4A/pi)
          const diameter_m = Math.pow(4*crossSectionalArea_m2/Math.PI, 0.5)

          // Find gauge from diameter
          // d_mm = 0.127mm * 92^((36-n)/39
          // n = 36 - 39*(log(d_mm/0.127) / log(92))
          const gauge_awg = 36 - 39*(Math.log((1000*diameter_m)/0.127) / Math.log(92))
          calcVars.gauge_awg.rawVal = gauge_awg
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

    // Change conductor resistivity to input if conductor is set to 'Custom'
    if(e.target.name === 'conductorMaterial') {
      if (e.target.value === 'Custom') {
        calc.calcVars.conductorResistivity_Ohmm.direction = 'input'
      } else {
        calc.calcVars.conductorResistivity_Ohmm.direction = 'output'
      }
    }

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
    const calcVars = this.state.calc.calcVars
    const varWidth = 100

    return (
      <LayoutCalc title={metadata.name}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          <p className="calc-notes">Use this calculator to work out what AWG gauge wire you need to carry a certain a specified current with a maximum allowable voltage drop across the length of the wire.</p>

          <MetricPrefixNote />
          
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
                id="conductorMaterial"
                calcVars={calcVars}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}                            
                width={varWidth}
                showHelpText={true}
              />
              <VarRowV2
                id="conductorResistivity_Ohmm"
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
                id="gauge_awg"
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

            <p>Given the source voltage and percentage voltage drop we can calculate the absolute voltage drop across the entire wire:</p>

            <p>{String.raw`$$ V_{cable} = V_{source} \cdot \frac{V_{cable, perc}}{100} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              {String.raw`\( V_{cable} \)`} is the voltage drop across the total length of cable, in \(V\)<br/>
              {String.raw`\( V_{source} \)`} is the voltage at the input to the cable, in \(V\)<br/>
              {String.raw`\( V_{cable, perc} \)`} is the desired maximum percentage voltage drop across the total length of the cable, as a percentage
            </p>

            <p>From this we can find the total resistance of the cable using Ohm's law:</p>

            <p>{String.raw`$$ R_{cable} = \frac{V_{cable}}{I_{cable}} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              {String.raw`\( R_{cable} \)`} is the total resistance of the cable, in \(\Omega\)<br/>              
              {String.raw`\(I_{cable}\)`} is the current through the cable, in \(A\)
            </p>

            <p>We can divide this by the length to get the resistance per meter of cable:</p>

            <p>{String.raw`$$ R_{\Omega / m} = \frac{R_{cable}}{L} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              {String.raw`\( R_{\Omega / m} \)`} is the resistance per meter of cable, in {String.raw`\( \Omega \cdot m^{-1} \)`}<br/>              
              {String.raw`\(L\)`} is the length of the cable, in {String.raw`\(m\)`}
            </p>

            <p>We can then calculate the cross-sectional area of the cable using the resistance per meter and the resistivity of the conductor (the resistivity is a property of the material the conductor is made from):</p>

            <p>{String.raw`$$ A = \frac{\rho}{R_{\Omega / m}}$$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              {String.raw`\(A\)`} is the cross-sectional area, in \(m^2\)<br/>              
              {String.raw`\(\rho\)`} is the resistivity of the conductor (e.g. copper), in {String.raw`\(\Omega \cdot m\)`}
            </p>

            <p>We can then find the diameter of the cable from this cross-sectional area:</p>

            <p>{String.raw`$$ d = \sqrt{\frac{4A}{\pi}} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              {String.raw`\(d\)`} is the diameter of the cable, in \(m\)<br/>
            </p>

            <p>Now we just need to convert this cable diameter into an AWG gauge. To convert from an AWG gauge to a cable diameter we can use the equation:</p>

            <p>{String.raw`$$ d = 0.127e^{-3} \cdot 92^{\frac{36-n}{39}} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:<br/>
              \(d\) is the diameter of the cable, in \(m\).<br/>
              \(n\) is the AWG wire gauge<br/>
              note: \(0.127mm\) is the diameter of wire gauge #36.
            </p>

            <p>However, we need to solve this for \(n\), so re-arranging the equation gives:</p>

            <p>{String.raw`$$ n = 36 - 39\frac{log(\frac{d}{0.127e^{-3}})}{log{92}} $$`}</p>

            <p>All done! Remember that the above equation will likely give you a number with decimal places. AWG gauges are typically supplied in integer jumps, so it's best to round down to the nearest integer (a lower gauge is a larger diameter wire, giving you some safety factor).</p>

            <p>These equations do not consider the thermal effects of the power dissipation in the cable due to the cables resistance. They are also only suitable for DC currents, as they do not take into account the skin effects.</p>
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
