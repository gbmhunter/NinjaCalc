import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'
import VarRowV2 from '~/components/VarRowV2'
import CalcHelper from '~/utils/calc-helper'
import { unitConversionConstants } from '~/utils/unit-conversion-constants'
import TileImage from './tile-image.png'

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
// UNIVERSAL CHART CONSTANTS
// The trendlines to calculate the co-efficients for a fixed temp takes the form y = Ax^B
// where y is the co-efficient, x is the temperature.
// e.g. (co-efficient A) = AA * temp ^ AB
//      (co-efficient B) = BA * temp ^ BB
const UNIVERSAL_CHART_TREND_LINE_COEF_AA = 8.9710902134e-2
const UNIVERSAL_CHART_TREND_LINE_COEF_AB = 3.9379253898e-1
const UNIVERSAL_CHART_TREND_LINE_COEF_BA = 5.0382053698e-1
const UNIVERSAL_CHART_TREND_LINE_COEF_BB = 3.8495772461e-2
// TRACK THICKNESS MODIFIER CONSTANTS
// The data from the track thickness modifier graph in IPS-2152 is modelled using
// a 5th degree polynomial
// y = C0 + C1*x^1 + C2*x^2 + C3*x^3 + C4*x^4 + C5*x^5
const TRACK_THICKNESS_TREND_LINE_COEF_COEF_A = [
  [
    9.8453567795e-1, // C0C0
    -2.2281787548e-1, // C0C1
    2.0061423196e-1, // C0C2
    -4.1541116264e-2 // C0C3
  ],
  [
    -1.657194921e-2, // C1C0
    1.7520059279e-4, // C1C1
    -5.0615234096e-3, // C1C2
    2.281483634e-3 // C1C3
  ],
  [
    8.8711317661e-4, // C2C0
    1.3631745743e-3, // C2C1
    -2.237330971e-4, // C2C2
    -1.0974218613e-4 // C2C3
  ],
  [
    -6.6729255031e-6, // e.t.c...
    -1.4976736827e-4,
    5.8082340133e-5,
    -2.4728159584e-6
  ],
  [-7.9576264561e-7, 5.5788354958e-6, -2.4912026388e-6, 2.4000295954e-7],
  [1.6619678738e-8, -7.1122635445e-8, 3.3800191741e-8, -3.9797591878e-9]
]
// BOARD THICKNESS CONSTANTS
const BOARD_THICKNESS_TREND_LINE_COEF_A = 2.4929779905e1
const BOARD_THICKNESS_TREND_LINE_COEF_B = -7.5501997929e-1
// PLANE PROXIMITY CONSTANTS
const PLANE_PROXIMITY_TREND_LINE_COEF_M = 3.1298662911e-3
const PLANE_PROXIMITY_TREND_LINE_COEF_C = 4.0450883823e-1
// THERMAL CONDUCTIVITY CONSTANTS
const THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M = -1.4210148167
const THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C = 1.1958174134

class UI extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      calc: {
        calcVars: {
          // ============================================================================================= //
          // ======================================= TRACK CURRENT (input) =============================== //
          // ============================================================================================= //
          trackCurrent: {
            name: 'Track Current',
            direction: 'input',
            dispVal: '1',
            units: [
              ['uA', 1e-6],
              ['mA', 1e-3],
              ['A', 1e0],
            ],
            selUnit: 'A',
            validation: {
              fn: (value) => {
                if (value > 35.0) { return ['warning', 'Current is above recommended maximum (35A). Equation will not be as accurate (extrapolation will occur).'] }
                return ['ok', '']
              },
            },
            helpText: 'The current you want the PCB track to be able to handle.',
          }, // trackCurrent

          // ============================================================================================= //
          // ========================================= TEMP RISE (input) ================================= //
          // ============================================================================================= //
          tempRise: {
            name: 'Temperature Rise',
            direction: 'input',
            dispVal: '40',            
            units: [
              ['°C', 1e0],
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
          }, // tempRise

          // ============================================================================================= //
          // ===================================== TRACK THICKNESS (input) =============================== //
          // ============================================================================================= //
          trackThickness: {
            name: 'Track Thickness',
            direction: 'input',
            dispVal: '35',
            units: [
              ['um', 1e-6],
              ['mm', 1e-3],
            ],
            selUnit: 'um',
            validation: {
              fn: (value) => {
                if (value < 17.5e-6) return ['warning', 'Track thickness is below the recommended minimum (17.5um or 0.5oz). Equation will not be as accurate (extrapolation will occur).']
                if (value > 105.0036e-6) return ['warning', 'Track thickness is above the recommended maximum (105um or 3oz). Equation will not be as accurate (extrapolation will occur).']
                return ['ok', '']
              },
            },
            helpText: 'The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).'
          }, // trackThickness

          // ============================================================================================= //
          // ======================================= TRACK LAYER (combobox) ============================== //
          // ============================================================================================= //


          // ============================================================================================= //
          // ===================================== MIN. TRACK WIDTH (output) ============================= //
          // ============================================================================================= //
          minTrackWidth: {
            name: 'Minimum Track Width',
            direction: 'output',
            units: [
              ['um', 1e-6],
              ['mm', 1e-3],
            ],
            selUnit: 'mm',
            sigFig: 3,
            helpText: 'The minimum track width needed to carry the specified current without exceeding the given temperature rise.',
          }, // minTrackWidth
        }, // calcVars

        eqFn: (calcVars) => {
          // Read input variables
          const trackCurrent_A = calcVars.trackCurrent.rawVal
          const tempRise_degC = calcVars.tempRise.rawVal
          const trackThickness_m = calcVars.trackThickness.rawVal
          const boardThickness_m = calcVars.boardThickness.rawVal
          const thermalConductivity_WpmK = calcVars.thermalConductivity.rawVal


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
      <Layout>
        <Head>
          <title>{metadata.name}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className="vbox outer-wrapper">
          <p style={{ maxWidth: '800px' }}>
            <p>This calculator can find the minimum PCB track width (external or internal layer) given the track current, the
        allowed temperature rise, and copper layer thickness.</p>

            <p>Calculated in accordance with the equations in IPC-2221A Section 6.2 (formerly IPC-D-275, the equation has not
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
          </p>
          <table>
            <tbody>
              <VarRowV2 id="trackCurrent" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="tempRise" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="trackThickness" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="boardThickness" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="planeProximity" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="thermalConductivity" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="minTrackWidth" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>
          <p>Intermediate Variables</p>
          <table>
            <tbody>
              <VarRowV2 id="unadjustedTrackCrossSectionalArea" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="trackThicknessModifier" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="boardThicknessModifier" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="planeProximityModifier" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="thermalConductivityModifier" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRowV2 id="adjustedTrackCrossSectionalArea" calcVars={calcVars} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
            </tbody>
          </table>



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