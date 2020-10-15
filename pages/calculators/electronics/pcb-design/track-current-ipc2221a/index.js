import Head from 'next/head'
import React from 'react'

import Layout from 'components/layout-calc'
import CalcVarRow from 'components/calc-var-row'
import MetricPrefixNote from 'components/metric-prefix-note'
import CalcHelper from 'utils/calc-helper'
import TileImage from './tile-image.png'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'

export var metadata = {
  id: 'track-current-ipc2221a', // Make sure this has the same name as the directory this file is in
  name: 'Track Current (IPC-2221a)',  
  description: 'PCB track current carrying capability calculator, using the IPC-2221a standard.',
  categories: ['Electronics', 'PCB Design'],
  tags: ['pcb', 'track', 'net', 'current', 'trace', 'width', 'carry', 'heat', 'hot', 'temperature', 'ipc', 'ipc2221a', 'ipc-2221a'],
  image: TileImage,
}

// ============================================================================================= //
// ============================================ CONSTANTS ====================================== //
// ============================================================================================= //
const NUM_MILS_PER_MM = 1000 / 25.4

class UI extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      calc: {
        calcVars: {
          // ============================================================================================= //
          // ======================================= TRACK CURRENT (input) =============================== //
          // ============================================================================================= //
          trackCurrent: new CalcVar({
            name: 'Track Current',
            type: 'numeric',
            direction: 'input',
            dispVal: '1',
            metricPrefixes: true,
            units: [
              new UnitsMultiplicative('A', 1e0),
            ],
            selUnit: 'A',
            validation: {
              fn: (value) => {
                if (value > 35.0) { return ['warning', 'Current is above recommended maximum (35A). Equation will not be as accurate (extrapolation will occur).'] }
                return ['ok', '']
              },
            },
            helpText: 'The current you want the PCB track to be able to handle.',
          }), // trackCurrent

          // ============================================================================================= //
          // ========================================= TEMP RISE (input) ================================= //
          // ============================================================================================= //
          tempRise: new CalcVar({
            name: 'Temperature Rise',
            type: 'numeric',
            direction: 'input',
            dispVal: '40',
            metricPrefixes: true,
            units: [
              new UnitsMultiplicative('°C', 1e0),
            ],
            selUnit: '°C',
            validation: {
              fn: (value) => {
                if (value < 10.0) return ['warning', 'Temperature rise is below the recommended minimum (10°C). Equation will not be as accurate (extrapolation will occur).']
                if (value > 100.0) return ['warning', 'Temperature rise is above the recommended maximum (100°C). Equation will not be as accurate (extrapolation will occur).']
                return ['ok', '']
              },
            },
            helpText: 'The maximum desired temperature rise due to the current flowing through the track. 20-40°C is a common value for this.',
          }), // tempRise

          // ============================================================================================= //
          // ===================================== TRACK THICKNESS (input) =============================== //
          // ============================================================================================= //
          trackThickness: new CalcVar({
            name: 'Track Thickness',
            type: 'numeric',
            direction: 'input',
            dispVal: '35u',
            metricPrefixes: true,
            units: [
              new UnitsMultiplicative('m', 1e0),
            ],
            selUnit: 'm',
            validation: {
              fn: (value) => {
                if (value < 17.5e-6) return ['warning', 'Track thickness is below the recommended minimum (17.5um or 0.5oz). Equation will not be as accurate (extrapolation will occur).']
                if (value > 105.0036e-6) return ['warning', 'Track thickness is above the recommended maximum (105um or 3oz). Equation will not be as accurate (extrapolation will occur).']
                return ['ok', '']
              },
            },
            helpText: 'The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).'
          }), // trackThickness

          // ============================================================================================= //
          // ======================================= TRACK LAYER (combobox) ============================== //
          // ============================================================================================= //
          trackLayer: new CalcVar({
            name: 'Track Layer',
            type: 'select',
            options: [
              'External',
              'Internal',
            ],
            selOption: 'External',
            helpText: 'The type of layer that the current-carrying track is on. If the track is on the top or bottom copper layer of the PCB, set this to "External". If the track is on a buried layer, set this to "Internal".'
          }), // trackLayer

          // ============================================================================================= //
          // ===================================== MIN. TRACK WIDTH (output) ============================= //
          // ============================================================================================= //
          minTrackWidth: new CalcVar({
            name: 'Minimum Track Width',
            type: 'numeric',
            direction: 'output',
            metricPrefixes: true,
            units: [              
              new UnitsMultiplicative('m', 1e0),
            ],
            selUnit: 'm',
            sigFig: 3,
            helpText: 'The minimum track width needed to carry the specified current without exceeding the given temperature rise.',
          }), // minTrackWidth
        }, // calcVars

        eqFn: (calcVars) => {
          // Read input variables
          const trackCurrent_A = calcVars.trackCurrent.rawVal
          const tempRise_degC = calcVars.tempRise.rawVal
          const trackThickness_m = calcVars.trackThickness.rawVal
          const trackLayer = calcVars.trackLayer.selOption

          let width_m = null
          if (trackLayer === 'External') {
            const crossSectionalArea = Math.pow(
              trackCurrent_A / (0.048 * Math.pow(tempRise_degC, 0.44)),
              1 / 0.725
            )
            width_m =
              crossSectionalArea /
              (trackThickness_m * 1000000.0 / 25.4) *
              (25.4 / 1000000.0)
            
          } else if (trackLayer === 'Internal') {
            const crossSectionalArea = Math.pow(
              trackCurrent_A / (0.024 * Math.pow(tempRise_degC, 0.44)),
              1 / 0.725
            )
            width_m =
              crossSectionalArea /
              (trackThickness_m * 1000000.0 / 25.4) *
              (25.4 / 1000000.0)
            
          }
          calcVars.minTrackWidth.rawVal = width_m
        }, // eqFn
      }, // calc
    } // this.state
    CalcHelper.initCalc(this.state.calc)
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])
  } // componentDidMount()

  valueChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleValueChanged(calc, e)
    this.setState({
      calc: calc
    })
  }

  unitsChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleUnitsChanged(calc, e)
    this.setState({
      calc: calc
    })
  }

  render = () => {

    // Area of ring = pi * inner diameter * thickness
    const calcVars = this.state.calc.calcVars
    const varWidth = 100

    return (
      <Layout title={metadata.name + ' Calculator'}>
        <Head>
          <title>{metadata.name}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <div style={{ maxWidth: '800px' }}>
            <p>This calculator can find the minimum PCB track width (external or internal layer) given the track current, the
        allowed temperature rise, and copper layer thickness.</p>

            <MetricPrefixNote />
          </div>
          <table>
            <tbody>
              <CalcVarRow id="trackCurrent" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <CalcVarRow id="tempRise" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <CalcVarRow id="trackThickness" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <CalcVarRow id="trackLayer" calc={this.state.calc} valueChanged={this.valueChanged} width={varWidth}/>
              <CalcVarRow id="minTrackWidth" calc={this.state.calc} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
            </tbody>
          </table>

          <div style={{ height: '50px' }}></div>

          <div style={{ maxWidth: '800px' }}>

            <p>Track current is calculated in accordance with the equations in IPC-2221A Section 6.2 (formerly IPC-D-275, the equation has not
            changed between these two standards amd you can get similar values by curve-fitting to the graphs provided in
        IPC-D-275, drawn in 1954, woah!</p>

            <p>$$ I = k\Delta T^b A^c $$</p>

            <p style={{ textAlign: 'center' }}>where:<br />
              \( k \) = 0.048 for external traces, 0.024 for internal tracks<br />
              {String.raw`\( \Delta T \) = the change in temperature (temperature rise) in \( ^{\circ}C \)`}<br />
              \( b \) = 0.44<br />
              \( A \) = cross-sectional area in \( mils^2 \)<br />
              \( c \) = 0.725<br />
            </p>

            <p>The standard only covers values where the current is 0-35A, track width is 0-10.16mm, temperature rise is from
            10-100C, and the copper from 0.5-3oz. Values outside this range are extrapolated (and there more error-prone) and
        will turn orange.</p>

            <p>This also assumes the track is sufficiently long enough the the end-points do not have a significant effect on the
            heatsinking. For example, this calculator should not be used for calculating the width of thermal-relief style
            connections from a copper pour to a via, in where the track is very short (0.2-1.0mm). It also assumes there are no
        vias along the length of the track.</p>

            <p>The current in assumed to be constant (DC). However, you can use the RMS value for a pulsed current as long as the
        pulses are fast enough.</p>

            <p>The temperature of the PCB material should NEVER exceed the relative thermal index (RTI) of the material. This is
        defined in UL746B as the temperature at which 50% of the materials properties are retained after 100,000 hours.</p>

            <p>Remember this calculator does not take into account other nearby heat sources.</p>

            <p>The IPC-2152 standard supersedes this standard. It is designed to produce a more accurate track width calculation, but does require more variables.
        <a>Click here to open an IPC-2152 calculator</a>.</p>
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