import Head from 'next/head'
import React from 'react'

import Nav from '~/components/nav'
import Layout from '~/components/layout'
import VarRow from '~/components/VarRow'
import CalcHelper from '~/utils/calc-helper'
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
                if (value > 26.0) { return ['warning', 'Current is above the maximum value (26A) extracted from the universal graph in IPC-2152. Results might not be as accurate (extrapolation will occur).' ]}
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
                if (value < 1.0) return [ 'warning', 'Temp. rise is below the minimum value (1°c) extracted from the universal graph in IPC-2152. Results might not be as accurate (extrapolation will occur).' ]
                if (value > 100.0) return [ 'warning', 'Temp. rise is above the maximum value (100°C) extracted from the universal graph in IPC-2152. Results might not be as accurate (extrapolation will occur).' ]
                return ['ok', '']
              },
            },
            helpText: 'The maximum desired temperature rise due to the current flowing through the track. 20-40°C is a common value for this.',
          }, // tempRise
          unadjustedTrackCrossSectionalArea: {
            name: 'Unadjusted Track Cross-Sectional Area',
            direction: 'output',        
            units: [
              ['um²', 1e-12 ],
              ['mm²', 1e-6 ],    
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
                if (value < 17.5e-6) return [ 'warning', 'Track thickness is below the minimum value (17.5um) extracted from the track thickness modififer graph in IPC-2152. Results might not be as accurate (extrapolation will occur).' ]
                if (value > 105.0036e-6) return [ 'warning', 'Track thickness is above the maximum value (105um) extracted from the track thickness modififer graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
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
                if (value < 0.72e-3) return [ 'warning', 'Board thickness is below the minimum value (0.72mm) extracted from the board thickness modifier graph in IPC-2152.' +
                ' Results might not be as accurate (extrapolation will occur).' ]
                if (value > 2.36e-3) return [ 'warning', 'Board thickness is above the maximum value (2.36mm) extracted from the board thickness modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
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
                if (value < 144e-6) return [ 'warning', 'Plane proximity is below the minimum value (144um) extracted from the plane proximity modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).' ]
                if (value > 2.4e-3) return [ 'warning', 'Plane proximity is above the maximum value (2.40mm) extracted from the plane proximity modifier graph in IPC-2152. Results might not be as accurate (extrapolation will occur).']
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

        }, // calcVars
        eqFn: (calcVars) => {
          const period_s = 1/calcVars.freq.rawVal
          calcVars.period.rawVal = period_s
      
          const timeHigh_s = calcVars.dutyCycle.rawVal * period_s
          calcVars.timeHigh.rawVal = timeHigh_s
      
          const timeLow_s = period_s - timeHigh_s
          calcVars.timeLow.rawVal = timeLow_s
      
          const r1_Ohms = timeLow_s / (0.693*calcVars.capacitance.rawVal)
          calcVars.r1.rawVal = r1_Ohms
      
          const r2_Ohms = timeHigh_s/(0.693*calcVars.capacitance.rawVal) - r1_Ohms
          calcVars.r2.rawVal = r2_Ohms
        },
      }, // calc
    } // this.state
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])

    CalcHelper.initCalc(this.state.calc)
    this.setState({
      calc: this.state.calc
    })

    console.log('Calculator555TimerRtRbC mounted.')
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
          <p style={{ maxWidth: '500px' }}>This calculator calculates the resistances and capacitances needed to operate a 555 timer in astable mode. The duty cycle cannot be set lower than 50%, if you want to do this you will have to attach an inverter to the output.</p>
          <table>
            <tbody>

              <VarRow id="freq" calcVar={calcVars.freq} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="dutyCycle" calcVar={calcVars.dutyCycle} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="capacitance" calcVar={calcVars.capacitance} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="period" calcVar={calcVars.period} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeHigh" calcVar={calcVars.timeHigh} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="timeLow" calcVar={calcVars.timeLow} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r1" calcVar={calcVars.r1} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
              <VarRow id="r2" calcVar={calcVars.r2} valueChanged={this.valueChanged} unitsChanged={this.unitsChanged} width={varWidth} />
            </tbody>
          </table>

          <div style={{ height: 20 }}></div>

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