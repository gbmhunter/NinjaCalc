import Head from 'next/head'
import React from 'react'

import Layout from '~/components/layout'
import VarRowV2 from '~/components/VarRowV2'
import CalcHelper from '~/utils/calc-helper'
import { unitConversionConstants } from '~/utils/unit-conversion-constants'
import TileImage from './tile-image.png'

export var metadata = {
  id: 'track-current-ipc2152', // Make sure this has the same name as the directory this file is in
  name: 'Track Current (IPC-2152)',
  description: 'PCB track current carrying capability calculator, using the IPC-2152 standard.',
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
                if (value > 26.0) { return ['warning', 'Current is above the maximum value (26A) extracted from the universal graph in IPC-2152. Results might not be as accurate (extrapolation will occur).'] }
                return ['ok', '']
              },
            },
            helpText: 'The current you want the PCB track to be able to handle.',
          }, // trackCurrent
          tempRise: {
            name: 'Temperature Rise',
            direction: 'input',
            dispVal: '40',
            rawVal: null,
            units: [
              ['°C', 1e0],
            ],
            selUnit: '°C',
            validation: {
              fn: (value) => {
                if (value < 1.0) return ['warning', 'Temp. rise is below the minimum value (1°c) extracted from the universal graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                if (value > 100.0) return ['warning', 'Temp. rise is above the maximum value (100°C) extracted from the universal graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                return ['ok', '']
              },
            },
            helpText: 'The maximum desired temperature rise due to the current flowing through the track. 20-40°C is a common value for this.',
          }, // tempRise

          // ============================================================================================= //
          // ============================ UN-ADJUSTED TRACK CROSS-SECTIONAL AREA (output) ================ //
          // ============================================================================================= //
          unadjustedTrackCrossSectionalArea: {
            name: 'Unadjusted Track Cross-Sectional Area',
            direction: 'output',
            units: [
              ['um²', 1e-12],
              ['mm²', 1e-6],
            ],
            selUnit: 'um²',
            validation: {
              fn: (value) => {
                return ['ok', '']
              },
            },
            helpText: 'The unadjusted cross-sectional area. This gets multiplied by the many modifiers to give an adjusted cross-sectional area.',
          }, // unadjustedTrackCrossSectionalArea
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
                if (value < 17.5e-6) return ['warning', 'Track thickness is below the minimum value (17.5um) extracted from the track thickness modififer graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                if (value > 105.0036e-6) return ['warning', 'Track thickness is above the maximum value (105um) extracted from the track thickness modififer graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                return ['ok', '']
              },
            },
            helpText: 'The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).'
          }, // trackThickness
          trackThicknessModifier: {
            name: 'Track Thickness Modifier',
            direction: 'output',
            units: [
              ['no unit', 1e0],
            ],
            selUnit: 'no unit',
            sigFig: 3,
            helpText: 'The modifier to adjust the cross-sectional area with based on the track thickness.',
          }, // trackThicknessModifier
          boardThickness: {
            name: 'Board Thickness',
            direction: 'input',
            dispVal: '1.6',
            units: [
              ['mm', 1e-3],
            ],
            selUnit: 'mm',
            validation: {
              fn: (value) => {
                if (value < 0.72e-3) return ['warning', 'Board thickness is below the minimum value (0.72mm) extracted from the board thickness modifier graph in IPC-2152.' +
                  ' Results might not be as accurate (extrapolation will occur).']
                if (value > 2.36e-3) return ['warning', 'Board thickness is above the maximum value (2.36mm) extracted from the board thickness modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                return ['ok', '']
              },
            },
            helpText: 'The total thickness of the PCB that the track is on. A standard PCB thickness is 1.6mm.'
          }, // boardThickness
          boardThicknessModifier: {
            name: 'Board Thickness Modifier',
            direction: 'output',
            units: [
              ['no unit', 1e0],
            ],
            selUnit: 'no unit',
            sigFig: 3,
            helpText: 'The modifier to adjust the cross-sectional area with based on the board thickness.',
          }, // boardThicknessModifier

          // ============================================================================================= //
          // ==================================== IS PLANE PRESENT (combobox) ============================ //
          // ============================================================================================= //


          // ============================================================================================= //
          // ===================================== PLANE PROXIMITY (input) =============================== //
          // ============================================================================================= //
          planeProximity: {
            name: 'Plane Proximity',
            direction: 'input',
            dispVal: '1.6',
            units: [
              ['um', 1e-6],
              ['mm', 1e-3],
            ],
            selUnit: 'mm',
            validation: {
              fn: (value) => {
                if (value < 144e-6) return ['warning', 'Plane proximity is below the minimum value (144um) extracted from the plane proximity modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                if (value > 2.4e-3) return ['warning', 'Plane proximity is above the maximum value (2.40mm) extracted from the plane proximity modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                // TODO: Add check to make sure plane proximity is not greater than board thickness
                return ['ok', '']
              },
            },
            helpText: 'The distance from the current-carrying track to the closest copper plane. If it is a 2-layer 1.6mm PCB, with the current-carrying track on one side and ground on the other side, then the plane proximity would be 1.6mm. For 4 or more layer boards, this value is likely to be much less.'
          }, // planeProximity

          // ============================================================================================= //
          // =============================== PLANE PROXIMITY MODIFIER (output) =========================== //
          // ============================================================================================= //
          planeProximityModifier: {
            name: 'Plane Proximity Modifier',
            direction: 'output',
            units: [
              ['no unit', 1e0],
            ],
            selUnit: 'no unit',
            sigFig: 3,
            helpText: 'The modifier to adjust the cross-sectional area with based on the proximity of a plane to the current-carrying track.',
          }, // planeProximityModifier

          // ============================================================================================= //
          // =================================== THERMAL CONDUCTIVITY (input) ============================ //
          // ============================================================================================= //
          thermalConductivity: {
            name: 'Thermal Conductivity',
            direction: 'input',
            dispVal: '0.20',
            units: [
              ['W/mK', 1e0],
              // TODO: Add BTU/(hour*ft*f) unit  
            ],
            selUnit: 'W/mK',
            validation: {
              fn: (value) => {
                if (value < 180e-3) return ['warning', 'Thermal conductivity is below the minimum value (180mW/mK) extracted from the thermal conductivity modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                if (value > 340e-3) return ['warning', 'Thermal conductivity is above the maximum value (340mW/mK) extracted from the thermal conductivity modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
                // TODO: Add check to make sure plane proximity is not greater than board thickness
                return ['ok', '']
              },
            },
            helpText: 'The thermal conductivity of the PCB. This is normally hard to determine, but for most FR4 PCBs this is around 0.20Wm-1K-1.'
          }, // thermalConductivity

          // ============================================================================================= //
          // ============================ THERMAL CONDUCTIVITY MODIFIER (output) ========================= //
          // ============================================================================================= //
          thermalConductivityModifier: {
            name: 'Thermal Conductivity Modifier',
            direction: 'output',
            units: [
              ['no unit', 1e0],
            ],
            selUnit: 'no unit',
            sigFig: 3,
            helpText: 'The modifier to adjust the cross-sectional area with based on the thermal conductivity of the PCB.',
          }, // thermalConductivityModifier

          // ============================================================================================= //
          // ========================= ADJUSTED TRACK CROSS-SECTIONAL AREA (output) ====================== //
          // ============================================================================================= //
          adjustedTrackCrossSectionalArea: {
            name: 'Adjusted Track Cross-Sectional Area',
            direction: 'output',
            units: [
              ['um²', 1e-12],
              ['mm²', 1e-6],
            ],
            selUnit: 'um²',
            sigFig: 3,
            helpText: 'The adjusted cross-sectional area, which is equal to the unadjusted cross-section area multiplied by all of the modifiers.',
          }, // adjustedTrackCrossSectionalArea

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

          // UNADJUSTED TRACK CROSS-SECTIONAL AREA 
          //======================================

          // Lets calculate the two co-efficients for the fixed-temp trend line
          const universalChartTrendLineCoefA =
            UNIVERSAL_CHART_TREND_LINE_COEF_AA *
            Math.pow(tempRise_degC, UNIVERSAL_CHART_TREND_LINE_COEF_AB)
          const universalChartTrendLineCoefB =
            UNIVERSAL_CHART_TREND_LINE_COEF_BA *
            Math.pow(tempRise_degC, UNIVERSAL_CHART_TREND_LINE_COEF_BB)
          // Now we know the two co-efficients, we can use the trend line eq. y=Ax^B to find the unadjusted cross-sectional area
          const unadjustedTrackCrossSectionalAreaMils2 = Math.pow(
            trackCurrent_A / universalChartTrendLineCoefA,
            1 / universalChartTrendLineCoefB
          )
          // Convert mils^2 to m^2 (store variable values in SI units)
          const unadjustedTrackCrossSectionalArea_m2 =
            unadjustedTrackCrossSectionalAreaMils2 *
            (1 / (NUM_MILS_PER_MM * NUM_MILS_PER_MM * 1e6))
          calcVars.unadjustedTrackCrossSectionalArea.rawVal = unadjustedTrackCrossSectionalArea_m2

          // TRACK THICKNESS MODIFIER 
          //=========================

          // Convert to 'oz' units, as this is what is used in IPC-2152 graphs
          const trackThicknessOz =
            trackThickness_m *
            (1 / unitConversionConstants.COPPER_THICKNESS_M_PER_OZ)
          // Lets calculate the two co-efficients for the fixed-temp trend line
          // double[] trackThicknessTrendLineCoefA = new double[TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length]
          var trackThicknessTrendLineCoefA = []
          // Outer loop calculates all co-efficients
          for (var i = 0; i < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length; i++) {
            // Initialise array element with 0
            trackThicknessTrendLineCoefA[i] = 0
            // Inner loop calculates a single co-efficient
            for (var j = 0; j < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0].length; j++) {
              trackThicknessTrendLineCoefA[i] +=
                TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[i][j] *
                Math.pow(trackThicknessOz, j)
            }
          }
          // Now we have calculate the 5th degree polynomial co-efficients, we can finally calc the thickness modifier
          var trackThicknessModifierMulti = 0
          for (i = 0; i < trackThicknessTrendLineCoefA.length; i++) {
            trackThicknessModifierMulti +=
              trackThicknessTrendLineCoefA[i] * Math.pow(trackCurrent_A, i)
          }
          calcVars.trackThicknessModifier.rawVal = trackThicknessModifierMulti

          // BOARD THICKNESS MODIFIER
          //=========================          

          // Convert to 'mils' units, as this is what is used in IPC-2152 graphs
          const boardThicknessMils =
            boardThickness_m * (1 / unitConversionConstants.METERS_PER_MILS)
          const boardThicknessModifierMulti =
            BOARD_THICKNESS_TREND_LINE_COEF_A *
            Math.pow(boardThicknessMils, BOARD_THICKNESS_TREND_LINE_COEF_B)
          calcVars.boardThicknessModifier.rawVal = boardThicknessModifierMulti

          // PLANE PROXIMITY MODIFIER
          //=========================

          // isPlanePresent should be a string, either 'True' or 'False'
          const isPlanePresent = 'True' // TODO: Fix this
          const planeProximity_m = calcVars.planeProximity.rawVal
          if (isPlanePresent === 'False') {
            // Lets not modify the cross-sectional area by anything if no plane is present
            // (multiply by 1)
            return 1.0
          }
          // Plane must be present at this point
          // Convert to 'mils' units, as this is what is used in IPC-2152 graphs
          const planeProximityMils =
            planeProximity_m * (1 / unitConversionConstants.METERS_PER_MILS)
          const planeProximityModifierMulti =
            PLANE_PROXIMITY_TREND_LINE_COEF_M * planeProximityMils +
            PLANE_PROXIMITY_TREND_LINE_COEF_C
          calcVars.planeProximityModifier.rawVal = planeProximityModifierMulti

          // THERMAL CONDUCTIVITY MODIFIER
          //==============================

          // Convert to BTU/(ft*hour*F), as this is what the IPC-2152 graph used
          const thermalConductivityBtunFtnHournDegF =
            thermalConductivity_WpmK *
            (1 /
              unitConversionConstants.THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF) // eslint-disable-line camelcase
          const thermalConductivityModifierMulti =
            THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M *
            thermalConductivityBtunFtnHournDegF +
            THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C
          calcVars.thermalConductivityModifier.rawVal = thermalConductivityModifierMulti

          // ADJUSTED TRACK CROSS-SECTIONAL AREA
          //====================================
          const adjustedTrackCrossSectionalArea_m2 =
            unadjustedTrackCrossSectionalArea_m2 *
            trackThicknessModifierMulti *
            boardThicknessModifierMulti *
            planeProximityModifierMulti *
            thermalConductivityModifierMulti
          calcVars.adjustedTrackCrossSectionalArea.rawVal = adjustedTrackCrossSectionalArea_m2

          // MIN. TRACK WIDTH
          //=================
          const minimumTrackWidth_m =
            adjustedTrackCrossSectionalArea_m2 / trackThickness_m
          calcVars.minTrackWidth.rawVal = minimumTrackWidth_m

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
            <p>This calculator can find the minimum allowed PCB track width for a given continuous current. Takes into account
            the allowed temperature rise, copper track thickness, proximity to planes, total thickness of the PCB, and PCB
        material in accordance with IPC-2152.</p>

            <p>The calculator uses equations built from the data provided in the IPC-2152 graphs.Data points were extracted
            from the graphs using <a href="http://arohatgi.info/WebPlotDigitizer/">WebPlotDigitizer</a> (a great program
            by-the-way). Suitable trend lines were then fitted. In the case of the three variable graphs, trend lines were
            fitted to the coefficients of the first set of trend lines.</p>

            <p>I believe the accuracy of the calculator (w.r.t. the IPC-2152 graphs) to be quite high, within the range of
            data provided by these graphs. Outside of this, extrapolation could become inaccurate quickly, due to the use of
            5th order polynomial's being used to model some of the data (this was the best choice). Other graph were
            modelled with power equations of the form y=Ax^B, and are likely to be more accurate that the polynomial during
            extrapolation.</p>

            <p>Below is an example of the trend-line fitting process. This image shows the "Copper Thickness Modifier" data
            from IPC-2152, along with 5th order polynomials being fitted to each data set. The data for the 3oz. copper
            weight is a horizontal line at y=1 by definition.</p>

            <img src={require('./ipc-2152-copper-thickness-modifier-graph-with-trendlines.png')} style={{ display: 'block', margin: 'auto', maxWidth: '500px' }} />

            <p>The co-efficients of the above trend lines were then plotted against copper weight (aka. track thickness). The
            graph below is co-efficient C5 (the co-efficient infront of x^5) against copper weight. These had their own
            trend lines fitted. Note that there are only four data points, AND the fitted trend-line is a third-degree
            polynomial, which is guaranteed to fit the data perfectly. This is probably the most dangerous part of the
            "discrete graphed data sets to continuous equations" conversion.</p>

            <img src={require('./ipc-2152-copper-thickness-modifier-copper-weight-versus-c5-graph.png')} style={{ display: 'block', margin: 'auto', maxWidth: '500px' }} />

            <p>The current in assumed to be constant (DC). However, you can use the RMS value for a pulsed current as long as
            the pulses are fast enough.</p>

            <p>The temperature of the PCB material should NEVER exceed the relative thermal index (RTI) of the material. This
            is defined in UL746B as the temperature at which 50% of the materials properties are retained after 100,000
            hours.</p>

            <p>Remember this calculator does not take into account other nearby heat sources.</p>

            <p>This standard is designed to supersede the older IPC-2221A standard. It is designed to produce a more accurate track width calculation, but does require more variables. <a >However, if you do want to use the older IPC-2221A standard, click here</a>.</p>

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