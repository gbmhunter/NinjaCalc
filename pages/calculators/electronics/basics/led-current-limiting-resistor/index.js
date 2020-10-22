import Head from 'next/head'
import React from 'react'

import LayoutCalc from 'components/layout-calc'
import CalcVarRow from 'components/calc-var-row'
import { CalcHelper } from 'utils/calc-helper'
import { Validators } from 'utils/validators'
import TileImage from './tile-image.jpg'
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'

export var metadata = {
  id: 'led-current-limiting-resistor', // Make sure this has the same name as the directory this file is in
  name: 'LED Current-Limiting Resistor Calculator',
  description:
    'Calculate the value of a resistor needed to current-limit an LED.',
  categories: ['Electronics', 'Basics'], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: ['electronics', 'current', 'led', 'resistor', 'resistance', 'limit'],
  image: TileImage,
}

class LedForwardVoltages_V {
  static Red = 2.0
  static Orange = 2.0
  static Yellow = 2.1
  static Green = 2.2
  static Blue = 3.3
  static Violet = 3.4
}

class CalcUI extends React.Component {
  constructor(props) {
    super(props)

    let ledColourOptions = []
    for (const colour in LedForwardVoltages_V) {
      ledColourOptions.push(colour)
    }
    // Then add 'Custom' colour (user sets forward voltage)
    ledColourOptions.push('Custom')

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
            helpText: 'The supply voltage (shown as Vcc in the diagram). This may come from a battery, power supply, microcontroller pin, e.t.c.',
          }), // supplyVoltage_V
          ledColour: new CalcVar({
            name: 'LED Colour',
            type: 'select',
            direction: 'input',            
            options: ledColourOptions,
            selOption: 'Red',                        
            validation: {
              fns: [                
              ],
            },
            helpText: 'The colour of the LED, which sets the LED forward voltage drop. Note that these values are approximate only, but usually are good assumptions for most use cases. The slight change in forward voltage due to different LED currents is also not taken into account, but again, this is usually an o.k. approximation. Choose \'Custom\' if you want to specify the forward voltage yourself.',
          }), // ledColour
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
                Validators.isNumber,
                (value, calc) => {
                  if (calc.calcVars.ledForwardVoltage_V.rawVal >= calc.calcVars.supplyVoltage_V.rawVal) {
                    return [ 'error', 'The LED forward voltage drop must be less than the supply voltage.' ]
                  } else {
                    return [ 'ok', '' ]
                  }
                }
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
            helpText: 'The desired LED drive current. For standard indicator LEDs the drive current is typically in the range of 5-20mA.',
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
          resistorPowerDissipation_W: new CalcVar({
            name: 'Resistor Power Dissipation',
            type: 'numeric',
            direction: 'output',
            units: [              
              new UnitsMultiplicative('W', 1),
            ],
            selUnit: 'W',
            metricPrefixes: true,
            sigFig: 4,
            validation: {
              fns: [
                Validators.isNumber
              ],
            },
            helpText: 'The power dissipation in the current-limiting resistor. Make sure the resistor is rated to AT LEAST this power dissipation, and appropriate thermal relief/heat sinking is provided when needed. For lower supply voltages (3.3-12V) and LED currents (1-20mA), standard 0603 to 1206 SMD resistor packages and footprints are usually fine with no extra heatsinking required.',
          }), // resistorPowerDissipation_W
        }, // calcVars
        eqFn: (calc) => {
          const calcVars = calc.calcVars
          
          let ledForwardVoltage_V = null
          if (calcVars.ledColour.selOption == 'Custom') {
            // Allow user to enter custom voltage drop
            calcVars.ledForwardVoltage_V.direction = 'input'
            ledForwardVoltage_V = calcVars.ledForwardVoltage_V.rawVal
          } else {
            // Prevent user from entering in custom voltage drop (set by colour)
            calcVars.ledForwardVoltage_V.direction = 'output'
            // Voltage drop based on selected colour
            ledForwardVoltage_V = LedForwardVoltages_V[calcVars.ledColour.selOption]
            calcVars.ledForwardVoltage_V.rawVal = ledForwardVoltage_V
          }
          const voltageDropResistor = calcVars.supplyVoltage_V.rawVal - ledForwardVoltage_V
          const seriesResistance_Ohms = voltageDropResistor / calcVars.ledCurrent_A.rawVal
          calcVars.seriesResistance_Ohms.rawVal = seriesResistance_Ohms
          // Calculate power dissiaption, P = VI or P = I^2 R
          calcVars.resistorPowerDissipation_W.rawVal = voltageDropResistor * calcVars.ledCurrent_A.rawVal                     
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
            <div className="hbox"><img src={TileImage} style={{ width: '200px', margin: 'auto' }} /></div>
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
                id="supplyVoltage_V"
                calc={this.state.calc}
                valueChanged={this.valueChanged}
                unitsChanged={this.unitsChanged}
                width={varWidth}
              />
              <CalcVarRow
                id="ledColour"
                calc={this.state.calc}
                valueChanged={this.valueChanged}                
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
              <CalcVarRow
                id="resistorPowerDissipation_W"
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

            <p style={{ textAlign: 'center' }}>{String.raw`$$ V_R = V_{CC} - V_{led} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:
              <br />
              \( V_R \) is the voltage drop across the resistor, in \(V\)
              <br />
              {String.raw`\( V_{CC} \) is the supply voltage, in \(V\)`}
              <br />
              {String.raw`\( V_{led} \) is the voltage drop across the LED, at the desired drive current, in \(A\)`}
              <br />
            </p>

            <p>The required resistance is then found using Ohm's law with:</p>
            <p style={{ textAlign: 'center' }}>{String.raw`$$ R = \frac{V_R}{I} $$`}</p>

            <p style={{ textAlign: 'center' }}>
              where:
              <br />
              \( R \) is the resistance of the resistor, in \( \Omega \)
              <br />
              {String.raw`\( I \) is the desired LED current (which is also the current through the LED, since they are in series), in \(A\)`}
              <br />              
            </p>
          </div> {/* calc-notes */}
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
